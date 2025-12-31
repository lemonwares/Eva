import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tags - Get available tags for autocomplete
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const type = searchParams.get("type") || "all"; // 'all', 'popular', 'categories'

    let tags: string[] = [];

    if (type === "popular" || type === "all") {
      // Get most used tags from providers
      try {
        const providers = await prisma.provider.findMany({
          where: { isPublished: true },
          select: {
            tags: true,
            categories: true,
            subcategories: true,
            cultureTraditionTags: true,
          },
        });

        const tagCounts = new Map<string, number>();

        providers.forEach((provider) => {
          // Count tags (if field exists)
          if (provider.tags) {
            provider.tags.forEach((tag) => {
              if (tag) {
                const normalizedTag = tag.toLowerCase().trim();
                tagCounts.set(
                  normalizedTag,
                  (tagCounts.get(normalizedTag) || 0) + 1
                );
              }
            });
          }

          // Count categories as tags
          provider.categories?.forEach((cat) => {
            if (cat) {
              const normalizedTag = cat.toLowerCase().trim();
              tagCounts.set(
                normalizedTag,
                (tagCounts.get(normalizedTag) || 0) + 1
              );
            }
          });

          // Count subcategories as tags
          provider.subcategories?.forEach((subcat) => {
            if (subcat) {
              const normalizedTag = subcat.toLowerCase().trim();
              tagCounts.set(
                normalizedTag,
                (tagCounts.get(normalizedTag) || 0) + 1
              );
            }
          });

          // Count cultural tradition tags
          provider.cultureTraditionTags?.forEach((cultTag) => {
            if (cultTag) {
              const normalizedTag = cultTag.toLowerCase().trim();
              tagCounts.set(
                normalizedTag,
                (tagCounts.get(normalizedTag) || 0) + 1
              );
            }
          });
        });

        // Sort by popularity and filter by query
        tags = Array.from(tagCounts.entries())
          .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
          .map(([tag]) => tag)
          .filter((tag) => !query || tag.includes(query.toLowerCase()))
          .slice(0, limit);
      } catch (dbError: any) {
        console.error("Database error in tags API:", dbError);
        // Fallback: return common tags if database query fails
        const commonTags = [
          "wedding",
          "photography",
          "catering",
          "venue",
          "music",
          "flowers",
          "planning",
          "decoration",
          "professional",
          "service",
          "event",
          "celebration",
          "party",
          "corporate",
          "birthday",
          "anniversary",
        ];
        tags = commonTags
          .filter((tag) => !query || tag.includes(query.toLowerCase()))
          .slice(0, limit);
      }
    }

    if (type === "categories") {
      // Get unique categories and subcategories
      const providers = await prisma.provider.findMany({
        where: { isPublished: true },
        select: {
          categories: true,
          subcategories: true,
        },
      });

      const categorySet = new Set<string>();
      providers.forEach((provider) => {
        provider.categories?.forEach((cat) => {
          if (cat) categorySet.add(cat.toLowerCase().trim());
        });
        provider.subcategories?.forEach((subcat) => {
          if (subcat) categorySet.add(subcat.toLowerCase().trim());
        });
      });

      tags = Array.from(categorySet)
        .filter((tag) => !query || tag.includes(query.toLowerCase()))
        .sort()
        .slice(0, limit);
    }

    return NextResponse.json({
      tags,
      query,
      type,
      count: tags.length,
    });
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
