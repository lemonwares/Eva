import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/vendor/listings - Get all listings for vendor
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "No provider found" },
        { status: 404 }
      );
    }

    const listings = await prisma.listing.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (error: unknown) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/vendor/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findFirst({
      where: { ownerUserId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "No provider found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { headline, longDescription, minPrice, maxPrice, coverImageUrl } =
      body;

    if (!headline || typeof headline !== "string" || headline.trim() === "") {
      return NextResponse.json(
        { message: "Service name (headline) is required" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        headline: headline.trim(),
        longDescription: longDescription || null,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        coverImageUrl: coverImageUrl || null,
        providerId: provider.id,
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
