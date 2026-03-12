import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const moderateProviderSchema = z.object({
  action: z.enum([
    "APPROVE",
    "REJECT",
    "SUSPEND",
    "ACTIVATE",
    "FEATURE",
    "UNFEATURE",
  ]),
  reason: z.string().optional(),
});

// GET /api/admin/providers - List all providers with admin filters
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    const cityId = searchParams.get("cityId");
    const featured = searchParams.get("featured");
    const skip = (page - 1) * limit;

    const filters: any = {};

    if (search) {
      filters.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { owner: { name: { contains: search, mode: "insensitive" } } },
        { owner: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status && status !== "all") {
      if (status === "ACTIVE") {
        filters.isPublished = true;
        filters.isVerified = true;
      } else if (status === "PENDING") {
        filters.OR = [
          { isPublished: false },
          { isVerified: false }
        ];
      } else if (status === "SUSPENDED") {
        filters.isPublished = false;
        filters.isVerified = false;
      }
    }

    if (categoryId && categoryId !== "all") {
      filters.categories = {
        has: categoryId
      };
    }

    if (cityId) {
      filters.cityId = cityId;
    }

    if (featured !== null && featured !== undefined) {
      filters.isFeatured = featured === "true";
    }

    const [rawProviders, total] = await Promise.all([
      prisma.provider.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: {
              reviews: true,
              bookings: true,
              inquiries: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.provider.count({ where: filters }),
    ]);

    // Transform providers to add status field for frontend
    const providers = rawProviders.map((provider) => {
      // Determine status based on published and verified flags
      let status = "ACTIVE";
      if (!provider.isPublished && !provider.isVerified) {
        status = "SUSPENDED";
      } else if (!provider.isPublished || !provider.isVerified) {
        status = "PENDING";
      }

      return {
        ...provider,
        status,
      };
    });

    const [activeCount, pendingCount, suspendedCount] = await Promise.all([
      prisma.provider.count({
        where: { isPublished: true, isVerified: true },
      }),
      prisma.provider.count({
        where: {
          OR: [
            { isPublished: false, isVerified: true },
            { isPublished: true, isVerified: false }
          ]
        }
      }),
      prisma.provider.count({
        where: { isPublished: false, isVerified: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      providers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statusCounts: {
        active: activeCount,
        pending: pendingCount,
        suspended: suspendedCount,
      },
    });
  } catch (error: any) {
    logger.error("Error fetching providers:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
