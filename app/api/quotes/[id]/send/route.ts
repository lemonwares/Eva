import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendTemplatedEmail, emailTemplates } from "@/lib/email";

// POST /api/quotes/[id]/send - Send quote to client
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

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            ownerUserId: true,
            businessName: true,
            quotesSentCount: true,
          },
        },
        inquiry: {
          select: { id: true, fromName: true, fromEmail: true },
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

    // Only drafts can be sent
    if (quote.status !== "DRAFT") {
      return NextResponse.json(
        { message: "Quote has already been sent" },
        { status: 400 }
      );
    }

    // Validate quote has required data
    if (!quote.inquiry?.fromEmail) {
      return NextResponse.json(
        { message: "Quote must be linked to an inquiry with an email address" },
        { status: 400 }
      );
    }

    // Check quote validity
    if (new Date(quote.validUntil) < new Date()) {
      return NextResponse.json(
        {
          message:
            "Quote validity date has passed. Please update before sending.",
        },
        { status: 400 }
      );
    }

    // Update quote status
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status: "SENT" },
    });

    // Update inquiry status
    if (quote.inquiry) {
      await prisma.inquiry.update({
        where: { id: quote.inquiry.id },
        data: { status: "QUOTED" },
      });
    }

    // Update provider stats
    await prisma.provider.update({
      where: { id: quote.provider.id },
      data: { quotesSentCount: { increment: 1 } },
    });

    // Send email to client with quote details
    if (quote.inquiry?.fromEmail) {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const quoteUrl = `${baseUrl}/quotes/${id}`;

      await sendTemplatedEmail(
        quote.inquiry.fromEmail,
        emailTemplates.quoteSent(
          quote.inquiry.fromName,
          quote.provider.businessName,
          quote.totalPrice.toFixed(2),
          quoteUrl
        )
      );
    }

    return NextResponse.json({
      message: "Quote sent successfully",
      quote: updatedQuote,
    });
  } catch (error: any) {
    logger.error("Error sending quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
