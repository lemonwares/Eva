import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";

const schema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

// POST /api/bookings/:id/cancel-request — vendor requests cancellation
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
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const { reason } = validation.data;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { provider: { select: { ownerUserId: true, businessName: true } } },
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const isOwner = booking.provider.ownerUserId === session.user.id;
    if (!isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
      return NextResponse.json(
        { message: "Cannot request cancellation for this booking" },
        { status: 400 },
      );
    }

    // Append CANCELLATION_REQUESTED entry to statusTimeline
    const newEntry = {
      status: "CANCELLATION_REQUESTED",
      timestamp: new Date().toISOString(),
      note: reason,
    };

    const updatedTimeline = [...(booking.statusTimeline as any[]), newEntry];

    await prisma.booking.update({
      where: { id },
      data: { statusTimeline: updatedTimeline },
    });

    // Create notifications for all admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMINISTRATOR" },
      select: { id: true },
    });

    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: "Cancellation Request",
          message: `Vendor "${booking.provider.businessName}" has requested cancellation for booking #${id.slice(-8).toUpperCase()}.\n\nReason: ${reason}`,
          type: "warning",
          metadata: { bookingId: id, reason },
        })),
      });
    }

    return NextResponse.json({ message: "Cancellation request sent to admin" });
  } catch (error: any) {
    logger.error("Error submitting cancellation request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
