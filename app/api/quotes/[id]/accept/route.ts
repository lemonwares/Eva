import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { z } from "zod";
import { sendTemplatedEmail, sendEmail, emailTemplates } from "@/lib/email";

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
  { params }: { params: Promise<{ id: string }> }
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
        { status: 400 }
      );
    }

    if (quote.status === "ACCEPTED") {
      return NextResponse.json(
        { message: "Quote has already been accepted" },
        { status: 400 }
      );
    }

    if (quote.status === "DECLINED" || quote.status === "CANCELLED") {
      return NextResponse.json(
        { message: "Quote is no longer available" },
        { status: 400 }
      );
    }

    if (quote.status === "EXPIRED" || new Date(quote.validUntil) < new Date()) {
      return NextResponse.json(
        { message: "Quote has expired" },
        { status: 400 }
      );
    }

    if (quote.booking) {
      return NextResponse.json(
        { message: "A booking already exists for this quote" },
        { status: 400 }
      );
    }

    // Validate payment mode is allowed
    if (!quote.allowedPaymentModes.includes(validatedData.paymentMode)) {
      return NextResponse.json(
        { message: "Selected payment mode is not allowed for this quote" },
        { status: 400 }
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
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
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
      }
    );

    // Send confirmation emails to client and vendor
    const eventDate = quote.inquiry?.eventDate || new Date();
    const eventDateStr = eventDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const bookingUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/bookings/${result.id}`;

    // Email to client
    await sendTemplatedEmail(
      validatedData.clientEmail,
      emailTemplates.bookingConfirmed(
        validatedData.clientName,
        quote.provider.businessName,
        eventDateStr,
        "Event",
        bookingUrl
      )
    ).catch((err) => console.error("Failed to send client confirmation:", err));

    // Email to vendor (get vendor owner email)
    if (quote.provider.ownerUserId) {
      const vendorOwner = await prisma.user.findUnique({
        where: { id: quote.provider.ownerUserId },
        select: { email: true },
      });

      if (vendorOwner?.email) {
        await sendEmail({
          to: vendorOwner.email,
          subject: `New Booking Confirmed - ${validatedData.clientName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2>🎉 Congratulations! Booking Confirmed</h2>
              <p>Great news! Your quote has been accepted and a booking has been created.</p>
              
              <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Client:</strong> ${validatedData.clientName}</p>
                <p><strong>Email:</strong> ${validatedData.clientEmail}</p>
                ${
                  validatedData.clientPhone
                    ? `<p><strong>Phone:</strong> ${validatedData.clientPhone}</p>`
                    : ""
                }
                <p><strong>Event Date:</strong> ${eventDateStr}</p>
                <p><strong>Total:</strong> £${quote.totalPrice.toFixed(2)}</p>
                <p><strong>Payment Mode:</strong> ${validatedData.paymentMode.replace(
                  /_/g,
                  " "
                )}</p>
              </div>
              
              <p>Log in to your dashboard to manage this booking.</p>
            </div>
          `,
        }).catch((err) =>
          console.error("Failed to send vendor notification:", err)
        );
      }
    }

    return NextResponse.json({
      message: "Quote accepted, booking created",
      booking: result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Error accepting quote:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
