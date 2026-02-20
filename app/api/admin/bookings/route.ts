import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/admin/bookings - List all bookings for admin
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const providerId = searchParams.get("providerId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const skip = (page - 1) * limit;

    const filters: any = {};

    if (status) {
      filters.status = status;
    }

    if (providerId) {
      filters.providerId = providerId;
    }

    if (fromDate) {
      filters.eventDate = { ...filters.eventDate, gte: new Date(fromDate) };
    }

    if (toDate) {
      filters.eventDate = { ...filters.eventDate, lte: new Date(toDate) };
    }

    const [bookings, total, statusCounts] = await Promise.all([
      prisma.booking.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          provider: {
            select: {
              id: true,
              businessName: true,
              owner: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          quote: {
            select: {
              id: true,
              totalPrice: true,
            },
          },
        },
        orderBy: { eventDate: "asc" },
      }),
      prisma.booking.count({ where: filters }),
      prisma.booking.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statusCounts: statusCounts.reduce(
        (
          acc: Record<string, number>,
          { status, _count }: { status: string; _count: { id: number } }
        ) => ({ ...acc, [status]: _count.id }),
        {} as Record<string, number>
      ),
    });
  } catch (error: any) {
    logger.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
