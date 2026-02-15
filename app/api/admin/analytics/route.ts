import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/admin/analytics - Get platform analytics (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
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

    // Get counts
    const [
      totalUsers,
      newUsers,
      totalProviders,
      activeProviders,
      pendingProviders,
      totalBookings,
      newBookings,
      completedBookings,
      totalInquiries,
      newInquiries,
      totalReviews,
      pendingReviews,
      categoryStats,
      topProviders,
    ] = await Promise.all([
      // User counts
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startDate } } }),

      // Provider counts - using isPublished and isVerified instead of status
      prisma.provider.count(),
      prisma.provider.count({ where: { isPublished: true, isVerified: true } }),
      prisma.provider.count({ where: { isPublished: false } }),

      // Booking counts
      prisma.booking.count(),
      prisma.booking.count({ where: { createdAt: { gte: startDate } } }),
      prisma.booking.count({
        where: { status: "COMPLETED", updatedAt: { gte: startDate } },
      }),

      // Inquiry counts
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: startDate } } }),

      // Review counts - using isApproved instead of status
      prisma.review.count({ where: { isApproved: true } }),
      prisma.review.count({ where: { isApproved: false } }),

      // Category breakdown - categories don't have isActive field
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { subcategories: true },
          },
        },
        orderBy: { name: "asc" },
        take: 10,
      }),

      // Top providers by reviews
      prisma.provider.findMany({
        where: { isPublished: true, isVerified: true },
        select: {
          id: true,
          businessName: true,
          averageRating: true,
          reviewCount: true,
          inquiryCount: true,
        },
        orderBy: { reviewCount: "desc" },
        take: 10,
      }),
    ]);

    // Calculate growth rates
    const previousPeriodStart = new Date(startDate);
    switch (period) {
      case "7d":
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        break;
      case "30d":
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);
        break;
      case "90d":
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 90);
        break;
      case "1y":
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
        break;
    }

    const [previousUsers, previousBookings, previousInquiries] =
      await Promise.all([
        prisma.user.count({
          where: {
            createdAt: { gte: previousPeriodStart, lt: startDate },
          },
        }),
        prisma.booking.count({
          where: {
            createdAt: { gte: previousPeriodStart, lt: startDate },
          },
        }),
        prisma.inquiry.count({
          where: {
            createdAt: { gte: previousPeriodStart, lt: startDate },
          },
        }),
      ]);

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Calculate average rating from all reviews
    const avgRatingResult = await prisma.review.aggregate({
      where: { isApproved: true },
      _avg: { rating: true },
    });

    // Get booking status counts
    const [pendingBookings, confirmedBookings, cancelledBookings] =
      await Promise.all([
        prisma.booking.count({ where: { status: "PENDING_PAYMENT" } }),
        prisma.booking.count({ where: { status: "CONFIRMED" } }),
        prisma.booking.count({ where: { status: "CANCELLED" } }),
      ]);

    // Return data in format that works for BOTH admin dashboard and analytics page
    return NextResponse.json({
      success: true,
      // Original format for admin dashboard (app/admin/page.tsx)
      period,
      overview: {
        users: {
          total: totalUsers,
          new: newUsers,
          growth: calculateGrowth(newUsers, previousUsers),
        },
        providers: {
          total: totalProviders,
          active: activeProviders,
          pending: pendingProviders,
        },
        bookings: {
          total: totalBookings,
          new: newBookings,
          completed: completedBookings,
          growth: calculateGrowth(newBookings, previousBookings),
        },
        inquiries: {
          total: totalInquiries,
          new: newInquiries,
          growth: calculateGrowth(newInquiries, previousInquiries),
        },
        reviews: {
          total: totalReviews,
          pending: pendingReviews,
        },
      },
      breakdown: {
        categories: categoryStats,
        topProviders,
      },
      // New format for analytics page (app/admin/analytics/page.tsx)
      data: {
        overview: {
          totalRevenue: 0,
          totalUsers,
          totalBookings,
          totalProviders,
          totalReviews,
          averageRating: avgRatingResult._avg.rating || 0,
          revenueChange: 0,
          usersChange: calculateGrowth(newUsers, previousUsers),
          bookingsChange: calculateGrowth(newBookings, previousBookings),
          providersChange: 0,
        },
        recentActivity: {
          recentBookings: newBookings,
          recentReviews: pendingReviews,
          recentUsers: newUsers,
          recentProviders: pendingProviders,
        },
        topProviders: topProviders.map((p) => ({
          id: p.id,
          businessName: p.businessName,
          bookingCount: 0,
          reviewCount: p.reviewCount,
          averageRating: p.averageRating || 0,
          totalRevenue: 0,
        })),
        topCategories: categoryStats.map((c) => ({
          id: c.id,
          name: c.name,
          providerCount: c._count.subcategories,
          percentage:
            totalProviders > 0
              ? Math.round((c._count.subcategories / totalProviders) * 100)
              : 0,
        })),
        bookingsByStatus: {
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
        },
      },
    });
  } catch (error: any) {
    logger.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
