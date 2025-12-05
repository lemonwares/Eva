import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/notifications - Get notifications (admin gets system notifications)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const skip = (page - 1) * limit;

    const filters: any = {};
    if (status) filters.status = status;
    if (type) filters.type = type;

    // Admin can see all notifications
    if (session.user.role === "ADMINISTRATOR") {
      const [notifications, total] = await Promise.all([
        prisma.notificationQueue.findMany({
          where: filters,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.notificationQueue.count({ where: filters }),
      ]);

      const unreadCount = await prisma.notificationQueue.count({
        where: { status: "PENDING" },
      });

      return NextResponse.json({
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    // Regular users get empty for now (no user-specific notifications model yet)
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
