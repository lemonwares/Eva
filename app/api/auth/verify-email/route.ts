import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { emailTemplates } from "@/templates/templateLoader";

// GET /api/auth/verify-email?token=xxx
// Alternative endpoint for email link verification via query params
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Reuse the verification logic by calling the shared function below
    return await handleVerification(token);
  } catch (error: any) {
    console.error(`Email verification error (GET): ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/auth/verify-email
// Verifies a user's email using a token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    // Log for debugging - helps identify if body parsing is the issue
    console.log("Verify email request body:", { token, fullBody: body });

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Delegate to shared verification handler
    return await handleVerification(token);
  } catch (error: any) {
    console.error(`Email verification error (POST): ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Shared verification logic for both GET and POST handlers
async function handleVerification(token: string) {
  try {
    console.log("Looking up verification token:", token);

    // Find verification record by token
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true },
    });

    if (verification) {
      console.log("Verification record found:", verification);
    } else {
      console.log("Verification record found: No");
    }

    if (!verification) {
      console.log("Error: Verification token not found in database");
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (verification.expiresAt && new Date() > verification.expiresAt) {
      console.log("Error: Token expired at", verification.expiresAt);
      return NextResponse.json(
        { message: "Verification token has expired" },
        { status: 400 }
      );
    }

    // If already verified, allow re-verification for 2 minutes
    if (verification.verifiedAt) {
      const verifiedAt = new Date(verification.verifiedAt);
      const now = new Date();
      const diffMs = now.getTime() - verifiedAt.getTime();
      if (diffMs < 2 * 60 * 1000) {
        // Within 2 minutes grace period, return success (do not send another welcome email)
        return NextResponse.json(
          {
            message: "Email verified successfully",
            user: {
              id: verification.user.id,
              name: verification.user.name,
              email: verification.user.email,
            },
          },
          { status: 200 }
        );
      } else {
        // After 2 minutes, delete the token and return error
        await prisma.emailVerification.delete({ where: { token } });
        return NextResponse.json(
          { message: "Verification token has expired" },
          { status: 400 }
        );
      }
    }

    // Not yet verified: mark user as verified, set verifiedAt, send welcome email
    const user = await prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerifiedAt: new Date() },
    });

    await prisma.emailVerification.update({
      where: { token },
      data: { verifiedAt: new Date() },
    });

    // Send welcome email

    const dashboardUrl = `${
      process.env.AUTH_URL || "http://localhost:3000"
    }/dashboard`;
    const helpUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/help`;
    // Inline the HTML template directly
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Eva!</title>
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
    .features { margin: 30px 0; }
    .feature-box { background-color: #f9fafb; border-left: 4px solid #6366f1; padding: 20px; margin-bottom: 15px; border-radius: 6px; }
    .feature-title { color: #6366f1; font-weight: 600; font-size: 16px; margin-bottom: 8px; }
    .feature-desc { color: #6b7280; font-size: 13px; line-height: 1.6; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { display: inline-block; padding: 14px 40px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease; }
    .button:hover { background-color: #4f46e5; }
    .support-section { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0; border-radius: 4px; font-size: 14px; color: #1e40af; }
    .support-section a { color: #3b82f6; text-decoration: none; font-weight: 600; }
    .divider { height: 1px; background-color: #e5e7eb; margin: 20px 0; }
    .footer { background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer-text { color: #6b7280; font-size: 13px; margin-bottom: 8px; }
    .footer-brand { font-weight: 600; color: #1f2937; font-size: 14px; }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">🎉 Eva</div>
      <div class="header-title">Welcome to Eva Marketplace!</div>
    </div>
    <!-- Body -->
    <div class="body">
      <div class="greeting">Hi ${user.name},</div>
      <div class="content-text">
        Your email has been verified successfully! 🎊 You're now part of the Eva community and ready to discover amazing event service providers.
      </div>
      <div class="divider"></div>
      <div class="content-text" style="font-weight: 600; color: #1f2937;">
        Here's what you can do next:
      </div>
      <div class="features">
        <div class="feature-box">
          <div class="feature-title">🔍 Discover Providers</div>
          <div class="feature-desc">
            Browse through hundreds of verified event service providers in your area. Find photographers, caterers, decorators, venues, and more!
          </div>
        </div>
        <div class="feature-box">
          <div class="feature-title">💬 Get Quotes</div>
          <div class="feature-desc">
            Send inquiries to multiple providers and receive customized quotes based on your specific needs and budget.
          </div>
        </div>
        <div class="feature-box">
          <div class="feature-title">📅 Book Services</div>
          <div class="feature-desc">
            Secure your booking with trusted providers. Manage payments, schedules, and contracts all in one place.
          </div>
        </div>
        <div class="feature-box">
          <div class="feature-title">⭐ Leave Reviews</div>
          <div class="feature-desc">
            Share your experience after service completion. Help others make informed decisions and build the Eva community.
          </div>
        </div>
      </div>
      <div class="button-container">
        <a href="${dashboardUrl}" class="button">Start Exploring Now</a>
      </div>
      <div class="support-section">
        💡 <strong>Need help getting started?</strong> Check out our <a href="${helpUrl}">Help Center</a> or reach out to our support team at support@evalocal.com
      </div>
      <div class="divider"></div>
      <div class="content-text">
        We're thrilled to have you on board. Let's make planning your event easier and more enjoyable!
      </div>
    </div>
    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">Eva Marketplace</div>
      <div class="footer-text">Connecting you with the best event service providers</div>
      <div class="footer-text">📧 support@evalocal.com | 🌐 evalocal.com</div>
    </div>
  </div>
</body>
</html>`;

    await sendEmail({
      to: user.email,
      subject: "Welcome to Eva Marketplace! 🎉",
      html: htmlContent,
    });

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Email verification handler error: ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// This endpoint works for all roles except admin and verifies the user's email.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
