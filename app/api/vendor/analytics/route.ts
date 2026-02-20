import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/vendor/analytics - Get vendor dashboard analytics
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
    const period = searchParams.get("period") || "30d";

    // Calculate date range
    let startDate = new Date();
    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const [
      // Profile stats
      profileViews,
      totalInquiries,
      newInquiries,
      totalBookings,
      newBookings,
      completedBookings,
      upcomingBookings,
      totalReviews,
      newReviews,
      // Revenue (from quotes)
      revenueStats,
      // Inquiry response rate
      respondedInquiries,
      // Quote conversion
      quotesSent,
      quotesAccepted,
      // Recent activity
      recentInquiries,
      recentBookings,
      recentReviews,
    ] = await Promise.all([
      // Profile views (from provider record)
      Promise.resolve(provider.profileViewCount || 0),

      // Inquiry counts
      prisma.inquiry.count({ where: { providerId: provider.id } }),
      prisma.inquiry.count({
        where: { providerId: provider.id, createdAt: { gte: startDate } },
      }),

      // Booking counts
      prisma.booking.count({ where: { providerId: provider.id } }),
      prisma.booking.count({
        where: { providerId: provider.id, createdAt: { gte: startDate } },
      }),
      prisma.booking.count({
        where: {
          providerId: provider.id,
          status: "COMPLETED",
          updatedAt: { gte: startDate },
        },
      }),
      prisma.booking.count({
        where: {
          providerId: provider.id,
          status: "CONFIRMED",
          eventDate: { gte: new Date() },
        },
      }),

      // Review counts
      prisma.review.count({
        where: { providerId: provider.id, isApproved: true },
      }),
      prisma.review.count({
        where: {
          providerId: provider.id,
          isApproved: true,
          createdAt: { gte: startDate },
        },
      }),

      // Revenue from completed bookings
      prisma.quote.aggregate({
        where: {
          inquiry: { providerId: provider.id },
          status: "ACCEPTED",
          respondedAt: { gte: startDate },
        },
        _sum: { totalPrice: true },
        _count: { id: true },
      }),

      // Responded inquiries
      prisma.inquiry.count({
        where: {
          providerId: provider.id,
          status: { in: ["QUOTED", "ACCEPTED"] },
        },
      }),

      // Quote stats
      prisma.quote.count({
        where: {
          inquiry: { providerId: provider.id },
          status: { in: ["SENT", "ACCEPTED", "DECLINED"] },
        },
      }),
      prisma.quote.count({
        where: {
          inquiry: { providerId: provider.id },
          status: "ACCEPTED",
        },
      }),

      // Recent inquiries
      prisma.inquiry.findMany({
        where: { providerId: provider.id },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fromName: true,
          eventDate: true,
          status: true,
          createdAt: true,
        },
      }),

      // Recent bookings
      prisma.booking.findMany({
        where: { providerId: provider.id },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          clientName: true,
          eventDate: true,
          status: true,
          createdAt: true,
        },
      }),

      // Recent reviews
      prisma.review.findMany({
        where: { providerId: provider.id, isApproved: true },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          authorName: true,
          rating: true,
          title: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate rates
    const responseRate =
      totalInquiries > 0
        ? Math.round((respondedInquiries / totalInquiries) * 100)
        : 0;

    const conversionRate =
      quotesSent > 0 ? Math.round((quotesAccepted / quotesSent) * 100) : 0;

    return NextResponse.json({
      period,
      providerId: provider.id,
      businessName: provider.businessName,
      overview: {
        profileViews,
        averageRating: provider.averageRating,
        totalReviews: provider.reviewCount,
        newReviews,
      },
      inquiries: {
        total: totalInquiries,
        new: newInquiries,
        responseRate,
      },
      bookings: {
        total: totalBookings,
        new: newBookings,
        completed: completedBookings,
        upcoming: upcomingBookings,
      },
      quotes: {
        sent: quotesSent,
        accepted: quotesAccepted,
        conversionRate,
      },
      revenue: {
        period: revenueStats._sum.totalPrice || 0,
        bookings: revenueStats._count.id,
      },
      recentActivity: {
        inquiries: recentInquiries,
        bookings: recentBookings,
        reviews: recentReviews,
      },
    });
  } catch (error: any) {
    logger.error("Error fetching vendor analytics:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
