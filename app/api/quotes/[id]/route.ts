import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Validation schema for quote update
const quoteUpdateSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        qty: z.number().int().positive(),
        unitPrice: z.number().min(0),
        totalPrice: z.number().min(0),
      })
    )
    .optional(),
  subtotal: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
  allowedPaymentModes: z
    .array(z.enum(["FULL_PAYMENT", "DEPOSIT_BALANCE", "CASH_ON_DELIVERY"]))
    .optional(),
  depositPercentage: z.number().min(0).max(100).optional(),
  validUntil: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/quotes/[id] - Get single quote
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            coverImage: true,
            city: true,
            postcode: true,
            ownerUserId: true,
            phonePublic: true,
            website: true,
          },
        },
        inquiry: {
          select: {
            id: true,
            fromName: true,
            fromEmail: true,
            fromPhone: true,
            eventDate: true,
            guestsCount: true,
            budgetRange: true,
            message: true,
          },
        },
        booking: {
          select: { id: true, status: true, eventDate: true },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    // Check authorization for viewing
    const isVendor = session?.user?.id === quote.provider.ownerUserId;
    const isClient =
      session?.user?.id && quote.inquiry?.fromEmail === session.user.email;
    const isAdmin = session?.user?.role === "ADMINISTRATOR";

    // Allow public viewing of quotes via direct link (for clients without accounts)
    // But hide sensitive vendor info for unauthenticated access

    // If vendor views, mark as viewed
    if (!isVendor && quote.status === "SENT" && !quote.viewedAt) {
      await prisma.quote.update({
        where: { id },
        data: { viewedAt: new Date(), status: "VIEWED" },
      });
      quote.viewedAt = new Date();
      quote.status = "VIEWED";
    }

    return NextResponse.json({ quote });
  } catch (error: any) {
    logger.error("Error fetching quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/quotes/[id] - Update quote (only drafts can be updated)
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

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    // Check authorization
    const isVendor = quote.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isVendor && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Only drafts can be edited
    if (quote.status !== "DRAFT" && !isAdmin) {
      return NextResponse.json(
        { message: "Only draft quotes can be edited" },
        { status: 400 }
      );
    }

    const validatedData = quoteUpdateSchema.parse(body);

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: validatedData,
      include: {
        provider: {
          select: { id: true, businessName: true },
        },
      },
    });

    return NextResponse.json({
      message: "Quote updated successfully",
      quote: updatedQuote,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    logger.error("Error updating quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/quotes/[id] - Cancel/delete quote
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

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        provider: {
          select: { ownerUserId: true },
        },
        booking: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    // Check authorization
    const isVendor = quote.provider.ownerUserId === session.user.id;
    const isAdmin = session.user.role === "ADMINISTRATOR";

    if (!isVendor && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Cannot delete if booking exists
    if (quote.booking) {
      return NextResponse.json(
        { message: "Cannot delete quote with an existing booking" },
        { status: 400 }
      );
    }

    // Soft cancel instead of hard delete for sent quotes
    if (quote.status !== "DRAFT") {
      await prisma.quote.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({
        message: "Quote cancelled successfully",
      });
    }

    // Hard delete drafts
    await prisma.quote.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Quote deleted successfully",
    });
  } catch (error: any) {
    logger.error("Error deleting quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
