import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { emailTemplates } from "@/templates/templateLoader";
import { sendEmail } from "@/lib/mail";

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

      // Send verification email
      // const verificationUrl = `${process.env.AUTH_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}

      const verificationUrl = `${
        process.env.AUTH_URL
      }/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

      const htmlCotent = emailTemplates.verification(name, verificationUrl);

      await sendEmail({
        to: email,
        subject: `Verify Your Email Address - Eva Marketplace`,
        html: htmlCotent,
      });

      return NextResponse.json(
        {
          message:
            "Registration successful. Please check your email to verify your account.",
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
