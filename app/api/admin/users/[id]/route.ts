import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(["CLIENT", "PROFESSIONAL", "ADMINISTRATOR"]).optional(),
  phone: z.string().max(20).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

// GET /api/admin/users/:id - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        ownedProviders: {
          select: {
            id: true,
            businessName: true,
            isPublished: true,
            isVerified: true,
            reviewCount: true,
            inquiryCount: true,
          },
        },
        favorites: {
          include: {
            provider: {
              select: { id: true, businessName: true },
            },
          },
          take: 10,
        },
        _count: {
          select: {
            favorites: true,
            reviews: true,
            inquiries: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Transform to match frontend expectations
    const transformedUser = {
      ...user,
      status: user.emailVerifiedAt ? "ACTIVE" : "INACTIVE",
      emailVerified: user.emailVerifiedAt?.toISOString() || null,
      image: user.avatar,
    };

    return NextResponse.json({ success: true, user: transformedUser });
  } catch (error: any) {
    logger.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/:id - Update user (alias for PATCH)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(request, context);
}

// PATCH /api/admin/users/:id - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent changing own role
    if (id === session.user.id) {
      if (validation.data.role && validation.data.role !== user.role) {
        return NextResponse.json(
          { success: false, error: "Cannot change your own role" },
          { status: 400 }
        );
      }
    }

    // Check email uniqueness if changing
    if (validation.data.email && validation.data.email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: validation.data.email },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Handle status change by updating emailVerifiedAt
    const updateData: any = { ...validation.data };
    if (validation.data.status) {
      delete updateData.status;
      if (validation.data.status === "ACTIVE" && !user.emailVerifiedAt) {
        updateData.emailVerifiedAt = new Date();
      } else if (validation.data.status !== "ACTIVE" && user.emailVerifiedAt) {
        updateData.emailVerifiedAt = null;
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        emailVerifiedAt: true,
        updatedAt: true,
      },
    });

    // Transform for frontend
    const transformedUser = {
      ...updated,
      status: updated.emailVerifiedAt ? "ACTIVE" : "INACTIVE",
    };

    return NextResponse.json({ success: true, user: transformedUser });
  } catch (error: any) {
    logger.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/:id - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent self-deletion
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        ownedProviders: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Use transaction for cascading deletes
    await prisma.$transaction(async (tx: any) => {
      // Delete providers if exist
      for (const provider of user.ownedProviders) {
        // Delete related records first
        await tx.review.deleteMany({ where: { providerId: provider.id } });
        await tx.booking.deleteMany({ where: { providerId: provider.id } });
        await tx.quote.deleteMany({
          where: { inquiry: { providerId: provider.id } },
        });
        await tx.inquiry.deleteMany({ where: { providerId: provider.id } });
        await tx.provider.delete({ where: { id: provider.id } });
      }

      // Delete favorites
      await tx.favorite.deleteMany({ where: { userId: id } });

      // Delete user
      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    logger.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
