import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(["CLIENT", "PROFESSIONAL", "ADMINISTRATOR"]).optional(),
  phone: z.string().max(20).optional(),
});

// GET /api/admin/users - List all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const filters: any = {};

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      filters.role = role;
    }

    // Map status filter to emailVerifiedAt
    if (status === "ACTIVE") {
      filters.emailVerifiedAt = { not: null };
    } else if (status === "INACTIVE") {
      filters.emailVerifiedAt = null;
    }

    const [rawUsers, total] = await Promise.all([
      prisma.user.findMany({
        where: filters,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerifiedAt: true,
          phone: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          ownedProviders: {
            select: {
              id: true,
              businessName: true,
              isPublished: true,
              isVerified: true,
            },
          },
          _count: {
            select: {
              favorites: true,
              reviews: true,
              inquiries: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: filters }),
    ]);

    // Transform users to include status field expected by frontend
    const users = rawUsers.map((user) => ({
      ...user,
      status: user.emailVerifiedAt ? "ACTIVE" : "INACTIVE",
      emailVerified: user.emailVerifiedAt?.toISOString() || null,
      image: user.avatar,
      _count: {
        bookings: 0, // Would need to count from bookings table if needed
        reviews: user._count.reviews,
        inquiries: user._count.inquiries,
      },
    }));

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, phone, role } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: role || "CLIENT",
        emailVerifiedAt: new Date(), // Admin-created users are verified
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });

    // Transform for frontend
    const transformedUser = {
      ...newUser,
      status: "ACTIVE",
    };

    return NextResponse.json(
      { success: true, user: transformedUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
