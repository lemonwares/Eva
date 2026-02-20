import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const verificationSchema = z.object({
  isVerified: z.boolean(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  planTier: z.enum(["FREE", "BASIC", "PREMIUM", "ENTERPRISE"]).optional(),
  adminNotes: z.string().optional(),
});

// PATCH /api/admin/providers/[id]/verify - Admin verification
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const provider = await prisma.provider.findUnique({
      where: { id },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = verificationSchema.parse(body);

    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: {
        isVerified: validatedData.isVerified,
        isPublished: validatedData.isPublished ?? provider.isPublished,
        isFeatured: validatedData.isFeatured ?? provider.isFeatured,
        planTier: validatedData.planTier ?? provider.planTier,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: validatedData.isVerified
          ? "PROVIDER_VERIFIED"
          : "PROVIDER_SUSPENDED",
        userId: session.user.id,
        entityType: "Provider",
        entityId: id,
        metadata: {
          adminNotes: validatedData.adminNotes,
          previousState: {
            isVerified: provider.isVerified,
            isPublished: provider.isPublished,
          },
        },
      },
    });

    return NextResponse.json({
      message: `Provider ${
        validatedData.isVerified ? "verified" : "suspended"
      } successfully`,
      provider: updatedProvider,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    logger.error("Error verifying provider:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/admin/providers/[id]/verify - Get verification status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMINISTRATOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, createdAt: true },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    // Get audit logs separately
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        entityType: "Provider",
        entityId: id,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ provider: { ...provider, auditLogs } });
  } catch (error: any) {
    logger.error("Error fetching provider verification status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
