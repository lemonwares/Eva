import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, formatAmountFromStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Disable body parsing, need raw body for signature verification
export const runtime = "nodejs";

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  const paymentType = session.metadata?.paymentType as
    | "DEPOSIT"
    | "BALANCE"
    | "FULL";

  if (!bookingId || !paymentType) {
    console.error("Missing booking metadata in session:", session.id);
    return;
  }

  const paymentIntentId = session.payment_intent as string;

  // Find the pending payment by checkout session ID
  const pendingPayment = await prisma.payment.findFirst({
    where: {
      bookingId,
      paymentType,
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (pendingPayment) {
    // Update the payment record
    await prisma.payment.update({
      where: { id: pendingPayment.id },
      data: {
        status: "SUCCEEDED",
        stripePaymentIntentId: paymentIntentId,
        stripeChargeId: session.id,
        metadata: {
          ...((pendingPayment.metadata as object) || {}),
          completedAt: new Date().toISOString(),
          customerEmail: session.customer_email,
        },
      },
    });
  } else {
    // Create new payment record if not found
    await prisma.payment.create({
      data: {
        bookingId,
        paymentType,
        amount: formatAmountFromStripe(session.amount_total || 0),
        currency: session.currency?.toUpperCase() || "USD",
        status: "SUCCEEDED",
        stripePaymentIntentId: paymentIntentId,
        stripeChargeId: session.id,
        metadata: {
          checkoutSessionId: session.id,
          completedAt: new Date().toISOString(),
          customerEmail: session.customer_email,
        },
      },
    });
  }

  // Update booking status based on payment type
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payments: true },
  });

  if (!booking) {
    console.error("Booking not found:", bookingId);
    return;
  }

  const now = new Date();
  const statusUpdate: Record<string, unknown> = {
    updatedAt: now,
  };

  switch (paymentType) {
    case "DEPOSIT":
      statusUpdate.depositPaidAt = now;
      statusUpdate.stripeDepositIntentId = paymentIntentId;
      statusUpdate.status = "DEPOSIT_PAID";
      statusUpdate.statusTimeline = [
        ...((booking.statusTimeline as Array<{
          status: string;
          timestamp: string;
          note?: string;
        }>) || []),
        {
          status: "DEPOSIT_PAID",
          timestamp: now.toISOString(),
          note: "Deposit payment received via Stripe",
        },
      ];
      break;

    case "BALANCE":
      statusUpdate.balancePaidAt = now;
      statusUpdate.stripeBalanceIntentId = paymentIntentId;
      statusUpdate.status = "CONFIRMED";
      statusUpdate.statusTimeline = [
        ...((booking.statusTimeline as Array<{
          status: string;
          timestamp: string;
          note?: string;
        }>) || []),
        {
          status: "CONFIRMED",
          timestamp: now.toISOString(),
          note: "Balance payment received via Stripe - Booking fully paid",
        },
      ];
      break;

    case "FULL":
      statusUpdate.depositPaidAt = now;
      statusUpdate.balancePaidAt = now;
      statusUpdate.stripePaymentIntentId = paymentIntentId;
      statusUpdate.status = "CONFIRMED";
      statusUpdate.statusTimeline = [
        ...((booking.statusTimeline as Array<{
          status: string;
          timestamp: string;
          note?: string;
        }>) || []),
        {
          status: "CONFIRMED",
          timestamp: now.toISOString(),
          note: "Full payment received via Stripe - Booking confirmed",
        },
      ];
      break;
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: statusUpdate,
  });

  console.log(
    `Payment successful for booking ${bookingId}, type: ${paymentType}`
  );
}

async function handleFailedPayment(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  const paymentType = session.metadata?.paymentType;

  if (!bookingId) return;

  // Find and update the pending payment
  const pendingPayment = await prisma.payment.findFirst({
    where: {
      bookingId,
      paymentType: paymentType as "DEPOSIT" | "BALANCE" | "FULL",
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (pendingPayment) {
    await prisma.payment.update({
      where: { id: pendingPayment.id },
      data: {
        status: "FAILED",
        failureReason: "Checkout session expired or payment failed",
      },
    });
  }

  console.log(`Payment failed for booking ${bookingId}`);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Stripe webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid") {
          await handleSuccessfulPayment(session);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleFailedPayment(session);
        break;
      }

      case "payment_intent.succeeded": {
        // Already handled by checkout.session.completed
        console.log("PaymentIntent succeeded:", event.data.object.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);
        // Could update payment record with failure details
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Stripe requires the raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};
