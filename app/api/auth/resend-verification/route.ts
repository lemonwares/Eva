import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import { emailTemplates, sendTemplatedEmail } from "@/lib/email";
import {
  resendVerificationSchema,
  formatValidationErrors,
} from "@/lib/validations";
import {
  checkRateLimit,
  getRateLimitIdentifier,
  rateLimitResponse,
  rateLimitPresets,
} from "@/lib/rate-limit";

// POST /api/auth/resend-verification
// Resends email verification token for unverified users
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 attempts per 15 minutes
    const identifier = getRateLimitIdentifier(request);
    const rateCheck = checkRateLimit(
      `auth:resend:${identifier}`,
      rateLimitPresets.auth,
    );
    if (!rateCheck.success) return rateLimitResponse(rateCheck);

    const body = await request.json();
    const parsed = resendVerificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: formatValidationErrors(parsed.error.issues),
        },
        { status: 400 },
      );
    }
    const { email } = parsed.data;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return generic success to prevent email enumeration
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a verification link has been sent",
        },
        { status: 200 },
      );
    }

    // Check if already verified
    if (user.emailVerifiedAt) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 },
      );
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");

    // Save token in EmailVerification table
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Build verification URL and send email
    const verificationUrl = `${
      process.env.AUTH_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000"
    }/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    try {
      const template = emailTemplates.verifyEmail(user.name, verificationUrl);
      await sendTemplatedEmail(email, template);
    } catch (emailError) {
      logger.error("Failed to send verification email:", emailError);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json(
      {
        message: "Verification email sent",
        ...(process.env.NODE_ENV === "development" && { token }),
      },
      { status: 200 },
    );
  } catch (error: any) {
    logger.error(`Resend verification error: ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// This endpoint works for all roles except admin and resends the verification token.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
