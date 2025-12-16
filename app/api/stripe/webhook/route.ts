import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe, formatAmountFromStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email";
import Stripe from "stripe";
import crypto from "crypto";

// Disable body parsing, need raw body for signature verification
export const runtime = "nodejs";

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  let bookingId = session.metadata?.bookingId;
  const paymentType = session.metadata?.paymentType as
    | "DEPOSIT"
    | "BALANCE"
    | "FULL";
  const paymentIntentId = session.payment_intent as string;

  let booking;

  // If bookingId is not present, create booking and BookingListing(s) from metadata
  if (!bookingId) {
    // Required metadata: providerId, eventDate, contactName, contactEmail, listings, clientUserId
    const providerId = session.metadata?.providerId;
    const eventDate = session.metadata?.eventDate;
    const contactName = session.metadata?.contactName;
    const contactEmail = session.metadata?.contactEmail;
    const contactPhone = session.metadata?.contactPhone || null;
    const message = session.metadata?.message || null;
    const eventLocation = session.metadata?.eventLocation || null;
    const guestsCountRaw = session.metadata?.guestsCount;
    const guestsCount =
      guestsCountRaw !== undefined &&
      guestsCountRaw !== null &&
      guestsCountRaw !== ""
        ? Number(guestsCountRaw)
        : null;
    const listingsRaw = session.metadata?.listings;
    const clientUserId = session.metadata?.clientUserId;
    let listingIds: string[] = [];
    try {
      listingIds = listingsRaw ? JSON.parse(listingsRaw) : [];
    } catch (e) {
      listingIds = [];
    }
    if (
      !providerId ||
      !eventDate ||
      !contactName ||
      !contactEmail ||
      !listingIds.length
    ) {
      console.error(
        "Missing required metadata for booking creation",
        session.id
      );
      return;
    }

    // Calculate total price from session.amount_total
    const pricingTotal = formatAmountFromStripe(session.amount_total || 0);

    // Create booking (no quote, paymentMode FULL_PAYMENT)
    booking = await prisma.booking.create({
      data: {
        id: crypto.randomUUID(),
        providerId,
        quoteId: crypto.randomUUID(), // Generate a unique quoteId for direct booking
        clientName: contactName,
        clientEmail: contactEmail,
        clientPhone: contactPhone,
        eventDate: new Date(eventDate),
        eventLocation: eventLocation ?? null,
        guestsCount: guestsCount ?? null,
        specialRequests: message ?? null,
        paymentMode: "FULL_PAYMENT",
        pricingTotal,
        depositAmount: 0,
        balanceAmount: 0,
        status: "CONFIRMED",
        completedAt: new Date(),
        depositPaidAt: new Date(),
        balancePaidAt: new Date(),
        statusTimeline: [
          {
            status: "CONFIRMED",
            timestamp: new Date().toISOString(),
            note: "Full payment received via Stripe - Booking confirmed",
          },
        ],
        stripePaymentIntentId: paymentIntentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: { provider: true },
    });
    bookingId = booking.id;

    // Create BookingListing join records
    for (const listingId of listingIds) {
      await prisma.bookingListing.create({
        data: {
          bookingId,
          listingId,
        },
      });
    }

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId,
        paymentType: "FULL",
        amount: pricingTotal,
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
  } else {
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
    booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true, provider: true },
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

  // Send booking confirmation emails to client and vendor
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        quote: {
          include: {
            inquiry: {
              select: {
                fromName: true,
              },
            },
          },
        },
        provider: {
          select: {
            id: true,
            businessName: true,
            ownerUserId: true,
            phonePublic: true,
            website: true,
          },
        },
      },
    });

    if (booking) {
      // Format event date
      const eventDate = new Date(booking.eventDate).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      const bookingUrl = `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/bookings/${booking.id}`;

      // Prepare booking confirmation data
      const bookingConfirmationData = {
        clientName: booking.clientName,
        vendorName: booking.provider.businessName,
        bookingId: booking.id,
        eventDate,
        eventType: booking.quote?.inquiry?.fromName || "Your Event",
        eventLocation: booking.eventLocation || "",
        guestsCount: booking.guestsCount || 0,
        totalAmount: booking.pricingTotal,
        paymentMode: booking.paymentMode,
        depositAmount: booking.depositAmount || 0,
        balanceAmount: booking.balanceAmount || 0,
        balanceDueDate: booking.balanceDueDate
          ? new Date(booking.balanceDueDate).toLocaleDateString()
          : undefined,
        bookingUrl,
        vendorEmail: "",
        vendorPhone: booking.provider.phonePublic || "",
        vendorWebsite: booking.provider.website || "",
      };

      // Get vendor owner email
      if (booking.provider.ownerUserId) {
        const vendorUser = await prisma.user.findUnique({
          where: { id: booking.provider.ownerUserId },
          select: { email: true },
        });
        if (vendorUser?.email) {
          bookingConfirmationData.vendorEmail = vendorUser.email;
        }
      }

      // Send email to client
      try {
        const clientTemplate = emailTemplates.bookingConfirmationClient(
          bookingConfirmationData
        );
        await sendEmail({
          to: booking.clientEmail,
          subject: clientTemplate.subject,
          html: clientTemplate.html,
          text: clientTemplate.text,
        });
        console.log(
          `✅ Booking confirmation email sent to client: ${booking.clientEmail}`
        );
      } catch (error) {
        console.error(
          "Failed to send client booking confirmation email:",
          error
        );
      }

      // Send email to vendor
      try {
        if (booking.provider.ownerUserId) {
          const vendorUser = await prisma.user.findUnique({
            where: { id: booking.provider.ownerUserId },
            select: { email: true },
          });

          if (vendorUser?.email) {
            const vendorTemplate = emailTemplates.bookingConfirmationVendor({
              ...bookingConfirmationData,
              vendorBusinessName: booking.provider.businessName,
              bookingUrl: `${
                process.env.NEXTAUTH_URL || "http://localhost:3000"
              }/vendor/bookings/${booking.id}`,
              vendorEmail: booking.clientEmail,
              vendorPhone: booking.clientPhone || "",
            });

            await sendEmail({
              to: vendorUser.email,
              subject: vendorTemplate.subject,
              html: vendorTemplate.html,
              text: vendorTemplate.text,
            });
            console.log(
              `✅ Booking confirmation email sent to vendor: ${vendorUser.email}`
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to send vendor booking confirmation email:",
          error
        );
      }
    }
  } catch (error) {
    console.error("Error sending booking confirmation emails:", error);
  }
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
      event = getStripe().webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
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
