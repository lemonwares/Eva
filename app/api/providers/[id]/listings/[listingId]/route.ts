import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Validation schema for listing updates
const updateListingSchema = z.object({
  headline: z.string().min(5).optional(),
  longDescription: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  galleryUrls: z.array(z.string().url()).optional(),
});

// GET /api/providers/[id]/listings/[listingId] - Get specific listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; listingId: string }> }
) {
  const { id, listingId } = await params;
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
        providerId: id,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            averageRating: true,
            reviewCount: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ listing });
  } catch (error: any) {
    logger.error("Error fetching listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/providers/[id]/listings/[listingId] - Update listing
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; listingId: string }> }
) {
  const { id, listingId } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const provider = await prisma.provider.findUnique({
      where: { id: id },
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

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
        providerId: id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        providerId: true,
        headline: true,
        longDescription: true,
        price: true,
        minPrice: true,
        maxPrice: true,
        timeEstimate: true,
        coverImageUrl: true,
        galleryUrls: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateListingSchema.parse(body);

    // Validate price range
    const minPrice = validatedData.minPrice ?? listing.minPrice;
    const maxPrice = validatedData.maxPrice ?? listing.maxPrice;

    if (minPrice && maxPrice && minPrice > maxPrice) {
      return NextResponse.json(
        { message: "Minimum price cannot be greater than maximum price" },
        { status: 400 }
      );
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: validatedData,
    });

    return NextResponse.json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    logger.error("Error updating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/providers/[id]/listings/[listingId] - Delete listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; listingId: string }> }
) {
  const { id, listingId } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const provider = await prisma.provider.findUnique({
      where: { id: id },
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

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
        providerId: id,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    await prisma.listing.delete({
      where: { id: listingId },
    });

    return NextResponse.json(
      { message: "Listing deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Error deleting listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
