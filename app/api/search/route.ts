import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper: Haversine formula for distance in km
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
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

// Convert km to miles
function kmToMiles(km: number): number {
  return km * 0.621371;
}

// Convert miles to km
function milesToKm(miles: number): number {
  return miles * 1.60934;
}

// GET /api/search
// Supports two search modes:
// Mode A: Find vendors within X miles of user's postcode (user specifies radius)
// Mode B: Find vendors whose service radius covers user's location (vendor's serviceRadiusMiles)
export async function GET(request: NextRequest) {
  try {
    const {
      postcode,
      radius = 5, // User's search radius in miles (Mode A)
      searchMode = "both", // "modeA", "modeB", or "both"
      category,
      priceFrom,
      priceTo,
      rating,
      cultureTags,
      verifiedOnly,
      sort = "distance",
      page = 1,
      limit = 20,
    } = Object.fromEntries(request.nextUrl.searchParams.entries());

    // Geocode postcode/address using OpenStreetMap Nominatim
    let searchLat: number | null = null;
    let searchLng: number | null = null;
    let geocodedCity: string | null = null;

    if (postcode) {
      // Check cache first
      const cached = await prisma.postcodeCache.findUnique({
        where: { postcode: postcode.toUpperCase().replace(/\s/g, "") },
      });

      if (cached) {
        searchLat = cached.latitude;
        searchLng = cached.longitude;
        geocodedCity = cached.city;
      } else {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            postcode
          )}&countrycodes=gb`,
          {
            headers: {
              "User-Agent": "EVA-EventVendorApp/1.0",
            },
          }
        );
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          searchLat = parseFloat(geoData[0].lat);
          searchLng = parseFloat(geoData[0].lon);
          geocodedCity = geoData[0].display_name?.split(",")[0] || null;

          // Cache the result
          try {
            await prisma.postcodeCache.create({
              data: {
                postcode: postcode.toUpperCase().replace(/\s/g, ""),
                latitude: searchLat,
                longitude: searchLng,
                city: geocodedCity,
              },
            });
          } catch {
            // Ignore cache errors (e.g., duplicate)
          }
        }
      }
    }

    // Build Prisma query filters
    const filters: Record<string, unknown> = {
      isPublished: true, // Only show published providers
    };
    if (category) filters.categories = { has: category };
    if (priceFrom) filters.priceFrom = { gte: Number(priceFrom) };
    if (priceTo) filters.priceFrom = { lte: Number(priceTo) };
    if (rating) filters.averageRating = { gte: Number(rating) };
    if (cultureTags) {
      filters.cultureTraditionTags = { hasSome: cultureTags.split(",") };
    }
    if (verifiedOnly === "true") filters.isVerified = true;

    // Pagination
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    // Query providers
    let providers = await prisma.provider.findMany({
      where: filters,
      take: 1000, // Get more for filtering by distance
      orderBy:
        sort === "rating"
          ? { averageRating: "desc" }
          : sort === "price"
          ? { priceFrom: "asc" }
          : { createdAt: "desc" },
    });

    // Apply distance filtering based on search mode
    if (searchLat !== null && searchLng !== null) {
      const userRadiusMiles = Number(radius);
      const userRadiusKm = milesToKm(userRadiusMiles);

      providers = providers
        .map((p) => {
          if (p.geoLat === null || p.geoLng === null) {
            return null; // Exclude providers without coordinates
          }

          const distanceKm = getDistanceKm(
            searchLat!,
            searchLng!,
            p.geoLat,
            p.geoLng
          );
          const distanceMiles = kmToMiles(distanceKm);
          const vendorRadiusMiles = p.serviceRadiusMiles || 0;
          const vendorRadiusKm = milesToKm(vendorRadiusMiles);

          // Mode A: User is within X miles of vendor's location
          const modeAMatch = distanceKm <= userRadiusKm;

          // Mode B: Vendor's service radius covers user's location
          const modeBMatch = distanceKm <= vendorRadiusKm;

          let isMatch = false;
          if (searchMode === "modeA") {
            isMatch = modeAMatch;
          } else if (searchMode === "modeB") {
            isMatch = modeBMatch;
          } else {
            // "both" - include if either mode matches
            isMatch = modeAMatch || modeBMatch;
          }

          if (!isMatch) return null;

          return {
            ...p,
            distance: Math.round(distanceMiles * 10) / 10, // Round to 1 decimal
            distanceKm: Math.round(distanceKm * 10) / 10,
            matchMode:
              modeAMatch && modeBMatch
                ? "both"
                : modeAMatch
                ? "modeA"
                : "modeB",
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .sort((a, b) => a.distance - b.distance);
    }

    // Log search for analytics (only if 8+ results for liquidity tracking)
    try {
      await prisma.searchLog.create({
        data: {
          postcode: postcode || "",
          latitude: searchLat,
          longitude: searchLng,
          radiusMiles: Number(radius),
          searchMode: searchMode,
          categories: category ? [category] : [],
          priceFrom: priceFrom ? Number(priceFrom) : null,
          minRating: rating ? Number(rating) : null,
          verifiedOnly: verifiedOnly === "true",
          cultureTags: cultureTags ? cultureTags.split(",") : [],
          resultsCount: providers.length,
          hasEightOrMore: providers.length >= 8,
          city: geocodedCity,
        },
      });
    } catch {
      // Ignore logging errors
    }

    // Paginate after filtering
    const totalResults = providers.length;
    const pagedProviders = providers.slice(skip, skip + take);

    return NextResponse.json(
      {
        providers: pagedProviders,
        meta: {
          page: Number(page),
          limit: take,
          total: totalResults,
          totalPages: Math.ceil(totalResults / take),
          searchMode,
          geocoded: searchLat !== null,
          city: geocodedCity,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Search error: ${errorMessage}`);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// This endpoint supports all filters and is frontend-friendly. Integrate real geocoding and distance filtering for production use.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
