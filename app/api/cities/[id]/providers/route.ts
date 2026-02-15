import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cities/:id/providers - Get providers in a city
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = request.nextUrl;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const categoryId = searchParams.get("categoryId");
    const minRating = searchParams.get("minRating");
    const sortBy = searchParams.get("sortBy") || "featured";
    const skip = (page - 1) * limit;

    // Find city by ID or slug
    let city = await prisma.city.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    });

    if (!city) {
      city = await prisma.city.findUnique({
        where: { slug: id },
        select: { id: true, name: true, slug: true },
      });
    }

    if (!city) {
      return NextResponse.json({ message: "City not found" }, { status: 404 });
    }

    // Build filters - city is a string field in Provider
    const filters: any = {
      city: { contains: city.name, mode: "insensitive" },
      isPublished: true,
    };

    if (categoryId) {
      filters.categories = { has: categoryId };
    }

    if (minRating) {
      filters.averageRating = { gte: parseFloat(minRating) };
    }

    // Build sort order
    let orderBy: any[] = [];
    switch (sortBy) {
      case "rating":
        orderBy = [{ averageRating: "desc" }, { reviewCount: "desc" }];
        break;
      case "reviews":
        orderBy = [{ reviewCount: "desc" }];
        break;
      case "newest":
        orderBy = [{ createdAt: "desc" }];
        break;
      case "name":
        orderBy = [{ businessName: "asc" }];
        break;
      case "featured":
      default:
        orderBy = [
          { isFeatured: "desc" },
          { averageRating: "desc" },
          { reviewCount: "desc" },
        ];
    }

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where: filters,
        skip,
        take: limit,
        select: {
          id: true,
          businessName: true,
          description: true,
          coverImage: true,
          city: true,
          averageRating: true,
          reviewCount: true,
          priceFrom: true,
          isFeatured: true,
          categories: true,
          cultureTraditionTags: true,
        },
        orderBy,
      }),
      prisma.provider.count({ where: filters }),
    ]);

    return NextResponse.json({
      city: {
        id: city.id,
        name: city.name,
        slug: city.slug,
      },
      providers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error("Error fetching city providers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
