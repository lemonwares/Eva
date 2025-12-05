import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import z from "zod";
import { emailTemplates } from "@/templates/templateLoader";
import { sendEmail } from "@/lib/mail";

// POST /api/auth/forgot-password
// Initiates password reset by generating a token and saving it in PasswordReset

const forgotPasswordSchema = z.object({
  email: z.string().email(`Invalid email address`),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a password reset link has been sent.q",
        },
        { status: 404 }
      );
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

    const resetUrl = `${
      process.env.AUTH_URL
    }/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const htmlContent = emailTemplates.passwordReset(
      user?.name || "User",
      resetUrl
    );

    await sendEmail({
      to: email,
      subject: `Password Reset Request - Eva Marketplace`,
      html: htmlContent,
    });

    // In production, integrate with email provider
    return NextResponse.json(
      { message: "Password reset link sent", token },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Forgot password error: ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// This endpoint works for all roles and securely generates a reset token.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
