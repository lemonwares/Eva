import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateBookingSchema = z.object({
  eventDate: z.string().datetime().optional(),
  eventLocation: z.string().min(1).optional(),
  clientName: z.string().min(1).optional(),
  clientPhone: z.string().min(1).optional(),
  specialRequests: z.string().optional(),
});

// GET /api/bookings/:id - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            ownerUserId: true,
            businessName: true,
            coverImage: true,
            city: true,
            phonePublic: true,
          },
        },
        quote: {
          include: {
            inquiry: {
              select: {
                id: true,
                messages: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Access control
    const isOwner = booking.provider.ownerUserId === session.user.id;
    const isClient = booking.clientEmail === session.user.email;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isClient && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    logger.error("Error fetching booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/:id - Update booking details
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
    const validation = updateBookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Only provider owner or admin can update
    const isOwner = booking.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Cannot update completed or cancelled bookings
    if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
      return NextResponse.json(
        { message: `Cannot update a ${booking.status.toLowerCase()} booking` },
        { status: 400 }
      );
    }

    const data = { ...validation.data } as any;
    if (data.eventDate) {
      data.eventDate = new Date(data.eventDate);
    }

    const updated = await prisma.booking.update({
      where: { id },
      data,
      include: {
        provider: {
          select: { id: true, businessName: true },
        },
        quote: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    logger.error("Error updating booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/:id - Cancel/delete a booking (admin only for hard delete)
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

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isAdmin) {
      return NextResponse.json(
        {
          message:
            "Only administrators can delete bookings. Use cancel instead.",
        },
        { status: 403 }
      );
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    logger.error("Error deleting booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
