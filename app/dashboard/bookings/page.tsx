"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDashboardTheme } from "../layout";

interface Booking {
  id: string;
  eventDate: string;
  eventLocation?: string;
  status: string;
  pricingTotal: number;
  depositAmount?: number;
  balanceAmount?: number;
  depositPaidAt?: string;
  balancePaidAt?: string;
  paymentMode?: string;
  guestsCount?: number;
  specialRequests?: string;
  createdAt: string;
  provider: {
    id: string;
    businessName: string;
    coverImage?: string;
    city?: string;
    phonePublic?: string;
  };
  quote?: {
    id: string;
    items: any[];
    totalPrice: number;
  };
}

export default function BookingsPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useDashboardTheme();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "50",
        ...(timeFilter === "upcoming" && { upcoming: "true" }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/bookings?${params}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, timeFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
      DEPOSIT_PAID: "bg-blue-100 text-blue-700",
      BALANCE_SCHEDULED: "bg-purple-100 text-purple-700",
      FULLY_PAID: "bg-green-100 text-green-700",
      CONFIRMED: "bg-green-100 text-green-700",
      COMPLETED: "bg-gray-100 text-gray-700",
      CANCELLED: "bg-red-100 text-red-700",
      REFUNDED: "bg-orange-100 text-orange-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const openDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  // Handle Stripe checkout for payments
  const handlePayment = async (
    bookingId: string,
    paymentType: "DEPOSIT" | "BALANCE" | "FULL"
  ) => {
    setPaymentLoading(bookingId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, paymentType }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create checkout session");
        return;
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(null);
    }
  };

  // Determine what payment action is needed for a booking
  const getPaymentAction = (booking: Booking) => {
    if (booking.status === "PENDING_PAYMENT") {
      if (booking.paymentMode === "DEPOSIT_BALANCE" && booking.depositAmount) {
        if (!booking.depositPaidAt) {
          return {
            type: "DEPOSIT" as const,
            amount: booking.depositAmount,
            label: "Pay Deposit",
          };
        }
      }
      if (booking.paymentMode === "FULL_PAYMENT") {
        return {
          type: "FULL" as const,
          amount: booking.pricingTotal,
          label: "Pay Full Amount",
        };
      }
    }
    if (
      booking.status === "DEPOSIT_PAID" &&
      booking.balanceAmount &&
      !booking.balancePaidAt
    ) {
      return {
        type: "BALANCE" as const,
        amount: booking.balanceAmount,
        label: "Pay Balance",
      };
    }
    return null;
  };

  const inputClass = `px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>My Bookings</h1>
        <p className={textSecondary}>View and manage your event bookings</p>
      </div>

      {/* Filters */}
      <div className={`${cardBg} ${cardBorder} border rounded-xl p-4`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === "upcoming"
                  ? "bg-rose-500 text-white"
                  : `${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTimeFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === "all"
                  ? "bg-rose-500 text-white"
                  : `${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`
              }`}
            >
              All Time
            </button>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={inputClass}
          >
            <option value="all">All Statuses</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="DEPOSIT_PAID">Deposit Paid</option>
            <option value="FULLY_PAID">Fully Paid</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div
          className={`${cardBg} ${cardBorder} border rounded-xl p-12 text-center`}
        >
          <svg
            className={`w-16 h-16 mx-auto ${textMuted}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className={`mt-4 text-lg font-medium ${textPrimary}`}>
            No bookings found
          </p>
          <p className={`mt-1 ${textMuted}`}>
            {timeFilter === "upcoming"
              ? "You don't have any upcoming bookings"
              : "You haven't made any bookings yet"}
          </p>
          <Link
            href="/vendors"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Find Vendors
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`${cardBg} ${cardBorder} border rounded-xl overflow-hidden`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Vendor Image */}
                <div
                  className={`w-full md:w-48 h-32 md:h-auto ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } shrink-0`}
                >
                  {booking.provider.coverImage ? (
                    <img
                      src={booking.provider.coverImage}
                      alt={booking.provider.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className={`w-12 h-12 ${textMuted}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <Link
                        href={`/vendors/${booking.provider.id}`}
                        className={`text-lg font-semibold ${textPrimary} hover:text-rose-500`}
                      >
                        {booking.provider.businessName}
                      </Link>
                      {booking.provider.city && (
                        <p
                          className={`text-sm ${textMuted} flex items-center gap-1`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {booking.provider.city}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className={`text-xs ${textMuted}`}>Event Date</p>
                      <p className={`font-medium ${textPrimary}`}>
                        {formatDate(booking.eventDate)}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${textMuted}`}>Total</p>
                      <p className={`font-medium ${textPrimary}`}>
                        {formatCurrency(booking.pricingTotal)}
                      </p>
                    </div>
                    {booking.guestsCount && (
                      <div>
                        <p className={`text-xs ${textMuted}`}>Guests</p>
                        <p className={`font-medium ${textPrimary}`}>
                          {booking.guestsCount}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className={`text-xs ${textMuted}`}>Booked</p>
                      <p className={`font-medium ${textPrimary}`}>
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => openDetails(booking)}
                      className={`px-4 py-2 text-sm rounded-lg ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-100 hover:bg-gray-200"
                      } ${textPrimary}`}
                    >
                      View Details
                    </button>
                    {/* Pay Now Button */}
                    {(() => {
                      const paymentAction = getPaymentAction(booking);
                      if (
                        paymentAction &&
                        booking.paymentMode !== "CASH_ON_DELIVERY"
                      ) {
                        return (
                          <button
                            onClick={() =>
                              handlePayment(booking.id, paymentAction.type)
                            }
                            disabled={paymentLoading === booking.id}
                            className="px-4 py-2 text-sm bg-[#635BFF] text-white rounded-lg hover:bg-[#5851ea] disabled:opacity-50 flex items-center gap-2"
                          >
                            {paymentLoading === booking.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                                </svg>
                                {paymentAction.label} (
                                {formatCurrency(paymentAction.amount)})
                              </>
                            )}
                          </button>
                        );
                      }
                      return null;
                    })()}
                    {booking.provider.phonePublic && (
                      <a
                        href={`tel:${booking.provider.phonePublic}`}
                        className="px-4 py-2 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                      >
                        Contact Vendor
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {detailsOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDetailsOpen(false)}
          />
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl ${cardBg} shadow-xl`}
          >
            <div
              className={`sticky top-0 flex items-center justify-between p-4 border-b ${cardBorder} ${cardBg}`}
            >
              <h2 className={`text-lg font-semibold ${textPrimary}`}>
                Booking Details
              </h2>
              <button
                onClick={() => setDetailsOpen(false)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${textSecondary}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Vendor Info */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } overflow-hidden`}
                >
                  {selectedBooking.provider.coverImage ? (
                    <img
                      src={selectedBooking.provider.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className={`w-8 h-8 ${textMuted}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold ${textPrimary}`}>
                    {selectedBooking.provider.businessName}
                  </h3>
                  {selectedBooking.provider.city && (
                    <p className={`text-sm ${textMuted}`}>
                      {selectedBooking.provider.city}
                    </p>
                  )}
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <h4 className={`font-medium ${textPrimary} mb-3`}>
                  Event Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-xs ${textMuted}`}>Event Date</p>
                    <p className={`font-medium ${textPrimary}`}>
                      {formatDate(selectedBooking.eventDate)}
                    </p>
                  </div>
                  {selectedBooking.eventLocation && (
                    <div>
                      <p className={`text-xs ${textMuted}`}>Location</p>
                      <p className={`font-medium ${textPrimary}`}>
                        {selectedBooking.eventLocation}
                      </p>
                    </div>
                  )}
                  {selectedBooking.guestsCount && (
                    <div>
                      <p className={`text-xs ${textMuted}`}>Number of Guests</p>
                      <p className={`font-medium ${textPrimary}`}>
                        {selectedBooking.guestsCount}
                      </p>
                    </div>
                  )}
                </div>
                {selectedBooking.specialRequests && (
                  <div className="mt-3">
                    <p className={`text-xs ${textMuted}`}>Special Requests</p>
                    <p className={`${textSecondary}`}>
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <h4 className={`font-medium ${textPrimary} mb-3`}>
                  Payment Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={textSecondary}>Total Amount</span>
                    <span className={`font-medium ${textPrimary}`}>
                      {formatCurrency(selectedBooking.pricingTotal)}
                    </span>
                  </div>
                  {selectedBooking.depositAmount && (
                    <div className="flex justify-between">
                      <span className={textSecondary}>Deposit</span>
                      <span className={`font-medium ${textPrimary}`}>
                        {formatCurrency(selectedBooking.depositAmount)}
                        {selectedBooking.depositPaidAt && (
                          <span className="ml-2 text-xs text-green-600">
                            ✓ Paid
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {selectedBooking.balanceAmount && (
                    <div className="flex justify-between">
                      <span className={textSecondary}>Balance Due</span>
                      <span className={`font-medium ${textPrimary}`}>
                        {formatCurrency(selectedBooking.balanceAmount)}
                        {selectedBooking.balancePaidAt && (
                          <span className="ml-2 text-xs text-green-600">
                            ✓ Paid
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pay Now Button in Modal */}
                {(() => {
                  const paymentAction = getPaymentAction(selectedBooking);
                  if (
                    paymentAction &&
                    selectedBooking.paymentMode !== "CASH_ON_DELIVERY"
                  ) {
                    return (
                      <button
                        onClick={() =>
                          handlePayment(selectedBooking.id, paymentAction.type)
                        }
                        disabled={paymentLoading === selectedBooking.id}
                        className="mt-4 w-full py-3 bg-[#635BFF] text-white rounded-lg hover:bg-[#5851ea] disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                      >
                        {paymentLoading === selectedBooking.id ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                            </svg>
                            {paymentAction.label} -{" "}
                            {formatCurrency(paymentAction.amount)}
                          </>
                        )}
                      </button>
                    );
                  }
                  if (selectedBooking.paymentMode === "CASH_ON_DELIVERY") {
                    return (
                      <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm">
                        💵 This booking is set for Cash on Delivery payment
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Quote Items */}
              {selectedBooking.quote?.items &&
                selectedBooking.quote.items.length > 0 && (
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h4 className={`font-medium ${textPrimary} mb-3`}>
                      Quote Breakdown
                    </h4>
                    <div className="space-y-2">
                      {(selectedBooking.quote.items as any[]).map(
                        (item, index) => (
                          <div key={index} className="flex justify-between">
                            <span className={textSecondary}>
                              {item.name} {item.qty > 1 && `(x${item.qty})`}
                            </span>
                            <span className={`font-medium ${textPrimary}`}>
                              {formatCurrency(item.totalPrice)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {selectedBooking.provider.phonePublic && (
                  <a
                    href={`tel:${selectedBooking.provider.phonePublic}`}
                    className="flex-1 sm:flex-none px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-center"
                  >
                    Call Vendor
                  </a>
                )}
                <Link
                  href={`/vendors/${selectedBooking.provider.id}`}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-center ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  } ${textPrimary}`}
                >
                  View Vendor
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
