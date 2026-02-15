import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";

// DELETE /api/auth/delete-account
// Permanently deletes the authenticated user's account and all related data.
// Requires password confirmation for security.
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { message: "Password is required to confirm account deletion" },
        { status: 400 },
      );
    }

    // Fetch user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Social login users (no password set) — verify by matching email from session
    if (!user.password) {
      if (!password || password !== "CONFIRM_DELETE") {
        return NextResponse.json(
          {
            message:
              'Social login accounts must send "CONFIRM_DELETE" as the password field to confirm deletion',
          },
          { status: 400 },
        );
      }
    } else {
      // Standard users — verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { message: "Incorrect password" },
          { status: 403 },
        );
      }
    }

    // Prevent admin self-deletion
    if (user.role === "ADMINISTRATOR") {
      return NextResponse.json(
        {
          message:
            "Administrator accounts cannot be deleted through this endpoint",
        },
        { status: 403 },
      );
    }

    // Delete user — Prisma schema cascades handle all related records:
    // - Provider (Cascade) → Listings, Inquiries, Quotes, Bookings, Reviews, Favorites, TeamMembers, WeeklySchedules
    // - Favorites (Cascade)
    // - PasswordResets (Cascade)
    // - EmailVerifications (Cascade)
    // - Accounts (Cascade)
    // - Sessions (Cascade)
    // - Inquiries from user (SetNull)
    // - Reviews by user (SetNull)
    // - AuditLogs (SetNull)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Account deletion error:", message);
    return NextResponse.json(
      { message: "Failed to delete account. Please try again." },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
