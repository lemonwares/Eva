import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const moderateProviderSchema = z.object({
  action: z.enum([
    "APPROVE",
    "REJECT",
    "SUSPEND",
    "ACTIVATE",
    "FEATURE",
    "UNFEATURE",
    "VERIFY",
    "UNVERIFY",
  ]),
  reason: z.string().optional(),
});

// POST /api/admin/providers/:id/moderate - Moderate a provider
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = moderateProviderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { action } = validation.data;

    const provider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    let updateData: {
      isPublished?: boolean;
      isVerified?: boolean;
      isFeatured?: boolean;
    } = {};

    switch (action) {
      case "APPROVE":
        // Approve = publish the provider
        if (provider.isPublished) {
          return NextResponse.json(
            { message: "Provider is already published" },
            { status: 400 }
          );
        }
        updateData = { isPublished: true };
        break;

      case "REJECT":
        // Reject = unpublish
        updateData = { isPublished: false, isVerified: false };
        break;

      case "SUSPEND":
        // Suspend = unpublish but keep verified status
        if (!provider.isPublished) {
          return NextResponse.json(
            { message: "Provider is already unpublished" },
            { status: 400 }
          );
        }
        updateData = { isPublished: false };
        break;

      case "ACTIVATE":
        // Activate = publish
        updateData = { isPublished: true };
        break;

      case "VERIFY":
        updateData = { isVerified: true };
        break;

      case "UNVERIFY":
        updateData = { isVerified: false };
        break;

      case "FEATURE":
        updateData = { isFeatured: true };
        break;

      case "UNFEATURE":
        updateData = { isFeatured: false };
        break;
    }

    const updated = await prisma.provider.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      message: `Provider ${action.toLowerCase()}d successfully`,
      provider: updated,
    });
  } catch (error: any) {
    console.error("Error moderating provider:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
