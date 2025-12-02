import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Validation schema for listing creation/update
const listingSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  longDescription: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  galleryUrls: z.array(z.string().url()).optional(),
});

// GET /api/providers/[id]/listings - Get provider's listings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const listings = await prisma.listing.findMany({
      where: { providerId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/providers/[id]/listings - Create new listing
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify provider ownership
    const provider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    const isOwner = provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = listingSchema.parse(body);

    // Validate price range
    if (
      validatedData.minPrice &&
      validatedData.maxPrice &&
      validatedData.minPrice > validatedData.maxPrice
    ) {
      return NextResponse.json(
        { message: "Minimum price cannot be greater than maximum price" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        ...validatedData,
        providerId: id,
      },
    });

    return NextResponse.json(
      { message: "Listing created successfully", listing },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
