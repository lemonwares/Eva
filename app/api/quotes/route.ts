import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import {
  generateQuoteEmailHTML,
  generateQuoteEmailText,
} from "@/lib/templates/quote-email";

// Validation schema for quote creation
const quoteItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  qty: z.number().int().positive(),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0),
});

const quoteSchema = z.object({
  inquiryId: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "At least one item is required"),
  subtotal: z.number().min(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  totalPrice: z.number().min(0),
  allowedPaymentModes: z
    .array(z.enum(["FULL_PAYMENT", "DEPOSIT_BALANCE", "CASH_ON_DELIVERY"]))
    .min(1),
  depositPercentage: z.number().min(0).max(100).default(50),
  validUntil: z.string().transform((val) => new Date(val)),
  terms: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["DRAFT", "SENT"]).default("DRAFT"),
});

// GET /api/quotes - List quotes (for authenticated vendor or admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const providerId = searchParams.get("providerId");
    const skip = (page - 1) * limit;

    const filters: any = {};

    // Role-based filtering
    if (session.user.role === "PROFESSIONAL") {
      const provider = await prisma.provider.findFirst({
        where: { ownerUserId: session.user.id },
        select: { id: true },
      });

      if (!provider) {
        // Return empty array if vendor hasn't created provider profile yet
        return NextResponse.json({
          quotes: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }
      filters.providerId = provider.id;
    } else if (session.user.role === "ADMINISTRATOR") {
      if (providerId) filters.providerId = providerId;
    } else if (session.user.role === "CLIENT") {
      // Clients can see quotes linked to their inquiries
      filters.inquiry = {
        fromUserId: session.user.id,
      };
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (status) {
      filters.status = status;
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          provider: {
            select: {
              id: true,
              businessName: true,
              coverImage: true,
              city: true,
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
              message: true,
              createdAt: true,
            },
          },
          booking: {
            select: { id: true, status: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.quote.count({ where: filters }),
    ]);

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/quotes - Create new quote
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Only vendors and admins can create quotes
    if (
      session.user.role !== "PROFESSIONAL" &&
      session.user.role !== "ADMINISTRATOR"
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = quoteSchema.parse(body);

    // Get the vendor's provider
    let providerId: string;

    if (session.user.role === "ADMINISTRATOR" && body.providerId) {
      providerId = body.providerId;
    } else {
      const provider = await prisma.provider.findFirst({
        where: { ownerUserId: session.user.id },
        select: { id: true },
      });

      if (!provider) {
        return NextResponse.json(
          { message: "No provider profile found" },
          { status: 404 }
        );
      }
      providerId = provider.id;
    }

    // Validate inquiry if provided
    if (validatedData.inquiryId) {
      const inquiry = await prisma.inquiry.findUnique({
        where: { id: validatedData.inquiryId },
        select: { id: true, providerId: true, status: true },
      });

      if (!inquiry) {
        return NextResponse.json(
          { message: "Inquiry not found" },
          { status: 404 }
        );
      }

      if (inquiry.providerId !== providerId) {
        return NextResponse.json(
          { message: "Inquiry does not belong to this provider" },
          { status: 400 }
        );
      }
    }

    // Create quote
    // Calculate totalPrice if not provided or is zero
    let calculatedSubtotal = validatedData.items.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );
    let calculatedTotal =
      calculatedSubtotal +
      (validatedData.tax || 0) -
      (validatedData.discount || 0);
    let finalTotalPrice =
      calculatedTotal > 0 ? calculatedTotal : validatedData.totalPrice;

    const quote = await prisma.quote.create({
      data: {
        providerId,
        inquiryId: validatedData.inquiryId || null,
        items: validatedData.items,
        subtotal: calculatedSubtotal,
        tax: validatedData.tax,
        discount: validatedData.discount,
        totalPrice: finalTotalPrice,
        allowedPaymentModes: validatedData.allowedPaymentModes,
        depositPercentage: validatedData.depositPercentage,
        validUntil: validatedData.validUntil,
        terms: validatedData.terms,
        notes: validatedData.notes,
        status: validatedData.status,
      },
      include: {
        provider: {
          select: { id: true, businessName: true },
        },
        inquiry: {
          select: { id: true, fromName: true, fromEmail: true },
        },
      },
    });

    // If quote is being sent immediately, update inquiry status and provider stats
    if (validatedData.status === "SENT") {
      if (validatedData.inquiryId) {
        await prisma.inquiry.update({
          where: { id: validatedData.inquiryId },
          data: { status: "QUOTED" },
        });
      }

      await prisma.provider.update({
        where: { id: providerId },
        data: { quotesSentCount: { increment: 1 } },
      });

      // Send branded quote email to client
      if (quote.inquiry && quote.inquiry.fromEmail) {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const quoteUrl = `${baseUrl}/quotes/${quote.id}`;
        const html = generateQuoteEmailHTML({
          vendorName: quote.provider.businessName,
          clientName: quote.inquiry.fromName,
          clientEmail: quote.inquiry.fromEmail,
          quoteAmount: quote.totalPrice,
          quoteUrl,
        });
        const text = generateQuoteEmailText({
          vendorName: quote.provider.businessName,
          clientName: quote.inquiry.fromName,
          clientEmail: quote.inquiry.fromEmail,
          quoteAmount: quote.totalPrice,
          quoteUrl,
        });
        await sendEmail({
          to: quote.inquiry.fromEmail,
          subject: `Quote from ${quote.provider.businessName} - €${quote.totalPrice}`,
          html,
          text,
        });
      }
    }

    return NextResponse.json(
      { message: "Quote created successfully", quote },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
