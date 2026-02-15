"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Building2,
  Phone,
  Mail,
  Users,
  FileText,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useDashboardTheme } from "../../layout";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/formatters";
import { logger } from "@/lib/logger";

interface BookingDetail {
  id: string;
  eventDate: string;
  eventLocation?: string;
  status: string;
  pricingTotal: number;
  depositAmount?: number;
  balanceAmount?: number;
  depositPaidAt?: string;
  balancePaidAt?: string;
  balanceDueDate?: string;
  paymentMode?: string;
  guestsCount?: number;
  specialRequests?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  statusTimeline?: Array<{ status: string; timestamp: string; note?: string }>;
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
    inquiry?: {
      id: string;
      messages: any[];
    };
  };
}

interface TimelineEvent {
  type: string;
  date: string;
  description: string;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
  } = useDashboardTheme();

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const bookingId = params.id as string;

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true);
      const [bookingRes, timelineRes] = await Promise.all([
        fetch(`/api/bookings/${bookingId}`),
        fetch(`/api/bookings/${bookingId}/timeline`),
      ]);

      if (!bookingRes.ok) {
        const data = await bookingRes.json();
        setError(data.message || "Failed to load booking");
        return;
      }

      const bookingData = await bookingRes.json();
      setBooking(bookingData);

      if (timelineRes.ok) {
        const timelineData = await timelineRes.json();
        setTimeline(timelineData.timeline || []);
      }
    } catch (err) {
      logger.error("Error fetching booking:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) fetchBooking();
  }, [bookingId, fetchBooking]);

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { label: string; color: string; icon: typeof CheckCircle2 }
    > = {
      PENDING_PAYMENT: {
        label: "Pending Payment",
        color: darkMode
          ? "bg-yellow-900/30 text-yellow-400 border-yellow-800"
          : "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: Clock,
      },
      DEPOSIT_PAID: {
        label: "Deposit Paid",
        color: darkMode
          ? "bg-blue-900/30 text-blue-400 border-blue-800"
          : "bg-blue-50 text-blue-700 border-blue-200",
        icon: CreditCard,
      },
      BALANCE_SCHEDULED: {
        label: "Balance Scheduled",
        color: darkMode
          ? "bg-purple-900/30 text-purple-400 border-purple-800"
          : "bg-purple-50 text-purple-700 border-purple-200",
        icon: Clock,
      },
      FULLY_PAID: {
        label: "Fully Paid",
        color: darkMode
          ? "bg-green-900/30 text-green-400 border-green-800"
          : "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2,
      },
      CONFIRMED: {
        label: "Confirmed",
        color: darkMode
          ? "bg-green-900/30 text-green-400 border-green-800"
          : "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2,
      },
      COMPLETED: {
        label: "Completed",
        color: darkMode
          ? "bg-gray-800 text-gray-400 border-gray-700"
          : "bg-gray-100 text-gray-700 border-gray-200",
        icon: CheckCircle2,
      },
      CANCELLED: {
        label: "Cancelled",
        color: darkMode
          ? "bg-red-900/30 text-red-400 border-red-800"
          : "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
      },
      REFUNDED: {
        label: "Refunded",
        color: darkMode
          ? "bg-orange-900/30 text-orange-400 border-orange-800"
          : "bg-orange-50 text-orange-700 border-orange-200",
        icon: AlertCircle,
      },
    };
    return (
      configs[status] || {
        label: status,
        color: darkMode
          ? "bg-gray-800 text-gray-400 border-gray-700"
          : "bg-gray-100 text-gray-700 border-gray-200",
        icon: Clock,
      }
    );
  };

  const handlePayment = async (paymentType: "DEPOSIT" | "BALANCE" | "FULL") => {
    setPaymentLoading(true);
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
      if (data.url) window.location.href = data.url;
    } catch (err) {
      logger.error("Payment error:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      )
    )
      return;

    setCancelLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
      });
      if (response.ok) {
        fetchBooking();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      logger.error("Cancel error:", err);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const getPaymentAction = () => {
    if (!booking) return null;
    if (booking.status === "PENDING_PAYMENT") {
      if (
        booking.paymentMode === "DEPOSIT_BALANCE" &&
        booking.depositAmount &&
        !booking.depositPaidAt
      ) {
        return {
          type: "DEPOSIT" as const,
          amount: booking.depositAmount,
          label: "Pay Deposit",
        };
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
        label: "Pay Remaining Balance",
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-sm ${textSecondary} hover:${textPrimary} transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </button>
        <div
          className={`${cardBg} ${cardBorder} border rounded-xl p-12 text-center`}
        >
          <AlertCircle
            className={`w-14 h-14 mx-auto ${textMuted}`}
            strokeWidth={1.5}
          />
          <p className={`mt-4 text-lg font-medium ${textPrimary}`}>
            {error || "Booking not found"}
          </p>
          <Link
            href="/dashboard/bookings"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 text-sm"
          >
            View All Bookings
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;
  const paymentAction = getPaymentAction();
  const canCancel = ["PENDING_PAYMENT", "DEPOSIT_PAID", "CONFIRMED"].includes(
    booking.status,
  );
  const eventDate = new Date(booking.eventDate);
  const isUpcoming = eventDate > new Date();
  const isPast =
    eventDate < new Date() &&
    !["CANCELLED", "REFUNDED"].includes(booking.status);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back button + header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 text-sm ${textSecondary} hover:opacity-75 transition-opacity mb-2`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bookings
          </button>
          <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
            Booking Details
          </h1>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.color}`}
        >
          <StatusIcon className="w-4 h-4" />
          {statusConfig.label}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main content — left 2 cols */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Vendor card */}
          <div
            className={`${cardBg} ${cardBorder} border rounded-xl p-4 sm:p-5`}
          >
            <div className="flex gap-4 items-start">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                {booking.provider.coverImage ? (
                  <Image
                    src={booking.provider.coverImage}
                    alt={booking.provider.businessName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      darkMode ? "bg-white/10" : "bg-gray-100"
                    }`}
                  >
                    <Building2 className={`w-8 h-8 ${textMuted}`} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/vendors/${booking.provider.id}`}
                  className={`text-lg font-semibold ${textPrimary} hover:text-accent transition-colors flex items-center gap-1`}
                >
                  {booking.provider.businessName}
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </Link>
                {booking.provider.city && (
                  <p
                    className={`flex items-center gap-1 text-sm ${textSecondary} mt-1`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.provider.city}
                  </p>
                )}
                {booking.provider.phonePublic && (
                  <p
                    className={`flex items-center gap-1 text-sm ${textSecondary} mt-1`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {booking.provider.phonePublic}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Event details */}
          <div
            className={`${cardBg} ${cardBorder} border rounded-xl p-4 sm:p-5`}
          >
            <h2
              className={`text-base sm:text-lg font-semibold ${textPrimary} mb-4`}
            >
              Event Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs ${textMuted}`}>Event Date</p>
                  <p className={`font-medium ${textPrimary}`}>
                    {formatDate(booking.eventDate)}
                  </p>
                  {isUpcoming && (
                    <p className="text-xs text-accent mt-0.5">Upcoming</p>
                  )}
                </div>
              </div>

              {booking.eventLocation && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-xs ${textMuted}`}>Location</p>
                    <p className={`font-medium ${textPrimary}`}>
                      {booking.eventLocation}
                    </p>
                  </div>
                </div>
              )}

              {booking.guestsCount && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-xs ${textMuted}`}>Guests</p>
                    <p className={`font-medium ${textPrimary}`}>
                      {booking.guestsCount} guests
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs ${textMuted}`}>Booked On</p>
                  <p className={`font-medium ${textPrimary}`}>
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-xs ${textMuted}`}>Special Requests</p>
                    <p className={`text-sm ${textSecondary} mt-1`}>
                      {booking.specialRequests}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quote line items */}
          {booking.quote?.items && booking.quote.items.length > 0 && (
            <div
              className={`${cardBg} ${cardBorder} border rounded-xl p-4 sm:p-5`}
            >
              <h2
                className={`text-base sm:text-lg font-semibold ${textPrimary} mb-4`}
              >
                Services Booked
              </h2>
              <div className="space-y-3">
                {booking.quote.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between py-2 ${
                      idx < booking.quote!.items.length - 1
                        ? `border-b ${darkMode ? "border-white/5" : "border-gray-100"}`
                        : ""
                    }`}
                  >
                    <div>
                      <p className={`font-medium text-sm ${textPrimary}`}>
                        {item.description || item.name || `Item ${idx + 1}`}
                      </p>
                      {item.quantity && item.quantity > 1 && (
                        <p className={`text-xs ${textMuted}`}>
                          Qty: {item.quantity}
                        </p>
                      )}
                    </div>
                    <p className={`font-medium text-sm ${textPrimary}`}>
                      {formatCurrency(item.amount || item.price || 0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {timeline.length > 0 && (
            <div
              className={`${cardBg} ${cardBorder} border rounded-xl p-4 sm:p-5`}
            >
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className={`w-full flex items-center justify-between ${textPrimary}`}
              >
                <h2 className="text-base sm:text-lg font-semibold">
                  Booking Timeline
                </h2>
                {showTimeline ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {showTimeline && (
                <div className="mt-4 space-y-0">
                  {timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-accent shrink-0 mt-1" />
                        {idx < timeline.length - 1 && (
                          <div
                            className={`w-px flex-1 ${
                              darkMode ? "bg-white/10" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-medium ${textPrimary}`}>
                          {event.description}
                        </p>
                        <p className={`text-xs ${textMuted}`}>
                          {formatDateTime(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar — right col */}
        <div className="space-y-4 sm:space-y-6">
          {/* Payment summary */}
          <div
            className={`${cardBg} ${cardBorder} border rounded-xl p-4 sm:p-5`}
          >
            <h2
              className={`text-base sm:text-lg font-semibold ${textPrimary} mb-4`}
            >
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${textSecondary}`}>Total</span>
                <span className={`font-semibold ${textPrimary}`}>
                  {formatCurrency(booking.pricingTotal)}
                </span>
              </div>

              {booking.depositAmount != null && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textSecondary}`}>Deposit</span>
                  <div className="text-right">
                    <span className={`font-medium text-sm ${textPrimary}`}>
                      {formatCurrency(booking.depositAmount)}
                    </span>
                    {booking.depositPaidAt && (
                      <p className="text-xs text-green-500">
                        Paid {formatDate(booking.depositPaidAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {booking.balanceAmount != null && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textSecondary}`}>
                    Remaining Balance
                  </span>
                  <div className="text-right">
                    <span className={`font-medium text-sm ${textPrimary}`}>
                      {formatCurrency(booking.balanceAmount)}
                    </span>
                    {booking.balancePaidAt ? (
                      <p className="text-xs text-green-500">
                        Paid {formatDate(booking.balancePaidAt)}
                      </p>
                    ) : booking.balanceDueDate ? (
                      <p className={`text-xs ${textMuted}`}>
                        Due {formatDate(booking.balanceDueDate)}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}

              <div
                className={`pt-3 border-t ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${textSecondary}`}>
                    Payment Mode
                  </span>
                  <span className={`text-sm ${textPrimary}`}>
                    {booking.paymentMode === "DEPOSIT_BALANCE"
                      ? "Deposit + Balance"
                      : booking.paymentMode === "FULL_PAYMENT"
                        ? "Full Payment"
                        : booking.paymentMode || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment action */}
            {paymentAction && (
              <button
                onClick={() => handlePayment(paymentAction.type)}
                disabled={paymentLoading}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {paymentLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                {paymentAction.label} — {formatCurrency(paymentAction.amount)}
              </button>
            )}
          </div>

          {/* Contact info */}
          <div
            className={`${cardBg} ${cardBorder} border rounded-xl p-4 sm:p-5`}
          >
            <h2
              className={`text-base sm:text-lg font-semibold ${textPrimary} mb-4`}
            >
              Your Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className={`w-4 h-4 ${textMuted}`} />
                <span className={`text-sm ${textSecondary}`}>
                  {booking.clientEmail}
                </span>
              </div>
              {booking.clientPhone && (
                <div className="flex items-center gap-2">
                  <Phone className={`w-4 h-4 ${textMuted}`} />
                  <span className={`text-sm ${textSecondary}`}>
                    {booking.clientPhone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {/* Leave review — only for completed past events */}
            {isPast && booking.status === "COMPLETED" && (
              <Link
                href="/dashboard/bookings"
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border ${
                  darkMode
                    ? "border-white/10 text-white hover:bg-white/5"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                } transition-colors`}
              >
                <Star className="w-4 h-4" />
                Leave a Review
              </Link>
            )}

            {/* Cancel booking */}
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                {cancelLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Cancel Booking
              </button>
            )}

            {/* Message thread link (if inquiry exists) */}
            {booking.quote?.inquiry?.id && (
              <Link
                href={`/dashboard/inquiries`}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border ${
                  darkMode
                    ? "border-white/10 text-white hover:bg-white/5"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                } transition-colors`}
              >
                <Mail className="w-4 h-4" />
                View Messages
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
