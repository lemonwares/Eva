import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { sendTemplatedEmail, emailTemplates } from "@/lib/email";

const completeBookingSchema = z.object({
  completionNotes: z.string().optional(),
});

// POST /api/bookings/:id/complete - Mark booking as completed
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

    let completionNotes = "";
    try {
      const body = await request.json();
      const validation = completeBookingSchema.safeParse(body);
      if (validation.success) {
        completionNotes = validation.data.completionNotes || "";
      }
    } catch {
      // Empty body is fine
    }

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

    // Only provider owner or admin can complete
    const isOwner = booking.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Must be confirmed to complete
    if (booking.status !== "CONFIRMED") {
      return NextResponse.json(
        { message: `Cannot complete a booking with status: ${booking.status}` },
        { status: 400 }
      );
    }

    // Use transaction to update booking and provider stats
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        specialRequests: completionNotes
          ? booking.specialRequests
            ? `${booking.specialRequests}\n\nCompletion notes: ${completionNotes}`
            : `Completion notes: ${completionNotes}`
          : booking.specialRequests,
      },
      include: {
        provider: {
          select: { id: true, businessName: true },
        },
        quote: true,
      },
    });

    // Send review request email to client
    if (updated.clientEmail) {
      const reviewUrl = `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/reviews/new?booking=${updated.id}`;
      await sendTemplatedEmail(
        updated.clientEmail,
        emailTemplates.reviewRequest(
          updated.clientName,
          updated.provider.businessName,
          reviewUrl
        )
      ).catch((err) =>
        console.error("Failed to send review request email:", err)
      );
    }

    return NextResponse.json({
      message: "Booking marked as completed",
      booking: updated,
    });
  } catch (error: any) {
    console.error("Error completing booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
