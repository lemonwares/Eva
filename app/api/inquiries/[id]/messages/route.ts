import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const messageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty"),
});

// POST /api/inquiries/[id]/messages - Add message to inquiry thread
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
    const validatedData = messageSchema.parse(body);

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true, businessName: true },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Check authorization
    const isVendor = inquiry.provider.ownerUserId === session.user.id;
    const isClient = inquiry.fromUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isVendor && !isClient && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Determine sender type and name
    let senderType: "client" | "vendor" | "admin";
    let senderName: string;

    if (isVendor) {
      senderType = "vendor";
      senderName = inquiry.provider.businessName;
    } else if (isAdmin) {
      senderType = "admin";
      senderName = session.user.name || "Admin";
    } else {
      senderType = "client";
      senderName = inquiry.fromName;
    }

    // Add new message to the thread
    const newMessage = {
      sender: senderType,
      senderName,
      senderId: session.user.id,
      text: validatedData.text,
      timestamp: new Date().toISOString(),
    };

    const existingMessages = (inquiry.messages as any[]) || [];

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        messages: [...existingMessages, newMessage],
      },
    });

    // TODO: Send email notification to the other party

    return NextResponse.json({
      message: "Message sent successfully",
      inquiry: updatedInquiry,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    logger.error("Error adding message:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
