import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const TeamMemberUpdateSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const teamMember = await prisma.teamMember.findUnique({
    where: { id: (await params).id },
  });
  if (!teamMember) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ teamMember });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const validation = TeamMemberUpdateSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const teamMember = await prisma.teamMember.update({
    where: { id: (await params).id },
    data: body,
  });
  return NextResponse.json({ teamMember });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await prisma.teamMember.delete({
    where: { id: (await params).id },
  });
  return NextResponse.json({ success: true });
}
