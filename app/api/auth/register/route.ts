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

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { message: "Email, name, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
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
        role: role || "CLIENT",
        emailVerifiedAt,
      },
    });

    // If not admin, create email verification token and try to send email
    if (role !== "ADMINISTRATOR") {
      const token = crypto.randomBytes(32).toString("hex");

      await prisma.emailVerification.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      // Try to send verification email (non-blocking)
      try {
        const verificationUrl = `${
          process.env.AUTH_URL ||
          process.env.NEXTAUTH_URL ||
          "http://localhost:3000"
        }/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

        const htmlContent = emailTemplates.verification(name, verificationUrl);

        await sendEmail({
          to: email,
          subject: "Verify Your Email Address - Eva Marketplace",
          html: htmlContent,
        });

        console.log("Verification email sent to:", email);
      } catch (emailError) {
        // Log email error but don't fail registration
        console.error("Failed to send verification email:", emailError);
        // In development, we can continue without email
      }

      return NextResponse.json(
        {
          message:
            "Registration successful. Please check your email to verify your account.",
          userId: user.id,
          token, // Include token for development/testing
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Admin account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Registration error:", message);

    // Check for specific Prisma errors
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
