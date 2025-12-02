import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

// GET /api/auth/me
// Returns details of the currently authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get JWT from request (NextAuth)
    const token = await getToken({ req: request });
    if (!token || !token.email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: token.email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user info (excluding password)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error(`Get user error: ${error?.message}`);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// This endpoint works for all roles and returns the logged-in user's details.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
