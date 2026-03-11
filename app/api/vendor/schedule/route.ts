import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logger } from "@/lib/logger";

// PUT /api/vendor/schedule
// Update vendor's weekly schedule
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { providerId, schedules } = body;

    if (!providerId || !schedules || !Array.isArray(schedules)) {
      return NextResponse.json(
        { message: "Provider ID and schedules array are required" },
        { status: 400 }
      );
    }

    // Verify the provider belongs to the current user
    const provider = await prisma.provider.findFirst({
      where: {
        id: providerId,
        ownerUserId: session.user.id,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found or access denied" },
        { status: 404 }
      );
    }

    // Delete existing schedules for this provider
    await prisma.weeklySchedule.deleteMany({
      where: { providerId },
    });

    // Create new schedules
    const weeklySchedules = await prisma.weeklySchedule.createMany({
      data: schedules.map((schedule: any) => ({
        providerId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isClosed: schedule.isClosed,
      })),
    });

    return NextResponse.json({
      message: "Business hours updated successfully",
      schedules: weeklySchedules,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Error updating business hours:", message);
    return NextResponse.json(
      { message: "Failed to update business hours" },
      { status: 500 }
    );
  }
}

// POST /api/vendor/schedule
// Create vendor's weekly schedule (used during onboarding)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { providerId, schedules } = body;

    if (!providerId || !schedules || !Array.isArray(schedules)) {
      return NextResponse.json(
        { message: "Provider ID and schedules array are required" },
        { status: 400 }
      );
    }

    // Verify the provider belongs to the current user
    const provider = await prisma.provider.findFirst({
      where: {
        id: providerId,
        ownerUserId: session.user.id,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found or access denied" },
        { status: 404 }
      );
    }

    // Create schedules
    const weeklySchedules = await prisma.weeklySchedule.createMany({
      data: schedules.map((schedule: any) => ({
        providerId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isClosed: schedule.isClosed,
      })),
    });

    return NextResponse.json({
      message: "Business hours created successfully",
      schedules: weeklySchedules,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("Error creating business hours:", message);
    return NextResponse.json(
      { message: "Failed to create business hours" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";