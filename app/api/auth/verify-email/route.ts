import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/auth/verify-email
// Verifies a user's email using a token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    // Find verification record by token
    const verification = await prisma.emailVerification.findUnique({ where: { token } });
    if (!verification) {
      return NextResponse.json({ message: "Invalid verification token" }, { status: 400 });
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerifiedAt: new Date() },
    });

    // Optionally, delete the verification record
    await prisma.emailVerification.delete({ where: { token } });

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error: any) {
    console.error(`Email verification error: ${error?.message}`);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// This endpoint works for all roles except admin and verifies the user's email.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
