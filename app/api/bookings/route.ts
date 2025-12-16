import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getStripe, formatAmountForStripe } from "@/lib/stripe";

// GET /api/bookings - List bookings (for authenticated vendor, client, or admin)
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
    const upcoming = searchParams.get("upcoming");
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
          bookings: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }
      filters.providerId = provider.id;
    } else if (session.user.role === "ADMINISTRATOR") {
      if (providerId) filters.providerId = providerId;
    } else if (session.user.role === "CLIENT") {
      // Clients can see their own bookings (by email)
      filters.clientEmail = session.user.email;
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (status) {
      filters.status = status;
    }

    // Filter for upcoming events
    if (upcoming === "true") {
      filters.eventDate = { gte: new Date() };
    }

    const orderBy: any[] = [{ eventDate: "asc" }];

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
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
              phonePublic: true,
            },
          },
          quote: {
            select: {
              id: true,
              items: true,
              totalPrice: true,
              inquiry: {
                select: {
                  fromName: true,
                  fromEmail: true,
                },
              },
            },
          },
        },
        orderBy,
      }),
      prisma.booking.count({ where: filters }),
    ]);

    // For clients, check if they have reviewed each booking's provider
    let bookingsWithReviewStatus = bookings;
    if (session.user.role === "CLIENT" && session.user.id) {
      // Get all reviews by this user for the providers in this booking list
      const providerIds = bookings.map((b) => b.providerId);
      const userReviews = await prisma.review.findMany({
        where: {
          authorUserId: session.user.id,
          providerId: { in: providerIds },
        },
        select: { providerId: true },
      });

      const reviewedProviderIds = new Set(userReviews.map((r) => r.providerId));

      bookingsWithReviewStatus = bookings.map((booking) => ({
        ...booking,
        hasReview: reviewedProviderIds.has(booking.providerId),
      }));
    }

    return NextResponse.json({
      bookings: bookingsWithReviewStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking (direct from vendor page)

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      providerId,
      services, // Array of { id, headline, minPrice, maxPrice }
      clientName,
      clientEmail,
      clientPhone,
      eventDate,
      eventLocation,
      guestsCount,
      specialRequests,
      paymentMode,
      pricingTotal,
    } = body;

    if (!providerId || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a quote for the booking (optional, for tracking)
    const quote = await prisma.quote.create({
      data: {
        providerId,
        items: services.map((s: any) => ({
          name: s.headline,
          qty: 1,
          unitPrice: s.minPrice || 0,
          totalPrice: s.minPrice || 0,
        })),
        subtotal: services.reduce(
          (sum: number, s: any) => sum + (s.minPrice || 0),
          0
        ),
        tax: 0,
        discount: 0,
        totalPrice: services.reduce(
          (sum: number, s: any) => sum + (s.minPrice || 0),
          0
        ),
        allowedPaymentModes: [paymentMode || "FULL_PAYMENT"],
        depositPercentage: 0,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        status: "SENT",
      },
    });

    // Create the booking (status: PENDING_PAYMENT)
    const booking = await prisma.booking.create({
      data: {
        quoteId: quote.id,
        providerId,
        clientName,
        clientEmail,
        clientPhone,
        eventDate: new Date(eventDate),
        eventLocation,
        guestsCount: guestsCount ? Number(guestsCount) : null,
        specialRequests,
        paymentMode: paymentMode || "FULL_PAYMENT",
        pricingTotal: pricingTotal || quote.totalPrice,
        status: "PENDING_PAYMENT",
        statusTimeline: [
          { status: "PENDING_PAYMENT", timestamp: new Date().toISOString() },
        ],
      },
    });

    // Stripe payment session
    const stripe = getStripe();
    const lineItems = services.map((s: any) => ({
      price_data: {
        currency: "GBP",
        product_data: {
          name: s.headline,
        },
        unit_amount: formatAmountForStripe(s.minPrice || 0, "GBP"),
      },
      quantity: 1,
    }));

    const successUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/vendors/${providerId}?booking=success`;
    const cancelUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/vendors/${providerId}?booking=cancel`;

    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      customer_email: clientEmail,
      client_reference_id: booking.id,
      metadata: {
        bookingId: booking.id,
        providerId,
        quoteId: quote.id,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({
      message: "Booking created, payment required",
      booking,
      paymentUrl: sessionStripe.url,
    });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
