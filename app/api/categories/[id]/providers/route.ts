import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories/:id/providers - Get providers in a category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = request.nextUrl;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const city = searchParams.get("city");
    const minRating = searchParams.get("minRating");
    const sortBy = searchParams.get("sortBy") || "featured";
    const skip = (page - 1) * limit;

    // Find category by ID or slug
    let category = await prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    });

    if (!category) {
      category = await prisma.category.findUnique({
        where: { slug: id },
        select: { id: true, name: true, slug: true },
      });
    }

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Build filters - categories is a string array in Provider
    const filters: any = {
      categories: { has: category.id },
      isPublished: true,
    };

    if (city) {
      filters.city = { contains: city, mode: "insensitive" };
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
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
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
    console.error("Error fetching category providers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
