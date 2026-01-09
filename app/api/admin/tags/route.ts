import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  icon: z.string().max(10).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/admin/tags - List all tags
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const tags = await prisma.cultureTraditionTag.findMany({
      where,
      orderBy: [
         { displayOrder: "asc" },
         { name: "asc" }
      ],
    });

    return NextResponse.json(tags);
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = createTagSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    const existing = await prisma.cultureTraditionTag.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Tag with this slug already exists" },
        { status: 400 }
      );
    }

    const tag = await prisma.cultureTraditionTag.create({
      data,
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
