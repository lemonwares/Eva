import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const WeeklyScheduleUpdateSchema = z.object({
  dayOfWeek: z.number().min(0).max(6).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isClosed: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const schedule = await prisma.weeklySchedule.findUnique({
    where: { id: params.id },
  });
  if (!schedule) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ schedule });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{id: string}> }
) {
  const body = await request.json();
  const validation = WeeklyScheduleUpdateSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const schedule = await prisma.weeklySchedule.update({
    where: { id: (await params).id },
    data: body,
  });
  return NextResponse.json({ schedule });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{id: string}> }
) {
  await prisma.weeklySchedule.delete({
    where: { id: (await params).id },
  });
  return NextResponse.json({ success: true });
}
