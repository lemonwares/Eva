import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/slugs/check - Check if slug exists and get suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { message: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existingProvider = await prisma.provider.findUnique({
      where: { slug },
      select: {
        id: true,
        businessName: true,
        slug: true,
      },
    });

    if (existingProvider) {
      return NextResponse.json({
        exists: true,
        provider: existingProvider,
        suggestions: [],
      });
    }

    // Get similar slugs for suggestions
    const similarProviders = await prisma.provider.findMany({
      where: {
        slug: {
          contains: slug.substring(0, Math.min(slug.length, 10)),
          mode: "insensitive",
        },
        isPublished: true,
      },
      select: {
        id: true,
        businessName: true,
        slug: true,
      },
      take: 5,
    });

    return NextResponse.json({
      exists: false,
      provider: null,
      suggestions: similarProviders,
    });
  } catch (error: any) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
