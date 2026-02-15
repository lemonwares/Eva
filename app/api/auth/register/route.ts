import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { emailTemplates } from "@/templates/templateLoader";
import { sendEmail } from "@/lib/mail";
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

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "CLIENT",
        emailVerifiedAt: null,
      },
    });

    // Create email verification token and send email
    {
      // Generate token ONCE and use for both DB and email
      const token = crypto.randomBytes(32).toString("hex");

      // Save token to DB
      const verificationRecord = await prisma.emailVerification.create({
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

        // Inline the HTML template directly
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
    .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 40px 20px; text-align: center; }
    .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
    .header-title { font-size: 24px; font-weight: 600; margin-bottom: 5px; }
    .body { padding: 40px; }
    .greeting { margin-bottom: 20px; color: #1f2937; font-size: 16px; }
    .content-text { color: #4b5563; margin-bottom: 20px; font-size: 14px; line-height: 1.8; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { display: inline-block; padding: 14px 40px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease; }
    .button:hover { background-color: #4f46e5; }
    .warning-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #92400e; }
    .link-section { margin: 25px 0; padding: 15px; background-color: #f9fafb; border-radius: 4px; }
    .link-section p { color: #6b7280; font-size: 13px; margin-bottom: 8px; }
    .link-text { color: #6366f1; word-break: break-all; font-size: 12px; font-family: monospace; }
    .footer { background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer-text { color: #6b7280; font-size: 13px; margin-bottom: 8px; }
    .footer-brand { font-weight: 600; color: #1f2937; font-size: 14px; }
    .divider { height: 1px; background-color: #e5e7eb; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">🎉 Eva</div>
      <div class="header-title">Verify Your Email Address</div>
    </div>
    <!-- Body -->
    <div class="body">
      <div class="greeting">Hi ${name},</div>
      <div class="content-text">
        Welcome to Eva! We're excited to have you on board. To complete your registration and start connecting with amazing event service providers, please verify your email address.
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
      <div class="divider"></div>
      <div class="content-text">
        If you didn't create an account with Eva, you can safely ignore this email. Your email address will not be used.
      </div>
    </div>
    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">Eva Marketplace</div>
      <div class="footer-text">Connecting you with the best event service providers</div>
      <div class="footer-text">📧 hello@evalocal.com</div>
    </div>
  </div>
</body>
</html>`;

        const emailResult = await sendEmail({
          to: email,
          subject: "Verify Your Email Address - Eva Marketplace",
          html: htmlContent,
        });
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
