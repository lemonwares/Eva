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

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await request.json();

  // If action is present, do moderation logic
  if (body.action) {
    const validation = moderateProviderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }
    const { action } = validation.data;
    const provider = await prisma.provider.findUnique({ where: { id } });
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
        if (provider.isPublished) {
          return NextResponse.json(
            { message: "Provider is already published" },
            { status: 400 }
          );
        }
        updateData = { isPublished: true };
        break;
      case "REJECT":
        updateData = { isPublished: false, isVerified: false };
        break;
      case "SUSPEND":
        if (!provider.isPublished) {
          return NextResponse.json(
            { message: "Provider is already unpublished" },
            { status: 400 }
          );
        }
        updateData = { isPublished: false };
        break;
      case "ACTIVATE":
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
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({
      message: `Provider ${action.toLowerCase()}d successfully`,
      provider: updated,
    });
  } else {
    // Direct field update (edit vendor)
    const allowedFields = [
      "businessName",
      "description",
      "address",
      "postcode",
      "website",
      "priceFrom",
      "isVerified",
      "isFeatured",
      "isPublished",
    ];
    const updateData: any = {};
    for (const key of allowedFields) {
      if (key in body) updateData[key] = body[key];
    }
    // Map phone and serviceRadius
    if ("phone" in body) updateData.phonePublic = body.phone;
    if ("serviceRadius" in body)
      updateData.serviceRadiusMiles = body.serviceRadius;

    const updated = await prisma.provider.update({
      where: { id },
      data: updateData,
      include: {
        owner: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
    return NextResponse.json({
      message: "Provider updated successfully",
      provider: updated,
    });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
