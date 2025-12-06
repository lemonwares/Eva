import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/admin/audit-logs - List audit logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const skip = (page - 1) * limit;

    // Build filters
    const filters: any = {};

    if (action) {
      filters.action = action;
    }

    if (entityType) {
      filters.entityType = entityType;
    }

    if (userId) {
      filters.userId = userId;
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        filters.createdAt.lte = new Date(endDate);
      }
    }

    const [logs, total, actionCounts] = await Promise.all([
      prisma.auditLog.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where: filters }),
      // Get counts by action type for the filter
      prisma.auditLog.groupBy({
        by: ["action"],
        _count: { _all: true },
      }),
    ]);

    // Get unique entity types
    const entityTypes = await prisma.auditLog.groupBy({
      by: ["entityType"],
      _count: { _all: true },
    });

    return NextResponse.json({
      logs: logs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        changes: log.changes,
        metadata: log.metadata,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt,
        user: log.user
          ? {
              id: log.user.id,
              name: log.user.name,
              email: log.user.email,
              role: log.user.role,
            }
          : null,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        actions: actionCounts.map((a) => ({
          action: a.action,
          count: a._count._all,
        })),
        entityTypes: entityTypes.map((e) => ({
          type: e.entityType,
          count: e._count._all,
        })),
      },
    });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
