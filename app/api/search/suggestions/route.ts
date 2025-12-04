import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/search/suggestions - Get search suggestions/autocomplete
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Get suggestions from different sources
    const [providers, categories, cities] = await Promise.all([
      prisma.provider.findMany({
        where: {
          isPublished: true,
          businessName: { contains: q, mode: "insensitive" },
        },
        take: 3,
        select: {
          id: true,
          businessName: true,
        },
        orderBy: { averageRating: "desc" },
      }),

      prisma.category.findMany({
        where: {
          name: { contains: q, mode: "insensitive" },
        },
        take: 3,
        select: {
          name: true,
          slug: true,
        },
        orderBy: { displayOrder: "asc" },
      }),

      prisma.city.findMany({
        where: {
          name: { contains: q, mode: "insensitive" },
        },
        take: 2,
        select: {
          name: true,
          slug: true,
        },
        orderBy: { displayOrder: "asc" },
      }),
    ]);

    const suggestions = [
      ...providers.map((p: { id: string; businessName: string }) => ({
        type: "provider" as const,
        text: p.businessName,
        id: p.id,
        url: `/vendors/${p.id}`,
      })),
      ...categories.map((c: { name: string; slug: string }) => ({
        type: "category" as const,
        text: c.name,
        slug: c.slug,
        url: `/categories/${c.slug}`,
      })),
      ...cities.map((c: { name: string; slug: string }) => ({
        type: "city" as const,
        text: c.name,
        slug: c.slug,
        url: `/cities/${c.slug}`,
      })),
    ].slice(0, limit);

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
