import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/admin/reviews - List all reviews for moderation
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status"); // "approved", "pending", "flagged"
    const minRating = searchParams.get("minRating");
    const maxRating = searchParams.get("maxRating");
    const skip = (page - 1) * limit;

    const filters: any = {};

    // Map status to boolean fields
    if (status === "approved") {
      filters.isApproved = true;
    } else if (status === "pending") {
      filters.isApproved = false;
      filters.isFlagged = false;
    } else if (status === "flagged") {
      filters.isFlagged = true;
    }

    if (minRating) {
      filters.rating = { ...filters.rating, gte: parseInt(minRating) };
    }

    if (maxRating) {
      filters.rating = { ...filters.rating, lte: parseInt(maxRating) };
    }

    const [reviews, total, approvedCount, pendingCount, flaggedCount] =
      await Promise.all([
        prisma.review.findMany({
          where: filters,
          skip,
          take: limit,
          include: {
            provider: {
              select: {
                id: true,
                businessName: true,
              },
            },
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: [
            { isApproved: "asc" }, // Pending first
            { createdAt: "desc" },
          ],
        }),
        prisma.review.count({ where: filters }),
        prisma.review.count({ where: { isApproved: true } }),
        prisma.review.count({ where: { isApproved: false, isFlagged: false } }),
        prisma.review.count({ where: { isFlagged: true } }),
      ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statusCounts: {
        approved: approvedCount,
        pending: pendingCount,
        flagged: flaggedCount,
      },
    });
  } catch (error: any) {
    logger.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
