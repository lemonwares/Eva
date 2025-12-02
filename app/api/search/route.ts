import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper: Haversine formula for distance in km
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/search
export async function GET(request: NextRequest) {
  try {
    const {
      postcode,
      radius = 5,
      category,
      priceFrom,
      priceTo,
      rating,
      cultureTags,
      sort = "distance",
      page = 1,
      limit = 20,
    } = Object.fromEntries(request.nextUrl.searchParams.entries());

    // Geocode postcode/address using OpenStreetMap Nominatim
    let searchLat = null;
    let searchLng = null;
    if (postcode) {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          postcode
        )}`
      );
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        searchLat = parseFloat(geoData[0].lat);
        searchLng = parseFloat(geoData[0].lon);
      }
    }

    // Build Prisma query filters
    const filters: any = {};
    if (category) filters.categories = { has: category };
    if (priceFrom) filters.price_from = { gte: Number(priceFrom) };
    if (priceTo) filters.price_from = { lte: Number(priceTo) };
    if (rating) filters.average_rating = { gte: Number(rating) };
    if (cultureTags)
      filters.culture_tradition_tags = { hasSome: cultureTags.split(",") };

    // Pagination
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    // Query providers
    let providers = await prisma.provider.findMany({
      where: filters,
      skip,
      take: 1000, // get more for filtering by distance
      orderBy:
        sort === "distance" ? { createdAt: "desc" } : { averageRating: "desc" },
    });

    // Filter by radius if geocoding succeeded
    if (searchLat !== null && searchLng !== null) {
      providers = providers
        .map((p: any) => ({
          ...p,
          distance: getDistance(searchLat, searchLng, p.geo_lat, p.geo_lng),
        }))
        .filter((p: any) => p.distance <= Number(radius))
        .sort((a: any, b: any) => a.distance - b.distance);
    }

    // Paginate after filtering
    const pagedProviders = providers.slice(skip, skip + take);

    return NextResponse.json(
      {
        providers: pagedProviders,
        meta: {
          page: Number(page),
          limit: take,
          total: providers.length,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Search error: ${error?.message}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// This endpoint supports all filters and is frontend-friendly. Integrate real geocoding and distance filtering for production use.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
