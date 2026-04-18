import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { emailTemplates, sendTemplatedEmail } from "@/lib/email";

const updateBookingSchema = z.object({
  eventDate: z.string().datetime().optional(),
  eventLocation: z.string().min(1).optional(),
  clientName: z.string().min(1).optional(),
  clientPhone: z.string().min(1).optional(),
  specialRequests: z.string().optional(),
  status: z.enum([
    "PENDING_PAYMENT",
    "DEPOSIT_PAID", 
    "BALANCE_SCHEDULED",
    "FULLY_PAID",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
    "REFUNDED"
  ]).optional(),
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
          include: { owner: { select: { email: true } } },
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

    // Cannot update completed or cancelled bookings (except status updates by admin)
    if ((booking.status === "COMPLETED" || booking.status === "CANCELLED") && 
        (!isAdmin || !body.status)) {
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

    // Send status-change emails
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const bookingUrl = `${baseUrl}/dashboard/bookings/${id}`;
    const newStatus = validation.data.status;

    if (newStatus && newStatus !== booking.status) {
      const eventDate = booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : "TBD";
      const vendorName = booking.provider.businessName;
      const clientName = booking.clientName;
      const clientEmail = booking.clientEmail;
      const vendorEmail = (booking.provider as any).owner?.email as string | undefined;

      if (newStatus === "COMPLETED") {
        if (clientEmail) {
          await sendTemplatedEmail(
            clientEmail,
            emailTemplates.bookingCompleted(clientName, vendorName, "Event", eventDate, bookingUrl),
          );
        }
      } else if (newStatus === "CANCELLED") {
        const reason = body.cancellationReason || "No reason provided";
        const cancelledBy = isAdmin ? "Administrator" : "Vendor";
        if (clientEmail) {
          await sendTemplatedEmail(
            clientEmail,
            emailTemplates.bookingCancelledClient(clientName, vendorName, eventDate, reason, cancelledBy, bookingUrl),
          );
        }
        if (vendorEmail) {
          await sendTemplatedEmail(
            vendorEmail,
            emailTemplates.bookingCancelledVendor(vendorName, clientName, eventDate, reason, cancelledBy, bookingUrl),
          );
        }
      }
    }

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
