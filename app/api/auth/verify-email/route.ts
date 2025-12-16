import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { emailTemplates } from "@/app/templates/templateLoader";

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
    const htmlContent = emailTemplates.welcome(
      user.name,
      dashboardUrl,
      helpUrl
    );

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
