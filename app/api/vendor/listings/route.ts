import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { listingCreateSchema, formatValidationErrors } from "@/lib/validations";
import { logger } from "@/lib/logger";

// GET /api/vendor/listings - Get all listings for vendor
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "No provider found" },
        { status: 404 },
      );
    }

    const listings = await prisma.listing.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (error: unknown) {
    logger.error("Error fetching listings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/vendor/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "No provider found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = listingCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: formatValidationErrors(parsed.error.issues),
        },
        { status: 400 },
      );
    }

    const {
      headline,
      longDescription,
      price,
      timeEstimate,
      maxGuests,
      coverImageUrl,
      galleryUrls,
    } = parsed.data;

    const listing = await prisma.listing.create({
      data: {
        headline: headline.trim(),
        longDescription: longDescription || null,
        price,
        timeEstimate: timeEstimate.trim(),
        maxGuests: maxGuests || null,
        coverImageUrl: coverImageUrl || null,
        galleryUrls: galleryUrls || [],
        providerId: provider.id,
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: unknown) {
    logger.error("Error creating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
// PATCH /api/vendor/listings - Update a listing
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "No provider found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Listing ID is required" },
        { status: 400 },
      );
    }

    // Verify the listing belongs to this provider
    const existingListing = await prisma.listing.findFirst({
      where: { id, providerId: provider.id },
    });

    if (!existingListing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 },
      );
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...updateData,
        headline: updateData.headline?.trim(),
        timeEstimate: updateData.timeEstimate?.trim(),
      },
    });

    return NextResponse.json({ listing });
  } catch (error: unknown) {
    logger.error("Error updating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}