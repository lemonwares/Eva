import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Validation schema for provider updates
const updateProviderSchema = z.object({
  businessName: z.string().min(2).optional(),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  subcategories: z.array(z.string()).optional(),
  cultureTraditionTags: z.array(z.string()).optional(),
  serviceRadiusMiles: z.number().min(1).max(100).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
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
  isPublished: z.boolean().optional(),
});

// GET /api/providers/[id] - Get single provider
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true },
        },
        listings: {
          orderBy: { createdAt: "desc" },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            reviews: { where: { isApproved: true } },
            inquiries: true,
            bookings: true,
            listings: true,
          },
        },
        weeklySchedules: {
          select: {
            isClosed: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            providerId: true,
            provider: true,
            id: true,
            updatedAt: true,
            createdAt: true,
          },
        },
        teamMembers: {
          select: {
            name: true,
            imageUrl: true,
            id: true,
            providerId: true,
            provider: true,
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    // Increment profile view count
    await prisma.provider.update({
      where: { id },
      data: {
        profileViewCount: {
          increment: 1,
        },
      },
    });

    // Map teamMembers to match frontend expectations (image instead of imageUrl)
    const mappedProvider = {
      ...provider,
      teamMembers:
        provider.teamMembers?.map((member: any) => ({
          id: member.id,
          name: member.name,
          image: member.imageUrl || null,
        })) || [],
    };

    return NextResponse.json({ provider: mappedProvider });
  } catch (error: any) {
    console.error("Error fetching provider:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/providers/[id] - Update provider
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findUnique({
      where: { id: id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    // Check ownership or admin rights
    const isOwner = provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateProviderSchema.parse(body);

    // If postcode changed, re-geocode
    let updateData = { ...validatedData };
    if (
      validatedData.postcode &&
      validatedData.postcode !== provider.postcode
    ) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            validatedData.postcode
          )}`
        );
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          updateData.geoLat = parseFloat(geoData[0].lat);
          updateData.geoLng = parseFloat(geoData[0].lon);
        }
      } catch (geoError) {
        console.warn("Geocoding failed:", geoError);
      }
    }

    // Admin-only fields
    if (!isAdmin) {
      delete updateData.isPublished;
    }

    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      message: "Provider updated successfully",
      provider: updatedProvider,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/providers/[id] - Delete provider
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findUnique({
      where: { id: id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    // Check ownership or admin rights
    const isOwner = provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Check for active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        providerId: id,
        status: {
          in: ["PENDING_PAYMENT", "DEPOSIT_PAID", "CONFIRMED"],
        },
      },
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        {
          message: "Cannot delete provider with active bookings",
        },
        { status: 400 }
      );
    }

    await prisma.provider.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Provider deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting provider:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
