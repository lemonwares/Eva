import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
  coverImage: z.string().url().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional().default(false),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().optional(),
  seoIntro: z.string().optional(),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional()
    .default([]),
  aliases: z.array(z.string().min(1).max(50)).optional().default([]),
  subTags: z.array(z.string().min(1).max(50)).optional().default([]),
});

// POST /api/categories - Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Category slug already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data,
      include: {
        subcategories: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const featured = searchParams.get("featured") === "true";
    const withSubcategories = searchParams.get("withSubcategories") === "true";

    const filters: any = {};
    if (featured) {
      filters.isFeatured = true;
    }

    // Fetch all categories
    const categories = await prisma.category.findMany({
      where: filters,
      include: withSubcategories
        ? {
            subcategories: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                displayOrder: true,
              },
              orderBy: { displayOrder: "asc" },
            },
          }
        : undefined,
      orderBy: { displayOrder: "asc" },
    });

    // For each category, count providers whose categories array contains the category slug
    const categoriesWithVendorCount = await Promise.all(
      categories.map(async (cat) => {
        const vendorCount = await prisma.provider.count({
          where: {
            categories: { has: cat.slug },
            isPublished: true, // Optional: only count published vendors
          },
        });
        return {
          ...cat,
          vendorCount,
        };
      })
    );

    return NextResponse.json(categoriesWithVendorCount);
  } catch (error: any) {
    logger.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
