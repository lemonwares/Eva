import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const createResponseSchema = z.object({
  content: z.string().min(10).max(2000),
});

// POST /api/reviews/:id/respond - Add vendor response to review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = createResponseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { content } = validation.data;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        provider: {
          select: { id: true, ownerUserId: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Only provider owner can respond
    const isOwner = review.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Can only respond to approved reviews
    if (!review.isApproved) {
      return NextResponse.json(
        { message: "Can only respond to approved reviews" },
        { status: 400 }
      );
    }

    // Check if response already exists
    if (review.providerReply) {
      return NextResponse.json(
        { message: "Response already exists. Use PATCH to update." },
        { status: 400 }
      );
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        providerReply: content,
        providerRepliedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Response submitted successfully.",
        review: updated,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating response:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews/:id/respond - Update response
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = createResponseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { content } = validation.data;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    if (!review.providerReply) {
      return NextResponse.json(
        { message: "No response exists. Use POST to create." },
        { status: 404 }
      );
    }

    // Only provider owner can update
    const isOwner = review.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        providerReply: content,
        providerRepliedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating response:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/:id/respond - Delete response
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    if (!review.providerReply) {
      return NextResponse.json(
        { message: "No response exists" },
        { status: 404 }
      );
    }

    const isOwner = review.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.review.update({
      where: { id },
      data: {
        providerReply: null,
        providerRepliedAt: null,
      },
    });

    return NextResponse.json({ message: "Response deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting response:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
