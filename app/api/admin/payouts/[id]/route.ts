import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logger } from "@/lib/logger";

// PATCH /api/admin/payouts/[id] — update payout status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, rejectedReason } = body;

    const validStatuses = ["APPROVED", "PROCESSING", "PAID", "REJECTED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const payout = await prisma.payout.update({
      where: { id },
      data: {
        status,
        processedBy: session.user.id,
        processedAt: new Date(),
        ...(rejectedReason && { rejectedReason }),
      },
      include: {
        provider: { select: { businessName: true } },
      },
    });

    return NextResponse.json({ payout, message: `Payout ${status.toLowerCase()} successfully` });
  } catch (error) {
    logger.error("Error updating payout:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
