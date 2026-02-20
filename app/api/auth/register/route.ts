import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { emailTemplates, sendTemplatedEmail } from "@/lib/email";
import { registerSchema, formatValidationErrors } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { checkRateLimit, getRateLimitIdentifier, rateLimitResponse, rateLimitPresets } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 attempts per 15 minutes
    const identifier = getRateLimitIdentifier(request);
    const rateCheck = checkRateLimit(`auth:register:${identifier}`, rateLimitPresets.auth);
    if (!rateCheck.success) return rateLimitResponse(rateCheck);

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: formatValidationErrors(parsed.error.issues),
        },
        { status: 400 },
      );
    }
    const { email, name, password, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isAdministrator = role === "ADMINISTRATOR";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "CLIENT",
        emailVerifiedAt: isAdministrator ? new Date() : null,
      },
    });

    // Create email verification token and send email (unless admin)
    if (!isAdministrator) {
      // Generate token ONCE and use for both DB and email
      const token = crypto.randomBytes(32).toString("hex");

      // Save token to DB
      await prisma.emailVerification.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      // Use the same token for the email link
      try {
        const verificationUrl = `${
          process.env.AUTH_URL ||
          process.env.NEXTAUTH_URL ||
          "http://localhost:3000"
        }/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

        const template = emailTemplates.verifyEmail(name, verificationUrl);
        await sendTemplatedEmail(email, template);
        logger.info("Verification email sent to:", email);
      } catch (emailError) {
        // Log email error but don't fail registration
        logger.error("Failed to send verification email:", emailError);
        // In development, we can continue without email
      }

      return NextResponse.json(
        {
          message:
            "Registration successful. Please check your email to verify your account.",
          userId: user.id,
          ...(process.env.NODE_ENV === "development" && { token }),
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        message: "Registration successful. You can now log in.",
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Registration error:", message);

    // Check for specific Prisma errors
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
