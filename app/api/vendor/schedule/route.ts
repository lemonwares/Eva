import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";

const weeklyScheduleSchema = z.object({
  providerId: z.string().min(1),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  isClosed: z.boolean().optional().default(false),
});

const bulkScheduleSchema = z.object({
  providerId: z.string().min(1),
  schedules: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string().min(1),
      endTime: z.string().min(1),
      isClosed: z.boolean().optional().default(false),
    }),
  ),
});

// GET /api/vendor/schedule — Get weekly schedules for vendor's provider
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const providerId = request.nextUrl.searchParams.get("providerId");

    const provider = await prisma.provider.findFirst({
      where: providerId
        ? { id: providerId, ownerUserId: session.user.id }
        : { ownerUserId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found or not owned by you" },
        { status: 404 },
      );
    }

    const schedules = await prisma.weeklySchedule.findMany({
      where: { providerId: provider.id },
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json({ schedules });
  } catch (error: unknown) {
    logger.error("Error fetching vendor schedule:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/vendor/schedule — Create weekly schedules (single or bulk)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Try bulk format first
    const bulkParsed = bulkScheduleSchema.safeParse(body);
    if (bulkParsed.success) {
      const { providerId, schedules } = bulkParsed.data;

      // Verify ownership
      const provider = await prisma.provider.findFirst({
        where: { id: providerId, ownerUserId: session.user.id },
      });
      if (!provider) {
        return NextResponse.json(
          { message: "Provider not found or not owned by you" },
          { status: 403 },
        );
      }

      // Delete existing schedules and create new ones in a transaction
      const result = await prisma.$transaction(async (tx) => {
        await tx.weeklySchedule.deleteMany({ where: { providerId } });
        const created = await Promise.all(
          schedules.map((s) =>
            tx.weeklySchedule.create({
              data: {
                providerId,
                dayOfWeek: s.dayOfWeek,
                startTime: s.startTime,
                endTime: s.endTime,
                isClosed: s.isClosed,
              },
            }),
          ),
        );
        return created;
      });

      return NextResponse.json(
        { message: "Schedules saved", schedules: result },
        { status: 201 },
      );
    }

    // Fall back to single schedule
    const parsed = weeklyScheduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const { providerId, ...data } = parsed.data;

    // Verify ownership
    const provider = await prisma.provider.findFirst({
      where: { id: providerId, ownerUserId: session.user.id },
    });
    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found or not owned by you" },
        { status: 403 },
      );
    }

    const schedule = await prisma.weeklySchedule.create({
      data: { providerId, ...data },
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error: unknown) {
    logger.error("Error saving vendor schedule:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
