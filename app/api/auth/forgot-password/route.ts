import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import z from "zod";
import { emailTemplates, sendTemplatedEmail } from "@/lib/email";
import {
  checkRateLimit,
  getRateLimitIdentifier,
  rateLimitResponse,
  rateLimitPresets,
} from "@/lib/rate-limit";

// POST /api/auth/forgot-password
// Initiates password reset by generating a token and saving it in PasswordReset

const forgotPasswordSchema = z.object({
  email: z.string().email(`Invalid email address`),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 attempts per hour
    const identifier = getRateLimitIdentifier(request);
    const rateCheck = checkRateLimit(
      `auth:forgot:${identifier}`,
      rateLimitPresets.passwordReset,
    );
    if (!rateCheck.success) return rateLimitResponse(rateCheck);

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return same message to prevent email enumeration
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a password reset link has been sent.",
        },
        { status: 200 },
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes from now

    // Save token in PasswordReset table
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const resetUrl = `${
      process.env.AUTH_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000"
    }/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const template = emailTemplates.passwordReset(user?.name || "there", resetUrl);
    await sendTemplatedEmail(email, template);

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, a password reset link has been sent.",
        ...(process.env.NODE_ENV === "development" && { token }),
      },
      { status: 200 },
    );
  } catch (error: any) {
    logger.error(`Forgot password error: ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// This endpoint works for all roles and securely generates a reset token.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
