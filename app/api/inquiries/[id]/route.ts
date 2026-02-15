import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Validation schema for adding messages
const messageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty"),
});

// GET /api/inquiries/[id] - Get single inquiry with full details
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

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            coverImage: true,
            city: true,
            ownerUserId: true,
            phonePublic: true,
          },
        },
        fromUser: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        quotes: {
          include: {
            booking: {
              select: { id: true, status: true },
            },
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Check authorization
    const isVendor = inquiry.provider.ownerUserId === session.user.id;
    const isClient =
      inquiry.fromUserId === session.user.id ||
      inquiry.fromEmail === session.user.email;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isVendor && !isClient && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // If vendor is viewing for the first time, mark as VIEWED
    if (isVendor && inquiry.status === "NEW") {
      await prisma.inquiry.update({
        where: { id },
        data: { status: "VIEWED" },
      });
      inquiry.status = "VIEWED";
    }

    return NextResponse.json({ inquiry });
  } catch (error: any) {
    logger.error("Error fetching inquiry:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/inquiries/[id] - Update inquiry status
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
    const { status } = body;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Check authorization - only vendor or admin can update status
    const isVendor = inquiry.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isVendor && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Validate status transitions
    const validStatuses = [
      "NEW",
      "VIEWED",
      "REPLIED",
      "QUOTED",
      "ACCEPTED",
      "DECLINED",
      "EXPIRED",
      "ARCHIVED",
    ];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      message: "Inquiry updated successfully",
      inquiry: updatedInquiry,
    });
  } catch (error: any) {
    logger.error("Error updating inquiry:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
