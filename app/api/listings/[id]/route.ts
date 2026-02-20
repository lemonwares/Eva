import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateListingSchema = z.object({
  headline: z.string().min(1).max(200).optional(),
  longDescription: z.string().max(5000).optional().nullable(),
  minPrice: z.number().min(0).optional().nullable(),
  maxPrice: z.number().min(0).optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  galleryUrls: z.array(z.string().url()).optional(),
});

// GET /api/listings/:id - Get single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            coverImage: true,
            city: true,
            averageRating: true,
            ownerUserId: true,
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

    return NextResponse.json(listing);
  } catch (error: any) {
    logger.error("Error fetching listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/listings/:id - Update listing
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = updateListingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const isOwner = listing.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    logger.error("Error updating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/:id - Delete listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const isOwner = listing.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Listing deleted successfully" });
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
