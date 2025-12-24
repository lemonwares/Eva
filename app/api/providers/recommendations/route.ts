import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const radiusParam = searchParams.get("radius") || "20"; // Default 20 miles
    const excludeId = searchParams.get("excludeId");
    const limitParam = searchParams.get("limit") || "4";

    if (!latParam || !lngParam) {
      return NextResponse.json(
        { message: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);
    const radius = parseFloat(radiusParam);
    const limit = parseInt(limitParam);
    
    // Haversine formula to find providers within radius
    // 3959 is the radius of the Earth in miles
    const providers = await prisma.$queryRaw`
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

    // Map query results to match the Provider interface expected by the UI
    // Note: raw query returns snake_case columns if not aliased, or if we select *, 
    // but here we aliased them to camelCase or just need to handle the arrays cleanly.
    // Arrays in postgres raw query might need simple handling if they come back as strings, 
    // but Prisma usually handles text[] columns correctly.
    
    return NextResponse.json({ providers });

  } catch (error: any) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
