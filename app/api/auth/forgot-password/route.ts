import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// POST /api/auth/forgot-password
// Initiates password reset by generating a token and saving it in PasswordReset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "No account found for this email" }, { status: 404 });
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

    // TODO: Send email with reset link (for now, just return token)
    // In production, integrate with email provider
    return NextResponse.json({ message: "Password reset link sent", token }, { status: 200 });
  } catch (error: any) {
    console.error(`Forgot password error: ${error?.message}`);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// This endpoint works for all roles and securely generates a reset token.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
