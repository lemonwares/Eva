import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateTagSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().max(500).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/culture-tags/:id - Get single culture tag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let tag = await prisma.cultureTraditionTag.findUnique({
      where: { id },
    });

    if (!tag) {
      tag = await prisma.cultureTraditionTag.findUnique({
        where: { slug: id },
      });
    }

    if (!tag) {
      return NextResponse.json(
        { message: "Culture tag not found" },
        { status: 404 }
      );
    }

    // Check if inactive and not admin
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMINISTRATOR";

    if (!tag.isActive && !isAdmin) {
      return NextResponse.json(
        { message: "Culture tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error: any) {
    logger.error("Error fetching culture tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/culture-tags/:id - Update culture tag (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = updateTagSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const tag = await prisma.cultureTraditionTag.findUnique({
      where: { id },
    });

    if (!tag) {
      return NextResponse.json(
        { message: "Culture tag not found" },
        { status: 404 }
      );
    }

    const data = validation.data;

    // Check slug uniqueness if changing
    if (data.slug && data.slug !== tag.slug) {
      const existing = await prisma.cultureTraditionTag.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        return NextResponse.json(
          { message: "Culture tag slug already exists" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.cultureTraditionTag.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    logger.error("Error updating culture tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/culture-tags/:id - Delete culture tag (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const tag = await prisma.cultureTraditionTag.findUnique({
      where: { id },
    });

    if (!tag) {
      return NextResponse.json(
        { message: "Culture tag not found" },
        { status: 404 }
      );
    }

    await prisma.cultureTraditionTag.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Culture tag deleted successfully" });
  } catch (error: any) {
    logger.error("Error deleting culture tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
