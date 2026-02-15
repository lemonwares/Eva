import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";

const teamMemberSchema = z.object({
  providerId: z.string().min(1),
  name: z.string().min(1, "Name is required").max(200),
  role: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  imageUrl: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(30).optional(),
});

const bulkTeamSchema = z.object({
  providerId: z.string().min(1),
  members: z.array(
    z.object({
      name: z.string().min(1).max(200),
      imageUrl: z.string().optional(),
    }),
  ),
});

// GET /api/vendor/team — Get team members for vendor's provider
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

    const teamMembers = await prisma.teamMember.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ teamMembers });
  } catch (error: unknown) {
    logger.error("Error fetching vendor team:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/vendor/team — Create team members (single or bulk)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Try bulk format first
    const bulkParsed = bulkTeamSchema.safeParse(body);
    if (bulkParsed.success) {
      const { providerId, members } = bulkParsed.data;

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

      const created = await prisma.$transaction(
        members
          .filter((m) => m.name.trim() !== "")
          .map((m) =>
            prisma.teamMember.create({
              data: {
                providerId,
                name: m.name.trim(),
                imageUrl: m.imageUrl || null,
              },
            }),
          ),
      );

      return NextResponse.json(
        { message: "Team members saved", teamMembers: created },
        { status: 201 },
      );
    }

    // Fall back to single member
    const parsed = teamMemberSchema.safeParse(body);
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

    const teamMember = await prisma.teamMember.create({
      data: { providerId, ...data },
    });

    return NextResponse.json({ teamMember }, { status: 201 });
  } catch (error: unknown) {
    logger.error("Error saving vendor team member:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/vendor/team — Delete a team member (must own it)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Team member ID required" },
        { status: 400 },
      );
    }

    // Find team member and verify ownership
    const member = await prisma.teamMember.findUnique({
      where: { id },
      include: { provider: { select: { ownerUserId: true } } },
    });

    if (!member || member.provider.ownerUserId !== session.user.id) {
      return NextResponse.json(
        { message: "Team member not found" },
        { status: 404 },
      );
    }

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: unknown) {
    logger.error("Error deleting vendor team member:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
