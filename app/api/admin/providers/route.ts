import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { randomBytes } from "crypto";
import { emailTemplates, sendTemplatedEmail } from "@/lib/email";

const moderateProviderSchema = z.object({
  action: z.enum([
    "APPROVE",
    "REJECT",
    "SUSPEND",
    "ACTIVATE",
    "FEATURE",
    "UNFEATURE",
  ]),
  reason: z.string().optional(),
});

// GET /api/admin/providers - List all providers with admin filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    const cityId = searchParams.get("cityId");
    const featured = searchParams.get("featured");
    const skip = (page - 1) * limit;

    const filters: any = {};

    if (search) {
      filters.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { owner: { name: { contains: search, mode: "insensitive" } } },
        { owner: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status && status !== "all") {
      if (status === "ACTIVE") {
        filters.isPublished = true;
        filters.isVerified = true;
      } else if (status === "PENDING") {
        filters.OR = [
          { isPublished: false },
          { isVerified: false }
        ];
      } else if (status === "SUSPENDED") {
        filters.isPublished = false;
        filters.isVerified = false;
      }
    }

    if (categoryId && categoryId !== "all") {
      // categories field stores slugs — resolve the ID to a slug first
      const cat = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { slug: true },
      });
      if (cat) {
        filters.categories = { has: cat.slug };
      }
    }

    if (cityId) {
      filters.cityId = cityId;
    }

    if (featured !== null && featured !== undefined) {
      filters.isFeatured = featured === "true";
    }

    const [rawProviders, total] = await Promise.all([
      prisma.provider.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: {
              reviews: true,
              bookings: true,
              inquiries: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.provider.count({ where: filters }),
    ]);

    // Transform providers to add status field for frontend
    const providers = rawProviders.map((provider) => {
      // Determine status based on published and verified flags
      let status = "ACTIVE";
      if (!provider.isPublished && !provider.isVerified) {
        status = "SUSPENDED";
      } else if (!provider.isPublished || !provider.isVerified) {
        status = "PENDING";
      }

      return {
        ...provider,
        status,
      };
    });

    const [activeCount, pendingCount, suspendedCount] = await Promise.all([
      prisma.provider.count({
        where: { isPublished: true, isVerified: true },
      }),
      prisma.provider.count({
        where: {
          OR: [
            { isPublished: false, isVerified: true },
            { isPublished: true, isVerified: false }
          ]
        }
      }),
      prisma.provider.count({
        where: { isPublished: false, isVerified: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      providers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statusCounts: {
        active: activeCount,
        pending: pendingCount,
        suspended: suspendedCount,
      },
    });
  } catch (error: any) {
    logger.error("Error fetching providers:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/providers - Create a new vendor account + provider profile
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { businessName, ownerEmail, ownerName, phone, categoryId, description, address, postcode, priceFrom } = body;

    if (!businessName || !ownerEmail) {
      return NextResponse.json({ success: false, error: "Business name and owner email are required" }, { status: 400 });
    }

    // Resolve categoryId → slug
    let categorySlug: string | null = null;
    if (categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: categoryId }, select: { slug: true } });
      categorySlug = cat?.slug ?? null;
    }

    // Upsert the owner user (create if not exists)
    let user = await prisma.user.findUnique({ where: { email: ownerEmail } });
    if (!user) {
      const bcrypt = await import("bcryptjs");
      const tempPassword = await bcrypt.hash(randomBytes(16).toString("hex"), 10);
      user = await prisma.user.create({
        data: {
          email: ownerEmail,
          name: ownerName || ownerEmail.split("@")[0],
          password: tempPassword,
          role: "PROFESSIONAL",
          // NOT pre-verified — they'll verify via the invite link
        },
      });
    }

    // Generate a unique slug
    const baseSlug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.provider.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const provider = await prisma.provider.create({
      data: {
        ownerUserId: user.id,
        businessName,
        slug,
        description: description || null,
        categories: categorySlug ? [categorySlug] : [],
        address: address || null,
        postcode: postcode || "N/A",
        phonePublic: phone || null,
        priceFrom: priceFrom ? parseFloat(priceFrom) : null,
        serviceRadiusMiles: 25,
        isPublished: true,   // PENDING = published but not verified
        isVerified: false,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { reviews: true, bookings: true, inquiries: true } },
      },
    });

    // Generate invite token (72 hours) stored in password_resets table
    const token = randomBytes(32).toString("hex");
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const inviteUrl = `${baseUrl}/auth/accept-invite?token=${token}`;
    const vendorName = ownerName || ownerEmail.split("@")[0];

    await sendTemplatedEmail(
      ownerEmail,
      emailTemplates.vendorInvite(vendorName, businessName, inviteUrl),
    );

    return NextResponse.json({ success: true, provider }, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating provider:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
