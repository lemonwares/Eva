import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const moderateReviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "FLAG"]),
  reason: z.string().optional(),
});

// POST /api/reviews/:id/moderate - Moderate a review (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = moderateReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { action, reason } = validation.data;

    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        isApproved: true,
        isFlagged: true,
        providerId: true,
        rating: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    const wasApproved = review.isApproved;

    // Determine new state based on action
    const updateData: any = {
      moderatedAt: new Date(),
      moderatedBy: session.user.id,
    };

    if (action === "APPROVE") {
      updateData.isApproved = true;
      updateData.isFlagged = false;
    } else if (action === "REJECT") {
      updateData.isApproved = false;
      updateData.isFlagged = false;
    } else if (action === "FLAG") {
      updateData.isFlagged = true;
    }

    const willBeApproved = action === "APPROVE";

    // Use transaction to update review and provider stats
    const updated = await prisma.$transaction(async (tx: any) => {
      const updatedReview = await tx.review.update({
        where: { id },
        data: updateData,
        include: {
          provider: {
            select: { id: true, businessName: true },
          },
        },
      });

      // Update provider rating if approval status changed
      if (wasApproved !== willBeApproved) {
        const stats = await tx.review.aggregate({
          where: {
            providerId: review.providerId,
            isApproved: true,
          },
          _avg: { rating: true },
          _count: true,
        });

        await tx.provider.update({
          where: { id: review.providerId },
          data: {
            averageRating: stats._avg?.rating || 0,
            reviewCount: stats._count || 0,
          },
        });
      }

      return updatedReview;
    });

    return NextResponse.json({
      message: `Review ${action.toLowerCase()}d successfully`,
      review: updated,
    });
  } catch (error: any) {
    console.error("Error moderating review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
