import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendTemplatedEmail, sendEmail, emailTemplates } from "@/lib/email";
import { formatCurrency } from "@/lib/formatters";
import { logger } from "@/lib/logger";

const acceptSchema = z.object({
  paymentMode: z.enum(["FULL_PAYMENT", "DEPOSIT_BALANCE", "CASH_ON_DELIVERY"]),
  clientName: z.string().min(2, "Client name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().optional(),
  eventLocation: z.string().optional(),
  specialRequests: z.string().optional(),
});

// POST /api/quotes/[id]/accept - Client accepts quote (creates booking)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = acceptSchema.parse(body);

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            ownerUserId: true,
            quotesAcceptedCount: true,
          },
        },
        inquiry: {
          select: {
            id: true,
            fromName: true,
            fromEmail: true,
            eventDate: true,
            guestsCount: true,
          },
        },
        booking: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    // Check if quote can be accepted
    if (quote.status === "DRAFT") {
      return NextResponse.json(
        { message: "Quote has not been sent yet" },
        { status: 400 },
      );
    }

    if (quote.status === "ACCEPTED") {
      return NextResponse.json(
        { message: "Quote has already been accepted" },
        { status: 400 },
      );
    }

    if (quote.status === "DECLINED" || quote.status === "CANCELLED") {
      return NextResponse.json(
        { message: "Quote is no longer available" },
        { status: 400 },
      );
    }

    if (quote.status === "EXPIRED" || new Date(quote.validUntil) < new Date()) {
      return NextResponse.json(
        { message: "Quote has expired" },
        { status: 400 },
      );
    }

    if (quote.booking) {
      return NextResponse.json(
        { message: "A booking already exists for this quote" },
        { status: 400 },
      );
    }

    // Validate payment mode is allowed
    if (!quote.allowedPaymentModes.includes(validatedData.paymentMode)) {
      return NextResponse.json(
        { message: "Selected payment mode is not allowed for this quote" },
        { status: 400 },
      );
    }

    // Calculate deposit and balance
    let depositAmount: number | null = null;
    let balanceAmount: number | null = null;
    let balanceDueDate: Date | null = null;

    if (validatedData.paymentMode === "DEPOSIT_BALANCE") {
      depositAmount = (quote.totalPrice * quote.depositPercentage) / 100;
      balanceAmount = quote.totalPrice - depositAmount;

      // Balance due 7 days after event
      if (quote.inquiry?.eventDate) {
        balanceDueDate = new Date(quote.inquiry.eventDate);
        balanceDueDate.setDate(balanceDueDate.getDate() + 7);
      }
    }

    // Create booking in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Update quote status
      await tx.quote.update({
        where: { id },
        data: {
          status: "ACCEPTED",
          respondedAt: new Date(),
        },
      });

      // Update inquiry status if exists
      if (quote.inquiry) {
        await tx.inquiry.update({
          where: { id: quote.inquiry.id },
          data: { status: "ACCEPTED" },
        });
      }

      // Create booking
      const booking = await tx.booking.create({
        data: {
          quoteId: id,
          providerId: quote.provider.id,
          clientName: validatedData.clientName,
          clientEmail: validatedData.clientEmail,
          clientPhone: validatedData.clientPhone,
          eventDate: quote.inquiry?.eventDate || new Date(),
          eventLocation: validatedData.eventLocation,
          guestsCount: quote.inquiry?.guestsCount,
          specialRequests: validatedData.specialRequests,
          paymentMode: validatedData.paymentMode,
          pricingTotal: quote.totalPrice,
          depositAmount,
          balanceAmount,
          balanceDueDate,
          status:
            validatedData.paymentMode === "CASH_ON_DELIVERY"
              ? "CONFIRMED"
              : "PENDING_PAYMENT",
          statusTimeline: [
            {
              status: "BOOKING_CREATED",
              timestamp: new Date().toISOString(),
              note: "Quote accepted, booking created",
            },
          ],
        },
      });

      // Update provider stats
      await tx.provider.update({
        where: { id: quote.provider.id },
        data: { quotesAcceptedCount: { increment: 1 } },
      });

      return booking;
    });

    // Send confirmation emails ONLY for CASH_ON_DELIVERY bookings
    // (Paid bookings will get emails from the Stripe webhook after payment is completed)
    if (validatedData.paymentMode === "CASH_ON_DELIVERY") {
      const eventDate = quote.inquiry?.eventDate || new Date();
      const eventDateStr = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const bookingUrl = `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/bookings/${result.id}`;

      // Get additional provider details
      const providerDetails = await prisma.provider.findUnique({
        where: { id: quote.provider.id },
        select: {
          phonePublic: true,
          website: true,
        },
      });

      // Prepare booking confirmation data
      const bookingConfirmationData = {
        clientName: validatedData.clientName,
        vendorName: quote.provider.businessName,
        bookingId: result.id,
        eventDate: eventDateStr,
        eventType: quote.inquiry?.fromName || "Your Event",
        eventLocation: validatedData.eventLocation || "",
        guestsCount: quote.inquiry?.guestsCount || 0,
        totalAmount: quote.totalPrice,
        paymentMode: validatedData.paymentMode,
        depositAmount: depositAmount || 0,
        balanceAmount: balanceAmount || 0,
        balanceDueDate: balanceDueDate
          ? balanceDueDate.toLocaleDateString()
          : undefined,
        bookingUrl,
        vendorEmail: "",
        vendorPhone: providerDetails?.phonePublic || "",
        vendorWebsite: providerDetails?.website || "",
      };

      // Get vendor user email
      if (quote.provider.ownerUserId) {
        const vendorUser = await prisma.user.findUnique({
          where: { id: quote.provider.ownerUserId },
          select: { email: true },
        });
        if (vendorUser?.email) {
          bookingConfirmationData.vendorEmail = vendorUser.email;
        }
      }

      // Send email to client
      try {
        const clientTemplate = emailTemplates.bookingConfirmationClient(
          bookingConfirmationData,
        );
        await sendEmail({
          to: validatedData.clientEmail,
          subject: clientTemplate.subject,
          html: clientTemplate.html,
          text: clientTemplate.text,
        });
        logger.info(
          `Booking confirmation email sent to client: ${validatedData.clientEmail}`,
        );
      } catch (error) {
        logger.error(
          "Failed to send client booking confirmation email:",
          error,
        );
      }

      // Send email to vendor
      if (quote.provider.ownerUserId) {
        try {
          const vendorOwner = await prisma.user.findUnique({
            where: { id: quote.provider.ownerUserId },
            select: { email: true },
          });

          if (vendorOwner?.email) {
            const vendorTemplate = emailTemplates.bookingConfirmationVendor({
              ...bookingConfirmationData,
              vendorBusinessName: quote.provider.businessName,
              bookingUrl: `${
                process.env.NEXTAUTH_URL || "http://localhost:3000"
              }/vendor/bookings/${result.id}`,
              vendorEmail: validatedData.clientEmail,
              vendorPhone: validatedData.clientPhone || "",
            });

            await sendEmail({
              to: vendorOwner.email,
              subject: vendorTemplate.subject,
              html: vendorTemplate.html,
              text: vendorTemplate.text,
            });
            logger.info(
              `Booking confirmation email sent to vendor: ${vendorOwner.email}`,
            );
          }
        } catch (error) {
          logger.error(
            "Failed to send vendor booking confirmation email:",
            error,
          );
        }
      }
    } else {
      // For paid bookings, just log that emails will be sent after payment
      logger.info(
        `Booking created with payment required. Confirmation emails will be sent after payment is completed via Stripe webhook.`,
      );
    }

    return NextResponse.json({
      message: "Quote accepted, booking created",
      booking: result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 },
      );
    }
    logger.error("Error accepting quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
