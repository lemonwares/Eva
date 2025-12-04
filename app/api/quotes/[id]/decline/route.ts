import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const declineSchema = z.object({
  reason: z.string().optional(),
});

// POST /api/quotes/[id]/decline - Client declines quote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const validatedData = declineSchema.parse(body);

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        provider: {
          select: { id: true, businessName: true },
        },
        inquiry: {
          select: { id: true },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    // Check if quote can be declined
    if (quote.status === "DRAFT") {
      return NextResponse.json(
        { message: "Quote has not been sent yet" },
        { status: 400 }
      );
    }

    if (quote.status === "ACCEPTED") {
      return NextResponse.json(
        { message: "Quote has already been accepted" },
        { status: 400 }
      );
    }

    if (quote.status === "DECLINED") {
      return NextResponse.json(
        { message: "Quote has already been declined" },
        { status: 400 }
      );
    }

    // Update quote status
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        status: "DECLINED",
        respondedAt: new Date(),
        notes: validatedData.reason
          ? `${quote.notes || ""}\n\nDecline reason: ${
              validatedData.reason
            }`.trim()
          : quote.notes,
      },
    });

    // Update inquiry status if exists
    if (quote.inquiry) {
      await prisma.inquiry.update({
        where: { id: quote.inquiry.id },
        data: { status: "DECLINED" },
      });
    }

    // TODO: Send notification to vendor

    return NextResponse.json({
      message: "Quote declined",
      quote: updatedQuote,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Error declining quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
