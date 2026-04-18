import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  adminKey: z.string().min(1, "Admin key is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, adminKey } = parsed.data;

    // Validate admin key
    const validKey = process.env.ADMIN_REGISTRATION_KEY;
    if (!validKey || adminKey !== validKey) {
      return NextResponse.json(
        { message: "Invalid admin key" },
        { status: 403 }
      );
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMINISTRATOR",
        emailVerifiedAt: new Date(), // admins are pre-verified
      },
    });

    return NextResponse.json(
      { message: "Admin account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN REGISTER]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
