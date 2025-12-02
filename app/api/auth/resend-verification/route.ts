import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// POST /api/auth/resend-verification
// Resends email verification token for unverified users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "No account found for this email" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerifiedAt) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
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

    // TODO: Send email with verification link (for now, just return token)
    // In production, integrate with email provider
    return NextResponse.json(
      { message: "Verification email sent", token },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Resend verification error: ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// This endpoint works for all roles except admin and resends the verification token.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
