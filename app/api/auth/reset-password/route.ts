import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/auth/reset-password
// Resets password using a valid token from PasswordReset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // Find password reset record by token
    const resetRecord = await prisma.passwordReset.findUnique({ where: { token } });
    if (!resetRecord || resetRecord.usedAt) {
      return NextResponse.json({ message: "Invalid or used token" }, { status: 400 });
    }

    // Check if token is expired
    if (resetRecord.expiresAt < new Date()) {
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { token },
      data: { usedAt: new Date() },
    });

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (error: any) {
    console.error(`Reset password error: ${error?.message}`);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// This endpoint works for all roles and securely resets the password.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
