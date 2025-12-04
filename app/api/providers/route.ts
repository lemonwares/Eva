import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Validation schema for provider creation/update
const providerSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  description: z.string().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  subcategories: z.array(z.string()).optional(),
  cultureTraditionTags: z.array(z.string()).optional(),
  serviceRadiusMiles: z.number().min(1).max(100),
  address: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().min(3, "Valid postcode required"),
  geoLat: z.number().optional(),
  geoLng: z.number().optional(),
  priceFrom: z.number().min(0).optional(),
  phonePublic: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  facebook: z.string().optional(),
  photos: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
});

// GET /api/providers - List providers with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const {
      page = "1",
      limit = "20",
      city,
      category,
      verified,
      published,
      featured,
      ownerUserId,
      search,
      location,
      ceremony,
    } = Object.fromEntries(searchParams.entries());

    const filters: any = {};

    // Basic filters
    if (city) filters.city = { contains: city, mode: "insensitive" };
    if (category) filters.categories = { has: category };
    if (verified !== undefined) filters.isVerified = verified === "true";
    if (published !== undefined) filters.isPublished = published === "true";
    if (featured !== undefined) filters.isFeatured = featured === "true";
    if (ownerUserId) filters.ownerUserId = ownerUserId;

    // Search filter (search by business name or description)
    if (search) {
      filters.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { categories: { hasSome: [search] } },
        { subcategories: { hasSome: [search] } },
      ];
    }

    // Location filter (search by city or postcode)
    if (location) {
      const locationFilters = [
        { city: { contains: location, mode: "insensitive" } },
        { postcode: { contains: location.toUpperCase(), mode: "insensitive" } },
        { address: { contains: location, mode: "insensitive" } },
      ];

      if (filters.OR) {
        // If we already have OR filters from search, we need to AND the location
        filters.AND = [{ OR: filters.OR }, { OR: locationFilters }];
        delete filters.OR;
      } else {
        filters.OR = locationFilters;
      }
    }

    // Ceremony/culture filter
    if (ceremony) {
      const ceremonyFilter = { cultureTraditionTags: { hasSome: [ceremony] } };
      if (filters.AND) {
        filters.AND.push(ceremonyFilter);
      } else if (filters.OR) {
        filters.AND = [{ OR: filters.OR }, ceremonyFilter];
        delete filters.OR;
      } else {
        filters.cultureTraditionTags = { hasSome: [ceremony] };
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where: filters,
        skip,
        take: limitNum,
        include: {
          owner: {
            select: { id: true, name: true, email: true, role: true },
          },
          _count: {
            select: {
              reviews: true,
              inquiries: true,
              bookings: true,
            },
          },
        },
        orderBy: [
          { isFeatured: "desc" },
          { isVerified: "desc" },
          { averageRating: "desc" },
          { createdAt: "desc" },
        ],
      }),
      prisma.provider.count({ where: filters }),
    ]);

    return NextResponse.json({
      providers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/providers - Create new provider
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = providerSchema.parse(body);

    // Check if user already has a provider
    const existingProvider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (existingProvider) {
      return NextResponse.json(
        { message: "User already has a provider profile" },
        { status: 400 }
      );
    }

    // Geocode postcode if needed
    let geoLat = validatedData.geoLat;
    let geoLng = validatedData.geoLng;

    if (!geoLat || !geoLng) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            validatedData.postcode
          )}`
        );
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          geoLat = parseFloat(geoData[0].lat);
          geoLng = parseFloat(geoData[0].lon);
        }
      } catch (geoError) {
        console.warn("Geocoding failed:", geoError);
      }
    }

    const provider = await prisma.provider.create({
      data: {
        ...validatedData,
        ownerUserId: session.user.id,
        geoLat,
        geoLng,
        isPublished: false, // Needs approval
        isVerified: false,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Provider created successfully", provider },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
