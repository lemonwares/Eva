import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const addressParam = searchParams.get("address");
    const cityParam = searchParams.get("city");
    const radiusParam = searchParams.get("radius") || "20"; // Default 20 miles
    const excludeId = searchParams.get("excludeId");
    const limitParam = searchParams.get("limit") || "4";

    const radius = parseFloat(radiusParam);
    const limit = parseInt(limitParam);

    let providers: any[] = [];

    // Try geocode-based search first if coordinates are available
    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);

      // Haversine formula to find providers within radius
      // 3959 is the radius of the Earth in miles
      providers = await prisma.$queryRaw`
        SELECT 
          p.id, 
          p.business_name as "businessName", 
          p.address, 
          p.city, 
          p.categories, 
          p.cover_image as "coverImage", 
          p.photos, 
          p.is_verified as "isVerified", 
          p.is_featured as "isFeatured", 
          p.average_rating as "averageRating", 
          p.review_count as "reviewCount", 
          p.price_from as "priceFrom",
          (
            3959 * acos(
              cos(radians(${lat})) * cos(radians(p.geo_lat)) * cos(radians(p.geo_lng) - radians(${lng})) + 
              sin(radians(${lat})) * sin(radians(p.geo_lat))
            )
          ) AS distance
        FROM providers p
        WHERE 
          p.is_published = true
          AND p.geo_lat IS NOT NULL 
          AND p.geo_lng IS NOT NULL
          ${excludeId ? Prisma.sql`AND p.id != ${excludeId}` : Prisma.sql``}
        GROUP BY p.id
        HAVING (
          3959 * acos(
            cos(radians(${lat})) * cos(radians(p.geo_lat)) * cos(radians(p.geo_lng) - radians(${lng})) + 
            sin(radians(${lat})) * sin(radians(p.geo_lat))
          )
        ) < ${radius}
        ORDER BY distance ASC
        LIMIT ${limit}
      `;
    }

    // Fallback to address-based search if no geocode results or no coordinates provided
    if (providers.length === 0 && (addressParam || cityParam)) {
      const whereConditions: any = {
        isPublished: true,
      };

      if (excludeId) {
        whereConditions.id = { not: excludeId };
      }

      // If we have a city, prioritize same city matches
      if (cityParam) {
        whereConditions.city = {
          contains: cityParam,
          mode: "insensitive",
        };
      }

      // If we have an address, also match on address
      if (addressParam && !cityParam) {
        whereConditions.OR = [
          {
            address: {
              contains: addressParam,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: addressParam,
              mode: "insensitive",
            },
          },
        ];
      }

      const addressBasedProviders = await prisma.provider.findMany({
        where: whereConditions,
        select: {
          id: true,
          businessName: true,
          address: true,
          city: true,
          categories: true,
          coverImage: true,
          photos: true,
          isVerified: true,
          isFeatured: true,
          averageRating: true,
          reviewCount: true,
          priceFrom: true,
        },
        take: limit,
        orderBy: [
          { isFeatured: "desc" },
          { isVerified: "desc" },
          { averageRating: "desc" },
        ],
      });

      // Map to match the expected format (add distance as null for address-based results)
      providers = addressBasedProviders.map((provider) => ({
        ...provider,
        distance: null,
      }));
    }

    return NextResponse.json({ providers });
  } catch (error: any) {
    logger.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
