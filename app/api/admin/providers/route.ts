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

    if (status === "active") {
      filters.isPublished = true;
      filters.isVerified = true;
    } else if (status === "pending") {
      filters.isPublished = false;
    } else if (status === "suspended") {
      filters.isVerified = false;
    }

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (cityId) {
      filters.cityId = cityId;
    }

    if (featured !== null && featured !== undefined) {
      filters.isFeatured = featured === "true";
    }

    const [rawProviders, total, statusCounts] = await Promise.all([
      prisma.provider.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          subcategory: {
            select: { id: true, name: true, slug: true },
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
      Promise.all([
        prisma.provider.count({
          where: { isPublished: true, isVerified: true },
        }),
        prisma.provider.count({ where: { isPublished: false } }),
        prisma.provider.count({ where: { isVerified: false } }),
      ]),
    ]);

    // Transform providers to add status field for frontend
    const providers = rawProviders.map((provider) => ({
      ...provider,
      status:
        provider.isPublished && provider.isVerified
          ? "ACTIVE"
          : !provider.isPublished
          ? "PENDING"
          : "SUSPENDED",
    }));

    const [activeCount, pendingCount, suspendedCount] = statusCounts;

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
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
