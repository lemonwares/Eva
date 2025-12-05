"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDashboardTheme } from "../layout";

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quote {
  id: string;
  status: string;
  totalAmount: number;
  validUntil: string;
  description?: string;
  items: QuoteItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  inquiry: {
    id: string;
    eventDate?: string;
    guestsCount?: number;
  };
  provider: {
    id: string;
    businessName: string;
    coverImage?: string;
    city?: string;
  };
}

export default function QuotesPage() {
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

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "50",
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/quotes?${params}`);
      const data = await response.json();
      setQuotes(data.quotes || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleAction = async (action: "accept" | "decline") => {
    if (!selectedQuote) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/quotes/${selectedQuote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "accept" ? "ACCEPTED" : "DECLINED",
        }),
      });

      if (response.ok) {
        fetchQuotes();
        setShowModal(false);
        setSelectedQuote(null);
      }
    } catch (error) {
      console.error(`Error ${action}ing quote:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-700",
      SENT: "bg-blue-100 text-blue-700",
      VIEWED: "bg-purple-100 text-purple-700",
      ACCEPTED: "bg-green-100 text-green-700",
      DECLINED: "bg-red-100 text-red-700",
      EXPIRED: "bg-amber-100 text-amber-700",
      REVISED: "bg-indigo-100 text-indigo-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
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

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const canRespond = (quote: Quote) => {
    return (
      ["SENT", "VIEWED"].includes(quote.status) && !isExpired(quote.validUntil)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>My Quotes</h1>
        <p className={textSecondary}>Price quotes received from vendors</p>
      </div>

      {/* Filters */}
      <div className={`${cardBg} ${cardBorder} border rounded-xl p-4`}>
        <div className="flex flex-wrap gap-2">
          {["all", "SENT", "VIEWED", "ACCEPTED", "DECLINED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-rose-500 text-white"
                  : `${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full"></div>
        </div>
      ) : quotes.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className={`mt-4 text-lg font-medium ${textPrimary}`}>
            No quotes yet
          </p>
          <p className={`mt-1 ${textMuted}`}>
            Quotes from vendors will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className={`${cardBg} ${cardBorder} border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => {
                setSelectedQuote(quote);
                setShowModal(true);
              }}
            >
              {/* Header */}
              <div className="p-4 flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } shrink-0 overflow-hidden`}
                >
                  {quote.provider.coverImage ? (
                    <img
                      src={quote.provider.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className={`font-medium ${textMuted}`}>
                        {quote.provider.businessName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${textPrimary}`}>
                    {quote.provider.businessName}
                  </p>
                  {quote.provider.city && (
                    <p className={`text-sm ${textMuted}`}>
                      {quote.provider.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div
                className={`px-4 py-3 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {formatCurrency(quote.totalAmount)}
                </p>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textMuted}`}>Status</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                      quote.status
                    )}`}
                  >
                    {quote.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textMuted}`}>Received</span>
                  <span className={`text-sm ${textSecondary}`}>
                    {formatDate(quote.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textMuted}`}>Valid Until</span>
                  <span
                    className={`text-sm ${
                      isExpired(quote.validUntil)
                        ? "text-red-500"
                        : textSecondary
                    }`}
                  >
                    {formatDate(quote.validUntil)}
                    {isExpired(quote.validUntil) && " (Expired)"}
                  </span>
                </div>
                {quote.inquiry.eventDate && (
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${textMuted}`}>Event Date</span>
                    <span className={`text-sm ${textSecondary}`}>
                      {formatDate(quote.inquiry.eventDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action */}
              {canRespond(quote) && (
                <div className={`p-4 border-t ${cardBorder} bg-amber-50`}>
                  <p className="text-sm text-amber-700 font-medium">
                    ⏰ Awaiting your response
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quote Detail Modal */}
      {showModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${cardBg} rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            <div
              className={`p-6 border-b ${cardBorder} flex items-start justify-between`}
            >
              <div>
                <h2 className={`text-xl font-bold ${textPrimary}`}>
                  Quote Details
                </h2>
                <p className={`mt-1 ${textMuted}`}>
                  From {selectedQuote.provider.businessName}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedQuote(null);
                }}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${textMuted}`}
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

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status & Validity */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className={textMuted}>Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      selectedQuote.status
                    )}`}
                  >
                    {selectedQuote.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={textMuted}>Valid Until:</span>
                  <span
                    className={
                      isExpired(selectedQuote.validUntil)
                        ? "text-red-500"
                        : textPrimary
                    }
                  >
                    {formatDate(selectedQuote.validUntil)}
                  </span>
                </div>
              </div>

              {/* Vendor Info */}
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-200"
                    } overflow-hidden`}
                  >
                    {selectedQuote.provider.coverImage ? (
                      <img
                        src={selectedQuote.provider.coverImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className={`text-xl font-medium ${textMuted}`}>
                          {selectedQuote.provider.businessName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/vendors/${selectedQuote.provider.id}`}
                      className={`font-semibold ${textPrimary} hover:text-rose-500`}
                    >
                      {selectedQuote.provider.businessName}
                    </Link>
                    {selectedQuote.provider.city && (
                      <p className={`text-sm ${textMuted}`}>
                        {selectedQuote.provider.city}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedQuote.description && (
                <div>
                  <h3 className={`font-medium ${textPrimary} mb-2`}>
                    Description
                  </h3>
                  <p className={textSecondary}>{selectedQuote.description}</p>
                </div>
              )}

              {/* Items */}
              {selectedQuote.items && selectedQuote.items.length > 0 && (
                <div>
                  <h3 className={`font-medium ${textPrimary} mb-3`}>
                    Quote Items
                  </h3>
                  <div
                    className={`border ${cardBorder} rounded-lg overflow-hidden`}
                  >
                    <table className="w-full">
                      <thead
                        className={darkMode ? "bg-gray-800" : "bg-gray-50"}
                      >
                        <tr>
                          <th
                            className={`px-4 py-2 text-left text-sm ${textMuted}`}
                          >
                            Description
                          </th>
                          <th
                            className={`px-4 py-2 text-right text-sm ${textMuted}`}
                          >
                            Qty
                          </th>
                          <th
                            className={`px-4 py-2 text-right text-sm ${textMuted}`}
                          >
                            Price
                          </th>
                          <th
                            className={`px-4 py-2 text-right text-sm ${textMuted}`}
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-inherit">
                        {selectedQuote.items.map((item, index) => (
                          <tr key={index}>
                            <td className={`px-4 py-3 ${textPrimary}`}>
                              {item.description}
                            </td>
                            <td
                              className={`px-4 py-3 text-right ${textSecondary}`}
                            >
                              {item.quantity}
                            </td>
                            <td
                              className={`px-4 py-3 text-right ${textSecondary}`}
                            >
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td
                              className={`px-4 py-3 text-right font-medium ${textPrimary}`}
                            >
                              {formatCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot
                        className={darkMode ? "bg-gray-800" : "bg-gray-50"}
                      >
                        <tr>
                          <td
                            colSpan={3}
                            className={`px-4 py-3 text-right font-semibold ${textPrimary}`}
                          >
                            Total
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-bold text-lg ${textPrimary}`}
                          >
                            {formatCurrency(selectedQuote.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedQuote.notes && (
                <div>
                  <h3 className={`font-medium ${textPrimary} mb-2`}>Notes</h3>
                  <p className={`text-sm ${textSecondary}`}>
                    {selectedQuote.notes}
                  </p>
                </div>
              )}

              {/* Event Info */}
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <h3 className={`font-medium ${textPrimary} mb-2`}>
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedQuote.inquiry.eventDate && (
                    <div>
                      <span className={`text-sm ${textMuted}`}>Event Date</span>
                      <p className={textPrimary}>
                        {formatDate(selectedQuote.inquiry.eventDate)}
                      </p>
                    </div>
                  )}
                  {selectedQuote.inquiry.guestsCount && (
                    <div>
                      <span className={`text-sm ${textMuted}`}>Guests</span>
                      <p className={textPrimary}>
                        {selectedQuote.inquiry.guestsCount}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {canRespond(selectedQuote) && (
              <div className={`p-6 border-t ${cardBorder} flex gap-3`}>
                <button
                  onClick={() => handleAction("decline")}
                  disabled={actionLoading}
                  className={`flex-1 py-3 px-4 rounded-lg border ${cardBorder} ${textPrimary} font-medium hover:bg-gray-100 disabled:opacity-50`}
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAction("accept")}
                  disabled={actionLoading}
                  className="flex-1 py-3 px-4 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    "Accept Quote"
                  )}
                </button>
              </div>
            )}

            {selectedQuote.status === "ACCEPTED" && (
              <div className={`p-6 border-t ${cardBorder}`}>
                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Quote Accepted</p>
                    <p className="text-sm">
                      The vendor will reach out to finalize your booking.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedQuote.status === "DECLINED" && (
              <div className={`p-6 border-t ${cardBorder}`}>
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">Quote Declined</p>
                    <p className="text-sm">
                      You declined this quote on{" "}
                      {formatDate(selectedQuote.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
