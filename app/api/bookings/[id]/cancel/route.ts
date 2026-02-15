import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { sendTemplatedEmail, emailTemplates } from "@/lib/email";
import { logger } from "@/lib/logger";

const cancelBookingSchema = z.object({
  reason: z.string().min(1, "Cancellation reason is required"),
  cancelledBy: z.enum(["VENDOR", "CLIENT"]).optional(),
});

// POST /api/bookings/:id/cancel - Cancel a booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
        { status: 400 },
      );
    }

    const { reason, cancelledBy } = validation.data;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: {
          select: { id: true, ownerUserId: true, businessName: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 },
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
        { status: 400 },
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

    // Send cancellation email notifications
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const bookingUrl = `${baseUrl}/dashboard/bookings`;
    const vendorBookingUrl = `${baseUrl}/vendor/bookings`;
    const eventDate = booking.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "TBD";

    // Notify client
    if (booking.clientEmail) {
      sendTemplatedEmail(
        booking.clientEmail,
        emailTemplates.bookingCancelledClient(
          booking.clientName || "Client",
          updated.provider.businessName,
          eventDate,
          reason,
          cancellationParty || "Vendor",
          bookingUrl,
        ),
      ).catch((err) =>
        logger.error("Failed to send cancellation email to client:", err),
      );
    }

    // Notify vendor owner
    const vendorOwner = await prisma.user.findUnique({
      where: { id: booking.provider.ownerUserId },
      select: { email: true, name: true },
    });

    if (vendorOwner?.email) {
      sendTemplatedEmail(
        vendorOwner.email,
        emailTemplates.bookingCancelledVendor(
          vendorOwner.name || updated.provider.businessName,
          booking.clientName || "Client",
          eventDate,
          reason,
          cancellationParty || "Client",
          vendorBookingUrl,
        ),
      ).catch((err) =>
        logger.error("Failed to send cancellation email to vendor:", err),
      );
    }

    return NextResponse.json({
      message: "Booking cancelled successfully",
      booking: updated,
    });
  } catch (error: any) {
    logger.error("Error cancelling booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
