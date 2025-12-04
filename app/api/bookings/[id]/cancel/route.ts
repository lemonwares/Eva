import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const cancelBookingSchema = z.object({
  reason: z.string().min(1, "Cancellation reason is required"),
  cancelledBy: z.enum(["VENDOR", "CLIENT"]).optional(),
});

// POST /api/bookings/:id/cancel - Cancel a booking
export async function POST(
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
    const validation = cancelBookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { reason, cancelledBy } = validation.data;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: {
          select: { id: true, ownerUserId: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Determine who is cancelling
    const isOwner = booking.provider.ownerUserId === session.user.id;
    const isClient = booking.clientEmail === session.user.email;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isClient && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Cannot cancel already completed or cancelled bookings
    if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
      return NextResponse.json(
        { message: `Cannot cancel a ${booking.status.toLowerCase()} booking` },
        { status: 400 }
      );
    }

    // Determine cancellation party
    let cancellationParty = cancelledBy;
    if (!cancellationParty) {
      if (isOwner) cancellationParty = "VENDOR";
      else if (isClient) cancellationParty = "CLIENT";
      else cancellationParty = "VENDOR"; // Admin acting on vendor's behalf
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        specialRequests: booking.specialRequests
          ? `${booking.specialRequests}\n\nCancelled by ${cancellationParty}: ${reason}`
          : `Cancelled by ${cancellationParty}: ${reason}`,
      },
      include: {
        provider: {
          select: { id: true, businessName: true },
        },
        quote: true,
      },
    });

    return NextResponse.json({
      message: "Booking cancelled successfully",
      booking: updated,
    });
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
