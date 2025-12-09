import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, formatAmountForStripe } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  bookingId: z.string(),
  paymentType: z.enum(["DEPOSIT", "BALANCE", "FULL"]),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to make a payment" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookingId, paymentType } = checkoutSchema.parse(body);

    // Get booking with provider and payments info
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
          },
        },
        payments: {
          select: {
            id: true,
            paymentType: true,
            status: true,
          },
        },
        quote: {
          select: {
            inquiry: {
              select: {
                fromUserId: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify the user owns this booking (via client email or quote inquiry)
    const isClient = booking.clientEmail === session.user.email;
    const isInquiryOwner =
      booking.quote?.inquiry?.fromUserId === session.user.id;

    if (!isClient && !isInquiryOwner) {
      return NextResponse.json(
        { error: "You are not authorized to make this payment" },
        { status: 403 }
      );
    }

    // Determine payment amount based on type
    let amount: number;
    let description: string;

    switch (paymentType) {
      case "DEPOSIT":
        if (!booking.depositAmount) {
          return NextResponse.json(
            { error: "This booking doesn't require a deposit" },
            { status: 400 }
          );
        }
        // Check if deposit already paid
        const depositPaid = booking.payments.some(
          (p) => p.paymentType === "DEPOSIT" && p.status === "SUCCEEDED"
        );
        if (depositPaid) {
          return NextResponse.json(
            { error: "Deposit has already been paid" },
            { status: 400 }
          );
        }
        amount = booking.depositAmount;
        description = `Deposit for ${
          booking.provider.businessName
        } - Event: ${new Date(booking.eventDate).toLocaleDateString()}`;
        break;

      case "BALANCE":
        if (!booking.balanceAmount) {
          return NextResponse.json(
            { error: "This booking doesn't have a balance payment" },
            { status: 400 }
          );
        }
        // Check if balance already paid
        const balancePaid = booking.payments.some(
          (p) => p.paymentType === "BALANCE" && p.status === "SUCCEEDED"
        );
        if (balancePaid) {
          return NextResponse.json(
            { error: "Balance has already been paid" },
            { status: 400 }
          );
        }
        // Check if deposit was paid first (for DEPOSIT_BALANCE mode)
        if (
          booking.paymentMode === "DEPOSIT_BALANCE" &&
          !booking.depositPaidAt
        ) {
          return NextResponse.json(
            { error: "Please pay the deposit first before paying the balance" },
            { status: 400 }
          );
        }
        amount = booking.balanceAmount;
        description = `Balance payment for ${
          booking.provider.businessName
        } - Event: ${new Date(booking.eventDate).toLocaleDateString()}`;
        break;

      case "FULL":
        // Check if any payments already made
        const anyPaid = booking.payments.some((p) => p.status === "SUCCEEDED");
        if (anyPaid) {
          return NextResponse.json(
            { error: "A payment has already been made for this booking" },
            { status: 400 }
          );
        }
        amount = booking.pricingTotal;
        description = `Full payment for ${
          booking.provider.businessName
        } - Event: ${new Date(booking.eventDate).toLocaleDateString()}`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid payment type" },
          { status: 400 }
        );
    }

    // Get base URL for success/cancel URLs
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    // Create Stripe checkout session
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: booking.clientEmail,
      client_reference_id: booking.id,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: description,
              description: `Vendor: ${booking.provider.businessName}`,
              metadata: {
                bookingId: booking.id,
                paymentType,
                vendorId: booking.providerId,
              },
            },
            unit_amount: formatAmountForStripe(amount),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        paymentType,
        userId: session.user.id,
        vendorId: booking.providerId,
      },
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${baseUrl}/payment/cancel?booking_id=${booking.id}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
    });

    // Create a pending payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        paymentType,
        amount,
        currency: "EUR",
        status: "PENDING",
        stripePaymentIntentId:
          (checkoutSession.payment_intent as string) || null,
        metadata: {
          checkoutSessionId: checkoutSession.id,
        },
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
