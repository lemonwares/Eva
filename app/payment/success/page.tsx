"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface BookingDetails {
  id: string;
  eventDate: string;
  provider: {
    businessName: string;
  };
  pricingTotal: number;
  paymentMode: string;
  status: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const sessionId = searchParams.get("session_id");

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookingDetails() {
      if (!bookingId) {
        setError("No booking ID provided");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        } else {
          setError("Could not load booking details");
        }
      } catch {
        setError("Failed to load booking");
      } finally {
        setLoading(false);
      }
    }

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully.
        </p>

        {booking && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">
              Booking Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Vendor</span>
                <span className="font-medium text-gray-900">
                  {booking.provider.businessName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Event Date</span>
                <span className="font-medium text-gray-900">
                  {formatDate(booking.eventDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(booking.pricingTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {booking.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard/bookings"
            className="block w-full py-3 px-4 bg-rose-500 text-white font-medium rounded-lg hover:bg-rose-600 transition-colors"
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
          A confirmation email will be sent to your registered email address.
        </p>

        {sessionId && (
          <p className="text-xs text-gray-400 mt-2">
            Transaction ID: {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
