"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Star,
  Loader2,
  CalendarDays,
  MapPin,
  Building2,
  Search,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDashboardTheme } from "../layout";
import { useSession } from "next-auth/react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { logger } from "@/lib/logger";

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
  hasReview?: boolean;
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
  const { data: session } = useSession();
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

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    body: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

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
      logger.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, timeFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      DEPOSIT_PAID:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      BALANCE_SCHEDULED:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      FULLY_PAID:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      CONFIRMED:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      COMPLETED:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      REFUNDED:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  const openDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  // Handle Stripe checkout for payments
  const handlePayment = async (
    bookingId: string,
    paymentType: "DEPOSIT" | "BALANCE" | "FULL",
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
      logger.error("Payment error:", error);
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

  // Open review modal
  const openReviewModal = (booking: Booking) => {
    setReviewBooking(booking);
    setReviewForm({ rating: 5, title: "", body: "" });
    setReviewError("");
    setReviewSuccess(false);
    setReviewModalOpen(true);
  };

  // Submit review
  const submitReview = async () => {
    if (!reviewBooking || !session?.user) return;

    if (reviewForm.body.length < 10) {
      setReviewError("Review must be at least 10 characters long");
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: reviewBooking.provider.id,
          rating: reviewForm.rating,
          title: reviewForm.title || undefined,
          body: reviewForm.body,
          authorName: session.user.name || "Anonymous",
          authorEmail: session.user.email || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setReviewSuccess(true);
      // Mark booking as having a review
      setBookings((prev) =>
        prev.map((b) =>
          b.id === reviewBooking.id ? { ...b, hasReview: true } : b,
        ),
      );

      // Close modal after 2 seconds
      setTimeout(() => {
        setReviewModalOpen(false);
        setReviewBooking(null);
      }, 2000);
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const inputClass = `px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
          My Bookings
        </h1>
        <p className={`text-sm sm:text-base ${textSecondary}`}>
          View and manage your event bookings
        </p>
      </div>

      {/* Filters */}
      <div className={`${cardBg} ${cardBorder} border rounded-xl p-3 sm:p-4`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter("upcoming")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                timeFilter === "upcoming"
                  ? "bg-accent text-white"
                  : `${
                      darkMode
                        ? "bg-white/5 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTimeFilter("all")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                timeFilter === "all"
                  ? "bg-accent text-white"
                  : `${
                      darkMode
                        ? "bg-white/5 text-gray-300"
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
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div
          className={`${cardBg} ${cardBorder} border rounded-xl p-12 text-center`}
        >
          <CalendarDays
            className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto ${textMuted}`}
            strokeWidth={1.5}
          />
          <p className={`mt-4 text-base sm:text-lg font-medium ${textPrimary}`}>
            No bookings found
          </p>
          <p className={`mt-1 text-sm ${textMuted}`}>
            {timeFilter === "upcoming"
              ? "You don't have any upcoming bookings"
              : "You haven't made any bookings yet"}
          </p>
          <Link
            href="/vendors"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 text-sm sm:text-base"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  className={`relative w-full md:w-48 h-32 md:h-auto ${
                    darkMode ? "bg-white/5" : "bg-gray-100"
                  } shrink-0`}
                >
                  {booking.provider.coverImage ? (
                    <Image
                      src={booking.provider.coverImage}
                      alt={booking.provider.businessName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${textMuted}`}
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <Link
                        href={`/vendors/${booking.provider.id}`}
                        className={`text-lg font-semibold ${textPrimary} hover:text-accent`}
                      >
                        {booking.provider.businessName}
                      </Link>
                      {booking.provider.city && (
                        <p
                          className={`text-sm ${textMuted} flex items-center gap-1`}
                        >
                          <MapPin className="w-4 h-4" />
                          {booking.provider.city}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(
                        booking.status,
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
                          ? "bg-white/5 hover:bg-white/10"
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
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${booking.provider.phonePublic}`}
                          className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90"
                        >
                          Contact Vendor
                        </a>
                        {(booking.status === "COMPLETED" ||
                          booking.status === "CONFIRMED") &&
                          !booking.hasReview && (
                            <button
                              aria-label="Write a review"
                              className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600 shadow transition-all flex items-center justify-center"
                              onClick={() => openReviewModal(booking)}
                            >
                              <Star className="w-5 h-5" />
                            </button>
                          )}
                      </div>
                    )}
                    {/* Review Modal with Framer Motion 3D Squeeze Animation */}
                    <AnimatePresence>
                      {reviewModalOpen && reviewBooking && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                          style={{ backdropFilter: "blur(2px)" }}
                        >
                          <motion.div
                            initial={{
                              scale: 0.2,
                              borderRadius: "50%",
                              y: 0,
                              boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                            }}
                            animate={{
                              scale: 1,
                              borderRadius: "1.5rem",
                              y: 0,
                              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
                            }}
                            exit={{
                              scale: 0.2,
                              borderRadius: "50%",
                              y: 0,
                              boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                            className={`${cardBg} rounded-3xl shadow-2xl w-full max-w-md p-5 sm:p-8 relative`}
                          >
                            <button
                              className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-lg transition-colors ${
                                darkMode
                                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => setReviewModalOpen(false)}
                              aria-label="Close"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <div className="flex flex-col items-center gap-2 mb-4">
                              <Star className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" />
                              <h2
                                className={`text-lg sm:text-xl font-bold ${textPrimary}`}
                              >
                                Write a Review
                              </h2>
                              <p
                                className={`text-sm ${textSecondary} text-center`}
                              >
                                Share your experience with{" "}
                                <span className="font-semibold">
                                  {reviewBooking.provider.businessName}
                                </span>
                              </p>
                            </div>
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                setSubmittingReview(true);
                                setReviewError("");
                                setReviewSuccess(false);
                                try {
                                  const res = await fetch("/api/reviews", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      bookingId: reviewBooking.id,
                                      providerId: reviewBooking.provider.id,
                                      rating: reviewForm.rating,
                                      title: reviewForm.title,
                                      body: reviewForm.body,
                                      authorName:
                                        session?.user?.name || "Anonymous",
                                      authorEmail: session?.user?.email || "",
                                    }),
                                  });
                                  if (!res.ok) {
                                    const data = await res.json();
                                    setReviewError(
                                      data.message || "Failed to submit review",
                                    );
                                  } else {
                                    setReviewSuccess(true);
                                    setTimeout(() => {
                                      setReviewModalOpen(false);
                                      fetchBookings();
                                    }, 1200);
                                  }
                                } catch (err) {
                                  setReviewError(
                                    "Network error. Please try again.",
                                  );
                                } finally {
                                  setSubmittingReview(false);
                                }
                              }}
                              className="space-y-4"
                            >
                              <div className="flex items-center gap-2 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      setReviewForm((f) => ({
                                        ...f,
                                        rating: star,
                                      }))
                                    }
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`w-7 h-7 ${
                                        reviewForm.rating >= star
                                          ? "text-amber-400"
                                          : "text-gray-300"
                                      }`}
                                      fill={
                                        reviewForm.rating >= star
                                          ? "#fbbf24"
                                          : "none"
                                      }
                                      strokeWidth={2}
                                    />
                                  </button>
                                ))}
                              </div>
                              <input
                                type="text"
                                className={`w-full px-3 sm:px-4 py-2 rounded-lg border ${inputBorder} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-amber-400`}
                                placeholder="Review title *"
                                value={reviewForm.title}
                                onChange={(e) =>
                                  setReviewForm((f) => ({
                                    ...f,
                                    title: e.target.value,
                                  }))
                                }
                                maxLength={80}
                              />
                              <textarea
                                className={`w-full px-3 sm:px-4 py-2 rounded-lg border ${inputBorder} ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-amber-400`}
                                placeholder="Write your review..."
                                value={reviewForm.body}
                                onChange={(e) =>
                                  setReviewForm((f) => ({
                                    ...f,
                                    body: e.target.value,
                                  }))
                                }
                                rows={4}
                                required
                                maxLength={600}
                              />
                              {reviewError && (
                                <div className="text-red-500 text-sm">
                                  {reviewError}
                                </div>
                              )}
                              {reviewSuccess && (
                                <div className="text-green-600 text-sm font-medium">
                                  Review submitted!
                                </div>
                              )}
                              <button
                                type="submit"
                                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                disabled={submittingReview}
                              >
                                {submittingReview && (
                                  <Loader2 size={16} className="animate-spin" />
                                )}
                                {submittingReview
                                  ? "Submitting..."
                                  : "Submit Review"}
                              </button>
                            </form>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {booking.status === "COMPLETED" && booking.hasReview && (
                      <span
                        className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg flex items-center gap-2 ${
                          darkMode ? "bg-white/5" : "bg-gray-100"
                        } ${textMuted}`}
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        Review Submitted
                      </span>
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
                  darkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                }`}
              >
                <X className={`w-5 h-5 ${textSecondary}`} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Vendor Info */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-100"
                  } overflow-hidden`}
                >
                  {selectedBooking.provider.coverImage ? (
                    <Image
                      src={selectedBooking.provider.coverImage}
                      alt=""
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2
                        className={`w-8 h-8 ${textMuted}`}
                        strokeWidth={1.5}
                      />
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
                      selectedBooking.status,
                    )}`}
                  >
                    {selectedBooking.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-[#141414]" : "bg-gray-50"
                }`}
              >
                <h4 className={`font-medium ${textPrimary} mb-3`}>
                  Event Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  darkMode ? "bg-[#141414]" : "bg-gray-50"
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
                      darkMode ? "bg-[#141414]" : "bg-gray-50"
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
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {selectedBooking.provider.phonePublic && (
                  <a
                    href={`tel:${selectedBooking.provider.phonePublic}`}
                    className="flex-1 sm:flex-none px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 text-center"
                  >
                    Call Vendor
                  </a>
                )}
                <Link
                  href={`/vendors/${selectedBooking.provider.id}`}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-center ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10"
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
