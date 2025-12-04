import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { z } from "zod";

const updateReviewSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(10).max(5000).optional(),
  rating: z.number().min(1).max(5).optional(),
});

// GET /api/reviews/:id - Get single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            coverImage: true,
            ownerUserId: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Non-approved reviews only visible to admin or review author
    const isAdmin = session?.user?.role === "ADMINISTRATOR";
    const isAuthor = session?.user?.email === review.authorEmail;
    const isProviderOwner = session?.user?.id === review.provider.ownerUserId;

    if (
      !review.isApproved &&
      !isAdmin &&
      !isAuthor &&
      !isProviderOwner
    ) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews/:id - Update review (author only, before approval)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await request.json();
    const validation = updateReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        authorEmail: true,
        isApproved: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Only author can edit pending reviews
    const isAuthor = session?.user?.email === review.authorEmail;

    if (!isAuthor) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (review.isApproved) {
      return NextResponse.json(
        { message: "Only pending reviews can be edited" },
        { status: 400 }
      );
    }

    const updated = await prisma.review.update({
      where: { id },
      data: validation.data,
      include: {
        provider: {
          select: { id: true, businessName: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/:id - Delete review (admin or author of pending review)
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

    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        authorEmail: true,
        isApproved: true,
        providerId: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    const isAdmin = session.user.role === "ADMINISTRATOR";
    const isAuthor = session.user.email === review.authorEmail;

    // Author can only delete pending reviews
    if (isAuthor && review.isApproved) {
      return NextResponse.json(
        { message: "Only pending reviews can be deleted by author" },
        { status: 403 }
      );
    }

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Use transaction to delete review and update provider stats
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete the review
      await tx.review.delete({
        where: { id },
      });

      // If it was approved, update provider rating stats
      if (review.isApproved) {
        await updateProviderRating(tx, review.providerId);
      }
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function updateProviderRating(tx: any, providerId: string) {
  const stats = await tx.review.aggregate({
    where: {
      providerId,
      isApproved: true,
    },
    _avg: { rating: true },
    _count: true,
  });

  await tx.provider.update({
    where: { id: providerId },
    data: {
      averageRating: stats._avg?.rating || 0,
      reviewCount: stats._count || 0,
    },
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
