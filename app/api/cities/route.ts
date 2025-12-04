import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const createCitySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  county: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  country: z.string().max(100).default("UK"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional().default(false),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

// POST /api/cities - Create a new city (admin only)
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
    const validation = createCitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check slug uniqueness
    const existing = await prisma.city.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { message: "City slug already exists" },
        { status: 400 }
      );
    }

    const city = await prisma.city.create({
      data,
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error: any) {
    console.error("Error creating city:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/cities - List all cities (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const featured = searchParams.get("featured") === "true";
    const region = searchParams.get("region");
    const search = searchParams.get("search");

    const filters: any = {};

    if (featured) {
      filters.isFeatured = true;
    }

    if (region) {
      filters.region = region;
    }

    if (search) {
      filters.name = { contains: search, mode: "insensitive" };
    }

    const cities = await prisma.city.findMany({
      where: filters,
      orderBy: [
        { isFeatured: "desc" },
        { displayOrder: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json(cities);
  } catch (error: any) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
