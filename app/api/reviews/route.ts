import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const createReviewSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(10).max(5000),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email(),
  photos: z.array(z.string().url()).optional(),
});

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 },
      );
    }

    const {
      providerId,
      rating,
      title,
      body: reviewBody,
      authorName,
      authorEmail,
      photos,
    } = validation.data;

    // Verify provider exists and is published
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      select: { id: true, isPublished: true },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 },
      );
    }

    // Get authenticated user if available
    const session = await auth();

    // Create the review (pending moderation by default)
    const review = await prisma.review.create({
      data: {
        providerId,
        authorUserId: session?.user?.id || null,
        rating,
        title,
        body: reviewBody,
        authorName,
        authorEmail,
        photos: photos || [],
        isApproved: false, // Requires moderation
        isVerifiedBooking: false,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message:
          "Review submitted successfully. It will be visible after moderation.",
        review,
      },
      { status: 201 },
    );
  } catch (error: any) {
    logger.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/reviews - List reviews (public for approved, all for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = request.nextUrl;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const providerId = searchParams.get("providerId");
    const approved = searchParams.get("approved");
    const minRating = searchParams.get("minRating");
    const verified = searchParams.get("verified");
    const skip = (page - 1) * limit;

    const filters: any = {};

    const mine = searchParams.get("mine") === "true";
    const isPublic = searchParams.get("public") === "true";

    // Only show approved reviews to non-admins by default
    const isAdmin = session?.user?.role === "ADMINISTRATOR";

    if (isPublic) {
      // Public query (e.g. testimonials section) — always show approved only
      filters.isApproved = true;
    } else if (!isAdmin) {
      if (mine) {
        // Strictly limit to own reviews if requesting own
        if (!session?.user?.id) {
          return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
          );
        }
        filters.authorUserId = session.user.id;
      } else if (providerId) {
        // Viewing specific provider's reviews - only approved ones
        filters.isApproved = true;
      } else {
        // Trying to list all reviews - for non-admins this is not allowed or limited to their own
        if (!session?.user?.id) {
          filters.isApproved = true; // Public view
        } else {
          // If logged in but not admin, default to their own if no providerId
          filters.authorUserId = session.user.id;
        }
      }
    } else {
      // Admin filters
      if (approved === "false") {
        filters.isApproved = false;
      } else if (approved === "true") {
        filters.isApproved = true;
      }
    }

    if (providerId) {
      filters.providerId = providerId;
    }

    if (minRating) {
      filters.rating = { gte: parseInt(minRating) };
    }

    if (verified === "true") {
      filters.isVerifiedBooking = true;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          provider: {
            select: {
              id: true,
              businessName: true,
              coverImage: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where: filters }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
