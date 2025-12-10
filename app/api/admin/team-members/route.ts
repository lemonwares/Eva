import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const TeamMemberSchema = z.object({
  providerId: z.string(),
  name: z.string(),
  role: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const providerId = request.nextUrl.searchParams.get("providerId");
  if (!providerId) {
    return NextResponse.json({ error: "providerId required" }, { status: 400 });
  }
  const teamMembers = await prisma.teamMember.findMany({
    where: { providerId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ teamMembers });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = TeamMemberSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const teamMember = await prisma.teamMember.create({ data: body });
  return NextResponse.json({ teamMember });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  try {
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
