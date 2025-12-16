import Stripe from "stripe";

// Lazy-loaded Stripe instance to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-11-17.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Helper to format amount for Stripe (cents)
export function formatAmountForStripe(
  amount: number,
  currency: string = "GBP"
): number {
  const zeroDecimalCurrencies = ["JPY", "KRW", "VND"];
  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return Math.round(amount);
  }
  return Math.round(amount * 100);
}

// Helper to format amount from Stripe (cents to dollars)
export function formatAmountFromStripe(
  amount: number,
  currency: string = "GBP"
): number {
  const zeroDecimalCurrencies = ["JPY", "KRW", "VND"];
  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return amount;
  }
  return amount / 100;
}

// Payment mode types
export type PaymentMode =
  | "FULL_PAYMENT"
  | "DEPOSIT_BALANCE"
  | "CASH_ON_DELIVERY";

export interface CreateCheckoutParams {
  bookingId: string;
  amount: number;
  paymentType: "DEPOSIT" | "BALANCE" | "FULL";
  customerEmail: string;
  customerName: string;
  vendorName: string;
  eventDate: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}
