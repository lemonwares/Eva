import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { listingUpdateSchema, formatValidationErrors } from "@/lib/validations";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/vendor/listings/:id - Get single listing
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { provider: true },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 },
      );
    }

    // Verify ownership
    if (listing.provider.ownerUserId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ listing });
  } catch (error: unknown) {
    logger.error("Error fetching listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/vendor/listings/:id - Update listing
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { provider: true },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 },
      );
    }

    if (listing.provider.ownerUserId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = listingUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: formatValidationErrors(parsed.error.issues),
        },
        { status: 400 },
      );
    }

    const { headline, longDescription, minPrice, maxPrice, coverImageUrl } =
      parsed.data;

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...(headline !== undefined && { headline: headline.trim() }),
        ...(longDescription !== undefined && {
          longDescription: longDescription || null,
        }),
        ...(minPrice !== undefined && {
          minPrice: minPrice ? Number(minPrice) : null,
        }),
        ...(maxPrice !== undefined && {
          maxPrice: maxPrice ? Number(maxPrice) : null,
        }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
      },
    });

    return NextResponse.json({ listing: updated });
  } catch (error: unknown) {
    logger.error("Error updating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/vendor/listings/:id - Delete listing
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { provider: true },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 },
      );
    }

    if (listing.provider.ownerUserId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.listing.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Listing deleted successfully",
      success: true,
    });
  } catch (error: unknown) {
    logger.error("Error deleting listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
