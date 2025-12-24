import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }
  try {
    const { id } = await params;

    const providerId = (await params).id; // Await the Promise
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { providerId } }),
      prisma.inquiry.deleteMany({ where: { providerId } }),
      prisma.quote.deleteMany({ where: { providerId } }),
      prisma.booking.deleteMany({ where: { providerId } }),
      prisma.favorite.deleteMany({ where: { providerId } }),
      prisma.teamMember.deleteMany({ where: { providerId } }),
      prisma.weeklySchedule.deleteMany({ where: { providerId } }),
      prisma.listing.deleteMany({ where: { providerId } }),
      prisma.payout.deleteMany({ where: { providerId } }),
      // Finally, delete the provider
      prisma.provider.delete({ where: { id: providerId } }),
    ]);
    return NextResponse.json({
      success: true,
      message: "Provider deleted successfully",
    });

    return Response.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json(
      { error: "Failed to delete provider" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
