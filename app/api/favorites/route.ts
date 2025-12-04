import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const addFavoriteSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
});

// POST /api/favorites - Add a provider to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = addFavoriteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { providerId } = validation.data;

    // Verify provider exists and is published
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      select: { id: true, isPublished: true },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    if (!provider.isPublished) {
      return NextResponse.json(
        { message: "Cannot favorite an unpublished provider" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_providerId: {
          userId: session.user.id,
          providerId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Provider already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        providerId,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            coverImage: true,
            city: true,
            averageRating: true,
          },
        },
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error: any) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        skip,
        take: limit,
        include: {
          provider: {
            select: {
              id: true,
              businessName: true,
              description: true,
              coverImage: true,
              city: true,
              averageRating: true,
              reviewCount: true,
              priceFrom: true,
              isPublished: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.favorite.count({ where: { userId: session.user.id } }),
    ]);

    // Filter out inactive providers
    const activeFavorites = favorites.filter(
      (f: { provider: { isPublished: boolean } }) =>
        f.provider.isPublished === true
    );

    return NextResponse.json({
      favorites: activeFavorites,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
