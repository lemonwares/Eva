import { NextRequest, NextResponse } from "next/server";
import { getStripe, formatAmountForStripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { z } from "zod";

const initiateSchema = z.object({
  listings: z.array(
    z.object({
      id: z.string(),
      headline: z.string(),
      price: z.number(),
    })
  ),
  eventDate: z.string(),
  contactName: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  message: z.string().optional(),
  providerId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "You must be signed in as a client to book." },
        { status: 401 }
      );
    }
    const body = await request.json();
    const data = initiateSchema.parse(body);
    const stripe = getStripe();
    const total = data.listings.reduce((sum, l) => sum + l.price, 0);
    const lineItems = data.listings.map((l) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: l.headline },
        unit_amount: formatAmountForStripe(l.price, "GBP"),
      },
      quantity: 1,
    }));
    const sessionRes = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      customer_email: data.contactEmail,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel`,
      metadata: {
        providerId: data.providerId,
        eventDate: data.eventDate,
        contactName: data.contactName,
        contactPhone: data.contactPhone || "",
        message: data.message || "",
        listings: JSON.stringify(data.listings.map((l) => l.id)),
        clientUserId: session.user.id,
      },
    });
    return NextResponse.json({ url: sessionRes.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to initiate checkout" },
      { status: 400 }
    );
  }
}
