import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const WeeklyScheduleSchema = z.object({
  providerId: z.string(),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isClosed: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const providerId = request.nextUrl.searchParams.get("providerId");
  if (!providerId) {
    return NextResponse.json({ error: "providerId required" }, { status: 400 });
  }
  const schedules = await prisma.weeklySchedule.findMany({
    where: { providerId },
    orderBy: { dayOfWeek: "asc" },
  });
  return NextResponse.json({ schedules });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = WeeklyScheduleSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const schedule = await prisma.weeklySchedule.create({ data: body });
  return NextResponse.json({ schedule });
}
