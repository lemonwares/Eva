import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, role } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: `An account with this email exists already` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // For non-admin roles, set emailVerifiedAt to null and create verification token
    let emailVerifiedAt = null;
    if (role === "ADMINISTRATOR") {
      emailVerifiedAt = new Date();
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerifiedAt,
      },
    });

    // If not admin, create email verification token
    if (role !== "ADMINISTRATOR") {
      const token = crypto.randomBytes(32).toString("hex");
      await prisma.emailVerification.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });
      // TODO: Send email with verification link (for now, just return token)
      return NextResponse.json(
        {
          message: "Account created. Please verify your email.",
          userId: user.id,
          token,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Admin account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`Error occurred during registration: ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
