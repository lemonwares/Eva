import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/bookings/:id/timeline - Get booking event timeline
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
          select: { ownerUserId: true },
        },
        quote: {
          include: {
            inquiry: {
              select: {
                id: true,
                createdAt: true,
                message: true,
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

    // Build timeline of events
    const timeline: Array<{
      type: string;
      date: Date;
      description: string;
      data?: any;
    }> = [];

    // Inquiry created
    if (booking.quote?.inquiry) {
      timeline.push({
        type: "INQUIRY_CREATED",
        date: booking.quote.inquiry.createdAt,
        description: "Inquiry received",
      });

      // Parse messages for additional timeline events
      const messages = (booking.quote.inquiry.messages as any[]) || [];
      messages.forEach((msg: any, index: number) => {
        timeline.push({
          type: "MESSAGE",
          date: new Date(msg.timestamp || booking.quote!.inquiry!.createdAt),
          description: `Message from ${msg.from || "client"}`,
          data: { preview: msg.content?.substring(0, 100) },
        });
      });
    }

    // Quote created
    if (booking.quote) {
      timeline.push({
        type: "QUOTE_CREATED",
        date: booking.quote.createdAt,
        description: `Quote created for ${formatCurrency(
          booking.quote.totalPrice
        )}`,
      });

      if (booking.quote.viewedAt) {
        timeline.push({
          type: "QUOTE_VIEWED",
          date: booking.quote.viewedAt,
          description: "Quote viewed by client",
        });
      }

      if (booking.quote.respondedAt) {
        timeline.push({
          type: "QUOTE_RESPONDED",
          date: booking.quote.respondedAt,
          description: "Client responded to quote",
        });
      }
    }

    // Booking created
    timeline.push({
      type: "BOOKING_CREATED",
      date: booking.createdAt,
      description: "Booking confirmed",
    });

    // Event date
    timeline.push({
      type: "EVENT_SCHEDULED",
      date: booking.eventDate,
      description: `Event scheduled${
        booking.eventLocation ? ` at ${booking.eventLocation}` : ""
      }`,
    });

    // Booking status updates
    if (booking.status === "COMPLETED") {
      timeline.push({
        type: "BOOKING_COMPLETED",
        date: booking.updatedAt,
        description: "Event completed successfully",
      });
    } else if (booking.status === "CANCELLED") {
      timeline.push({
        type: "BOOKING_CANCELLED",
        date: booking.updatedAt,
        description: "Booking was cancelled",
      });
    }

    // Sort by date
    timeline.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({
      bookingId: booking.id,
      status: booking.status,
      timeline,
    });
  } catch (error: any) {
    logger.error("Error fetching booking timeline:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
