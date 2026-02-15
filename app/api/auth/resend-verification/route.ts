import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";
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

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
    .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0097b2 0%, #007a91 100%); color: white; padding: 40px 20px; text-align: center; }
    .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
    .header-title { font-size: 24px; font-weight: 600; margin-bottom: 5px; }
    .body { padding: 40px; }
    .greeting { margin-bottom: 20px; color: #1f2937; font-size: 16px; }
    .content-text { color: #4b5563; margin-bottom: 20px; font-size: 14px; line-height: 1.8; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { display: inline-block; padding: 14px 40px; background-color: #0097b2; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; }
    .warning-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #92400e; }
    .link-section { margin: 25px 0; padding: 15px; background-color: #f9fafb; border-radius: 4px; }
    .link-section p { color: #6b7280; font-size: 13px; margin-bottom: 8px; }
    .link-text { color: #0097b2; word-break: break-all; font-size: 12px; font-family: monospace; }
    .footer { background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer-text { color: #6b7280; font-size: 13px; margin-bottom: 8px; }
    .footer-brand { font-weight: 600; color: #1f2937; font-size: 14px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">EVA</div>
      <div class="header-title">Verify Your Email Address</div>
    </div>
    <div class="body">
      <div class="greeting">Hi ${user.name},</div>
      <div class="content-text">
        You requested a new verification link. To complete your registration and start connecting with amazing event service providers, please verify your email address.
      </div>
      <div class="button-container">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      <div class="warning-box">
        ⏰ <strong>Important:</strong> This verification link will expire in 24 hours for security reasons.
      </div>
      <div class="content-text">
        If the button doesn't work, copy and paste this link into your browser:
      </div>
      <div class="link-section">
        <p>Verification Link:</p>
        <div class="link-text">${verificationUrl}</div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-brand">Eva Marketplace</div>
      <div class="footer-text">Connecting you with the best event service providers</div>
    </div>
  </div>
</body>
</html>`;

    try {
      await sendEmail({
        to: email,
        subject: "Verify Your Email Address - Eva Marketplace",
        html: htmlContent,
      });
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
