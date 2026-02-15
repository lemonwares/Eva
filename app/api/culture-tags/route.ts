import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional().default(true),
});

// POST /api/culture-tags - Create a new culture tag (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = createTagSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check slug uniqueness
    const existing = await prisma.cultureTraditionTag.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Culture tag slug already exists" },
        { status: 400 }
      );
    }

    const tag = await prisma.cultureTraditionTag.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating culture tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/culture-tags - List all culture tags (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const includeInactive = searchParams.get("includeInactive") === "true";
    const search = searchParams.get("search");
    const withCounts = searchParams.get("withCounts") === "true";

    const session = await auth();
    const isAdmin = session?.user?.role === "ADMINISTRATOR";

    const filters: any = {};

    // Only show active tags to non-admins
    if (!isAdmin && !includeInactive) {
      filters.isActive = true;
    }

    if (search) {
      filters.name = { contains: search, mode: "insensitive" };
    }

    const tags = await prisma.cultureTraditionTag.findMany({
      where: filters,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(tags);
  } catch (error: any) {
    logger.error("Error fetching culture tags:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
