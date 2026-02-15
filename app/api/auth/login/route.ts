import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema, formatValidationErrors } from "@/lib/validations";
import { checkRateLimit, getRateLimitIdentifier, rateLimitResponse, rateLimitPresets } from "@/lib/rate-limit";

// POST /api/auth/login
// Handles login for all roles (Client, Professional, Admin, etc.)
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 attempts per 15 minutes
    const identifier = getRateLimitIdentifier(request);
    const rateCheck = checkRateLimit(`auth:login:${identifier}`, rateLimitPresets.auth);
    if (!rateCheck.success) return rateLimitResponse(rateCheck);

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: formatValidationErrors(parsed.error.issues),
        },
        { status: 400 },
      );
    }
    const { email, password } = parsed.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user not found or no password, fail
    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Prevent login if email is not verified
    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        { message: "Please verify your email before logging in." },
        { status: 403 },
      );
    }

    // Compare provided password with hashed password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Return user info (excluding password)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
        },
        message: "Login successful",
      },
      { status: 200 },
    );
  } catch (error: any) {
    logger.error(`Login error: ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
