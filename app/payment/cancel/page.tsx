"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges have been made to your card.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">
            What happens now?
          </h2>
          <ul className="text-left text-gray-600 space-y-2">
            {[
              "Your booking is still pending payment",
              "You can try paying again from your bookings page",
              "Contact the vendor if you need assistance",
            ].map((text) => (
              <li key={text} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/dashboard/bookings"
            className="block w-full py-3 px-4 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            View My Bookings
          </Link>
          <Link
            href="/"
            className="block w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Need help?{" "}
          <Link href="/contact" className="text-accent hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
