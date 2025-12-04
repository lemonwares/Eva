import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const createListingSchema = z.object({
  headline: z.string().min(1).max(200),
  longDescription: z.string().max(5000).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  coverImageUrl: z.string().url().optional(),
  galleryUrls: z.array(z.string().url()).optional(),
});

// POST /api/listings - Create a new listing (for authenticated vendor)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get vendor's provider
    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "No provider profile found. Create one first." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = createListingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        ...validation.data,
        providerId: provider.id,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/listings - List listings (public or vendor's own)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const providerId = searchParams.get("providerId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const session = await auth();

    // If no providerId, get own listings
    if (!providerId) {
      if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const provider = await prisma.provider.findFirst({
        where: { ownerUserId: session.user.id },
        select: { id: true },
      });

      if (!provider) {
        return NextResponse.json({
          listings: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }

      const [listings, total] = await Promise.all([
        prisma.listing.findMany({
          where: { providerId: provider.id },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.listing.count({ where: { providerId: provider.id } }),
      ]);

      return NextResponse.json({
        listings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    // Public listings for a provider
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where: {
          providerId,
        },
        skip,
        take: limit,
        orderBy: [{ minPrice: "asc" }, { createdAt: "desc" }],
      }),
      prisma.listing.count({
        where: { providerId },
      }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
