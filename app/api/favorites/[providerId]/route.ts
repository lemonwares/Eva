import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// DELETE /api/favorites/:providerId - Remove a provider from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { providerId } = await params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_providerId: {
          userId: session.user.id,
          providerId,
        },
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { message: "Favorite not found" },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({
      where: {
        userId_providerId: {
          userId: session.user.id,
          providerId,
        },
      },
    });

    return NextResponse.json({ message: "Provider removed from favorites" });
  } catch (error: any) {
    logger.error("Error removing favorite:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/favorites/:providerId - Check if provider is in favorites
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorited: false });
    }

    const { providerId } = await params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_providerId: {
          userId: session.user.id,
          providerId,
        },
      },
    });

    return NextResponse.json({ isFavorited: !!favorite });
  } catch (error: any) {
    logger.error("Error checking favorite:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
