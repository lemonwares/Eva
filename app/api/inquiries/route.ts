import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import {
  generateInquiryEmailHTML,
  generateInquiryEmailText,
} from "@/lib/templates/inquiry-email";

// Validation schema for inquiry creation
const inquirySchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  fromName: z.string().min(2, "Name must be at least 2 characters"),
  fromEmail: z.string().email("Valid email is required"),
  fromPhone: z.string().optional(),
  eventDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  guestsCount: z.number().int().positive().optional(),
  budgetRange: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  searchPostcode: z.string().optional(),
  searchRadius: z.number().optional(),
});

// GET /api/inquiries - List inquiries (for authenticated vendor or admin)
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

    // If user is a vendor, only show their inquiries
    if (session.user.role === "PROFESSIONAL") {
      const provider = await prisma.provider.findFirst({
        where: { ownerUserId: session.user.id },
        select: { id: true },
      });

      if (!provider) {
        // Return empty array if vendor hasn't created provider profile yet
        return NextResponse.json({
          inquiries: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }
      filters.providerId = provider.id;
    } else if (session.user.role === "ADMINISTRATOR") {
      // Admin can filter by provider
      if (providerId) filters.providerId = providerId;
    } else if (session.user.role === "CLIENT") {
      // Clients can see their own inquiries
      filters.fromUserId = session.user.id;
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (status) {
      filters.status = status;
    }

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
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
          fromUser: {
            select: { id: true, name: true, avatar: true },
          },
          quotes: {
            select: { id: true, status: true, totalPrice: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.inquiry.count({ where: filters }),
    ]);

    return NextResponse.json({
      inquiries: Array.isArray(inquiries) ? inquiries : [],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error("Error fetching inquiries:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

// POST /api/inquiries - Create new inquiry
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const validatedData = inquirySchema.parse(body);

    // Verify provider exists and is published
    const provider = await prisma.provider.findUnique({
      where: { id: validatedData.providerId },
      select: {
        id: true,
        isPublished: true,
        isVerified: true,
        inquiryCount: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { message: "Provider not found" },
        { status: 404 }
      );
    }

    if (!provider.isPublished) {
      return NextResponse.json(
        { message: "This vendor is not currently accepting inquiries" },
        { status: 400 }
      );
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        providerId: validatedData.providerId,
        fromUserId: session?.user?.id || null,
        fromName: validatedData.fromName,
        fromEmail: validatedData.fromEmail,
        fromPhone: validatedData.fromPhone,
        eventDate: validatedData.eventDate,
        guestsCount: validatedData.guestsCount,
        budgetRange: validatedData.budgetRange,
        message: validatedData.message,
        searchPostcode: validatedData.searchPostcode,
        searchRadius: validatedData.searchRadius,
        status: "NEW",
        messages: [
          {
            sender: "client",
            senderName: validatedData.fromName,
            text: validatedData.message,
            timestamp: new Date().toISOString(),
          },
        ],
      },
      include: {
        provider: {
          select: { id: true, businessName: true },
        },
      },
    });

    // Update provider inquiry count
    await prisma.provider.update({
      where: { id: validatedData.providerId },
      data: { inquiryCount: { increment: 1 } },
    });

    // Get provider details for email
    const providerWithOwner = await prisma.provider.findUnique({
      where: { id: validatedData.providerId },
      include: {
        owner: { select: { email: true, name: true } },
      },
    });

    // Send email notification to vendor
    if (providerWithOwner?.owner?.email) {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const inquiryUrl = `${baseUrl}/vendor/inquiries/${inquiry.id}`;

      // Parse budget range to extract numeric value
      let budgetAmount: number | undefined;
      if (validatedData.budgetRange) {
        const budgetMatch = validatedData.budgetRange.match(/\d+/);
        if (budgetMatch) {
          budgetAmount = parseInt(budgetMatch[0], 10);
        }
      }

      const emailHTML = generateInquiryEmailHTML({
        vendorName:
          providerWithOwner.owner.name || providerWithOwner.businessName,
        clientName: validatedData.fromName,
        clientEmail: validatedData.fromEmail,
        eventType: body.eventType || "Event Inquiry",
        eventDate: validatedData.eventDate
          ? new Date(validatedData.eventDate).toISOString()
          : new Date().toISOString(),
        location: body.location,
        guestCount: validatedData.guestsCount,
        budget: budgetAmount,
        message: validatedData.message,
        inquiryUrl,
      });

      const emailText = generateInquiryEmailText({
        vendorName:
          providerWithOwner.owner.name || providerWithOwner.businessName,
        clientName: validatedData.fromName,
        clientEmail: validatedData.fromEmail,
        eventType: body.eventType || "Event Inquiry",
        eventDate: validatedData.eventDate
          ? new Date(validatedData.eventDate).toISOString()
          : new Date().toISOString(),
        location: body.location,
        guestCount: validatedData.guestsCount,
        budget: budgetAmount,
        message: validatedData.message,
        inquiryUrl,
      });

      await sendEmail({
        to: providerWithOwner.owner.email,
        subject: `New Inquiry from ${validatedData.fromName} - Event Inquiry`,
        html: emailHTML,
        text: emailText,
      });
    }

    return NextResponse.json(
      { message: "Inquiry sent successfully", inquiry },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    logger.error("Error creating inquiry:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
