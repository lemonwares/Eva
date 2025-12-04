import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateCitySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  county: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

// GET /api/cities/:id - Get single city
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let city = await prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      city = await prisma.city.findUnique({
        where: { slug: id },
      });
    }

    if (!city) {
      return NextResponse.json({ message: "City not found" }, { status: 404 });
    }

    return NextResponse.json(city);
  } catch (error: any) {
    console.error("Error fetching city:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/cities/:id - Update city (admin only)
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
    const validation = updateCitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const city = await prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      return NextResponse.json({ message: "City not found" }, { status: 404 });
    }

    const data = validation.data;

    // Check slug uniqueness if changing
    if (data.slug && data.slug !== city.slug) {
      const existing = await prisma.city.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        return NextResponse.json(
          { message: "City slug already exists" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.city.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating city:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/cities/:id - Delete city (admin only)
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

    const city = await prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      return NextResponse.json({ message: "City not found" }, { status: 404 });
    }

    await prisma.city.delete({
      where: { id },
    });

    return NextResponse.json({ message: "City deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting city:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
