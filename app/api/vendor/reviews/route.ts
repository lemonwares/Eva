import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/vendor/reviews - Get reviews for vendor's provider
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get vendor's provider profile
    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "No provider profile found" },
        { status: 404 }
      );
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status"); // all, pending, approved, responded
    const rating = searchParams.get("rating");
    const sort = searchParams.get("sort") || "newest";
    const skip = (page - 1) * limit;

    // Build filters
    const filters: any = {
      providerId: provider.id,
    };

    // Status filters
    if (status === "pending") {
      filters.isApproved = false;
    } else if (status === "approved") {
      filters.isApproved = true;
      filters.providerReply = null;
    } else if (status === "responded") {
      filters.providerReply = { not: null };
    }

    // Rating filter
    if (rating) {
      const ratingNum = parseInt(rating);
      if (ratingNum >= 1 && ratingNum <= 5) {
        filters.rating = ratingNum;
      }
    }

    // Build sort order
    let orderBy: any = { createdAt: "desc" };
    if (sort === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sort === "rating-high") {
      orderBy = { rating: "desc" };
    } else if (sort === "rating-low") {
      orderBy = { rating: "asc" };
    }

    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.review.count({ where: filters }),
      // Get overall stats
      prisma.review.aggregate({
        where: { providerId: provider.id, isApproved: true },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);

    // Get counts for filters
    const [pendingCount, approvedCount, respondedCount] = await Promise.all([
      prisma.review.count({
        where: { providerId: provider.id, isApproved: false },
      }),
      prisma.review.count({
        where: {
          providerId: provider.id,
          isApproved: true,
          providerReply: null,
        },
      }),
      prisma.review.count({
        where: { providerId: provider.id, providerReply: { not: null } },
      }),
    ]);

    return NextResponse.json({
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        body: review.body,
        authorName: review.authorName,
        authorEmail: review.authorEmail,
        authorImage: review.author?.avatar,
        photos: review.photos,
        isApproved: review.isApproved,
        isVerifiedBooking: review.isVerifiedBooking,
        isFlagged: review.isFlagged,
        providerReply: review.providerReply,
        providerRepliedAt: review.providerRepliedAt,
        createdAt: review.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalReviews: stats._count._all,
        averageRating: stats._avg.rating || 0,
        pendingCount,
        approvedCount,
        respondedCount,
      },
    });
  } catch (error: any) {
    logger.error("Error fetching vendor reviews:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
