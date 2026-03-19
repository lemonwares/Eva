import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";

// POST /api/auth/accept-invite
// Validates the invite token and sets the vendor's password
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password || password.length < 8) {
      return NextResponse.json(
        { message: "Token and a password of at least 8 characters are required" },
        { status: 400 },
      );
    }

    const reset = await prisma.passwordReset.findUnique({ where: { token } });

    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "This invitation link is invalid or has expired" },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: reset.userId },
        data: {
          password: hashed,
          emailVerifiedAt: new Date(),
        },
      }),
      // Verify the provider profile tied to this user — accepting the invite IS verification
      prisma.provider.updateMany({
        where: { ownerUserId: reset.userId },
        data: { isVerified: true },
      }),
      prisma.passwordReset.update({
        where: { token },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: "Password set successfully. You can now log in." });
  } catch (error) {
    logger.error("Accept invite error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
