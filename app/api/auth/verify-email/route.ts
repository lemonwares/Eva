import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { emailTemplates } from "@/templates/templateLoader";

// POST /api/auth/verify-email
// Verifies a user's email using a token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find verification record by token
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true }, // Include user data
    });

    if (!verification) {
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (verification.expiresAt && new Date() > verification.expiresAt) {
      return NextResponse.json(
        { message: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Mark user as verified
    const user = await prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerifiedAt: new Date() },
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

    // Delete the verification record
    await prisma.emailVerification.delete({ where: { token } });

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
    console.error(`Email verification error: ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// This endpoint works for all roles except admin and verifies the user's email.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
