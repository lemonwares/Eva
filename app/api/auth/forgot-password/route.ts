import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import z from "zod";
import { emailTemplates } from "@/templates/templateLoader";
import { sendEmail } from "@/lib/mail";
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

    // Inline the HTML template directly with modern design
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Reset Your Password</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Red Hat Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; color: #0f172a; margin: 0; padding: 0; line-height: 1.6; -webkit-font-smoothing: antialiased; }
    .email-wrapper { background: #fafafa; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; box-shadow: 0 4px 24px rgba(124, 58, 237, 0.08); overflow: hidden; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 48px 32px; text-align: center; }
    .header-icon { font-size: 56px; margin-bottom: 16px; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #ffffff; margin-bottom: 16px; }
    .header-title { font-size: 26px; font-weight: 700; color: #ffffff; margin-bottom: 0; line-height: 1.3; }
    .body { padding: 40px 32px; }
    .greeting { font-size: 18px; color: #0f172a; margin-bottom: 20px; font-weight: 600; }
    .content-text { color: #475569; margin-bottom: 24px; font-size: 15px; line-height: 1.8; }
    .button-container { text-align: center; margin: 36px 0; }
    .button { display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35); }
    .warning-box { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 4px solid #f59e0b; padding: 18px 24px; margin: 28px 0; border-radius: 12px; font-size: 14px; color: #92400e; line-height: 1.6; }
    .security-box { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; padding: 18px 24px; margin: 28px 0; border-radius: 12px; font-size: 14px; color: #1e40af; line-height: 1.7; }
    .link-section { margin: 28px 0; padding: 20px 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
    .link-section-label { color: #64748b; font-size: 13px; font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .link-text { color: #7c3aed; word-break: break-all; font-size: 13px; font-family: 'SF Mono', 'Monaco', monospace; background: #ffffff; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; display: block; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 28px 0; }
    .recommendations { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #10b981; padding: 20px 24px; margin: 28px 0; border-radius: 12px; }
    .recommendations-title { color: #065f46; font-weight: 700; font-size: 15px; margin-bottom: 14px; }
    .recommendations ul { list-style: none; padding: 0; margin: 0; color: #047857; font-size: 14px; }
    .recommendations li { margin-bottom: 10px; padding-left: 24px; position: relative; line-height: 1.5; }
    .recommendations li::before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: 700; }
    .footer { background: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-logo { font-weight: 800; color: #7c3aed; font-size: 18px; letter-spacing: 2px; margin-bottom: 8px; }
    .footer-tagline { color: #64748b; font-size: 13px; margin-bottom: 12px; }
    .footer-contact { color: #94a3b8; font-size: 13px; }
    .footer-contact a { color: #7c3aed; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="header-icon">🔐</div>
        <div class="logo">EVA</div>
        <div class="header-title">Reset Your Password</div>
      </div>
      <div class="body">
        <div class="greeting">Hi ${user?.name || "there"},</div>
        <div class="content-text">
          We received a request to reset your password for your EVA account. Click the button below to create a new password:
        </div>
        <div class="button-container">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        <div class="warning-box">
          ⏰ <strong>Important:</strong> This password reset link will expire in <strong>30 minutes</strong> for security reasons.
        </div>
        <div class="content-text" style="margin-bottom: 12px;">
          If the button doesn't work, copy and paste this link into your browser:
        </div>
        <div class="link-section">
          <div class="link-section-label">Password Reset Link</div>
          <div class="link-text">${resetUrl}</div>
        </div>
        <div class="divider"></div>
        <div class="security-box">
          🛡️ <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged and your account is secure. If you believe your account is compromised, contact us at <a href="mailto:hello@evalocal.com" style="color: #1e40af; font-weight: 600;">hello@evalocal.com</a>
        </div>
        <div class="recommendations">
          <div class="recommendations-title">🔒 Security Recommendations</div>
          <ul>
            <li>Use a strong, unique password with numbers and symbols</li>
            <li>Don't share your password with anyone</li>
            <li>Never click links from suspicious emails</li>
            <li>Enable two-factor authentication when available</li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <div class="footer-logo">EVA</div>
        <div class="footer-tagline">Connecting you with the best event service providers</div>
        <div class="footer-contact"><a href="mailto:hello@evalocal.com">hello@evalocal.com</a></div>
      </div>
    </div>
  </div>
</body>
</html>`;

    await sendEmail({
      to: email,
      subject: `Password Reset Request - Eva Marketplace`,
      html: htmlContent,
    });

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
