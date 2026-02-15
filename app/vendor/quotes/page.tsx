"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import VendorLayout from "@/components/vendor/VendorLayout";
// import { useVendorTheme } from "@/hooks/useVendorTheme";
// import Modal from "@/components/ui/Modal";
import {
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Send,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  Minus,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { Modal } from "@/components/ui";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { logger } from "@/lib/logger";

interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quote {
  id: string;
  inquiryId: string;
  inquiry: {
    id: string;
    fromName: string;
    fromEmail: string;
    fromPhone: string | null;
    eventDate: string | null;
    guestsCount: number | null;
    message: string;
    createdAt: string;
  } | null;
  items: QuoteItem[];
  total: number;
  validUntil: string;
  status:
    | "DRAFT"
    | "SENT"
    | "VIEWED"
    | "ACCEPTED"
    | "DECLINED"
    | "EXPIRED"
    | "REVISED";
  paymentMode: "FULL_PAYMENT" | "DEPOSIT_BALANCE" | "CASH_ON_DELIVERY";
  depositPercent: number | null;
  terms: string | null;
  notes: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const getStatusColor = (
  status: string,
  isDark: boolean,
): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    DRAFT: {
      bg: isDark ? "bg-gray-700/50" : "bg-gray-100",
      text: isDark ? "text-gray-300" : "text-gray-700",
    },
    SENT: {
      bg: isDark ? "bg-blue-900/30" : "bg-blue-100",
      text: isDark ? "text-blue-300" : "text-blue-700",
    },
    VIEWED: {
      bg: isDark ? "bg-purple-900/30" : "bg-purple-100",
      text: isDark ? "text-purple-300" : "text-purple-700",
    },
    ACCEPTED: {
      bg: isDark ? "bg-green-900/30" : "bg-green-100",
      text: isDark ? "text-green-300" : "text-green-700",
    },
    DECLINED: {
      bg: isDark ? "bg-red-900/30" : "bg-red-100",
      text: isDark ? "text-red-300" : "text-red-700",
    },
    EXPIRED: {
      bg: isDark ? "bg-orange-900/30" : "bg-orange-100",
      text: isDark ? "text-orange-300" : "text-orange-700",
    },
    REVISED: {
      bg: isDark ? "bg-yellow-900/30" : "bg-yellow-100",
      text: isDark ? "text-yellow-300" : "text-yellow-700",
    },
  };
  return colors[status] || colors.DRAFT;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DRAFT":
      return <FileText className="h-3 w-3" />;
    case "SENT":
      return <Send className="h-3 w-3" />;
    case "VIEWED":
      return <Eye className="h-3 w-3" />;
    case "ACCEPTED":
      return <CheckCircle className="h-3 w-3" />;
    case "DECLINED":
      return <XCircle className="h-3 w-3" />;
    case "EXPIRED":
      return <AlertCircle className="h-3 w-3" />;
    case "REVISED":
      return <RefreshCw className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};

const formatPaymentMode = (mode: string) => {
  switch (mode) {
    case "FULL_PAYMENT":
      return "Full Payment";
    case "DEPOSIT_BALANCE":
      return "Deposit + Balance";
    case "CASH_ON_DELIVERY":
      return "Cash on Delivery";
    default:
      return mode;
  }
};

export default function VendorQuotesPage() {
  const router = useRouter();
  const { darkMode: isDark } = useVendorTheme();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Edit form state
  const [editItems, setEditItems] = useState<QuoteItem[]>([]);
  const [editValidUntil, setEditValidUntil] = useState("");
  const [editPaymentMode, setEditPaymentMode] = useState("FULL_PAYMENT");
  const [editDepositPercent, setEditDepositPercent] = useState(0);
  const [editTerms, setEditTerms] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const response = await fetch(`/api/quotes?${params}`);
      if (!response.ok) throw new Error("Failed to fetch quotes");

      const data = await response.json();
      setQuotes(data.quotes || data);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      logger.error("Error fetching quotes:", error);
      showToast("Failed to load quotes", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleViewQuote = async (quote: Quote) => {
    try {
      // Fetch full quote details
      const response = await fetch(`/api/quotes/${quote.id}`);
      if (!response.ok) throw new Error("Failed to fetch quote details");
      const fullQuote = await response.json();
      setSelectedQuote(fullQuote);
      setIsViewModalOpen(true);
    } catch (error) {
      logger.error("Error fetching quote:", error);
      showToast("Failed to load quote details", "error");
    }
    setOpenMenuId(null);
  };

  const handleEditQuote = async (quote: Quote) => {
    try {
      const response = await fetch(`/api/quotes/${quote.id}`);
      if (!response.ok) throw new Error("Failed to fetch quote details");
      const fullQuote = await response.json();
      setSelectedQuote(fullQuote);
      setEditItems(
        fullQuote.items.map((item: QuoteItem) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
      );
      setEditValidUntil(fullQuote.validUntil.split("T")[0]);
      setEditPaymentMode(fullQuote.paymentMode);
      setEditDepositPercent(fullQuote.depositPercent || 0);
      setEditTerms(fullQuote.terms || "");
      setEditNotes(fullQuote.notes || "");
      setIsEditModalOpen(true);
    } catch (error) {
      logger.error("Error fetching quote:", error);
      showToast("Failed to load quote for editing", "error");
    }
    setOpenMenuId(null);
  };

  const handleSendQuote = async (quote: Quote) => {
    setSelectedQuote(quote);
    setIsSendModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmSendQuote = async () => {
    if (!selectedQuote) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/quotes/${selectedQuote.id}/send`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to send quote");

      showToast("Quote sent successfully!", "success");
      setIsSendModalOpen(false);
      setSelectedQuote(null);
      fetchQuotes();
    } catch (error) {
      logger.error("Error sending quote:", error);
      showToast("Failed to send quote", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuote = async () => {
    if (!selectedQuote) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/quotes/${selectedQuote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: editItems,
          validUntil: new Date(editValidUntil).toISOString(),
          paymentMode: editPaymentMode,
          depositPercent:
            editPaymentMode === "DEPOSIT_BALANCE" ? editDepositPercent : null,
          terms: editTerms || null,
          notes: editNotes || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update quote");

      showToast("Quote updated successfully!", "success");
      setIsEditModalOpen(false);
      setSelectedQuote(null);
      fetchQuotes();
    } catch (error) {
      logger.error("Error updating quote:", error);
      showToast("Failed to update quote", "error");
    } finally {
      setSaving(false);
    }
  };

  const addQuoteItem = () => {
    setEditItems([
      ...editItems,
      { description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeQuoteItem = (index: number) => {
    if (editItems.length > 1) {
      setEditItems(editItems.filter((_, i) => i !== index));
    }
  };

  const updateQuoteItem = (
    index: number,
    field: keyof QuoteItem,
    value: string | number,
  ) => {
    const updated = [...editItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }
    setEditItems(updated);
  };

  const calculateTotal = () => {
    return editItems.reduce((sum, item) => sum + item.total, 0);
  };

  const statuses = [
    "ALL",
    "DRAFT",
    "SENT",
    "VIEWED",
    "ACCEPTED",
    "DECLINED",
    "EXPIRED",
    "REVISED",
  ];

  return (
    <VendorLayout title="Quotes">
      <div className="space-y-6">
        {/* Toast */}
        {toast.show && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
              toast.type === "success"
                ? isDark
                  ? "bg-green-800 text-green-100"
                  : "bg-green-100 text-green-800"
                : isDark
                  ? "bg-red-800 text-red-100"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Quotes
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Manage and track your client quotes
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search by client name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } focus:ring-2 focus:ring-accent focus:border-transparent`}
            />
          </div>

          <div className="relative">
            <Filter
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`pl-10 pr-8 py-2 rounded-lg border appearance-none ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-accent focus:border-transparent`}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quotes Table */}
        <div
          className={`rounded-xl border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } overflow-hidden`}
        >
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
            </div>
          ) : quotes.length === 0 ? (
            <div className="p-8 text-center">
              <FileText
                className={`mx-auto h-12 w-12 ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <h3
                className={`mt-4 text-lg font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                No quotes found
              </h3>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Quotes you create from inquiries will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={
                      isDark
                        ? "bg-gray-700/50 border-b border-gray-700"
                        : "bg-gray-50 border-b border-gray-200"
                    }
                  >
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Client
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Event
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Total
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Valid Until
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Status
                    </th>
                    <th
                      className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {quotes.map((quote) => {
                    const statusStyle = getStatusColor(quote.status, isDark);
                    return (
                      <tr
                        key={quote.id}
                        className={`${
                          isDark ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {quote.inquiry?.fromName || "No client info"}
                            </p>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {quote.inquiry?.fromEmail || ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Event
                            </p>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {quote.inquiry?.eventDate
                                ? formatDate(quote.inquiry.eventDate)
                                : "Date not set"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p
                            className={`font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatCurrency(quote.total)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {formatDate(quote.validUntil)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            {getStatusIcon(quote.status)}
                            {quote.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === quote.id ? null : quote.id,
                                )
                              }
                              className={`p-2 rounded-lg ${
                                isDark
                                  ? "hover:bg-gray-700 text-gray-400"
                                  : "hover:bg-gray-100 text-gray-600"
                              }`}
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>

                            {openMenuId === quote.id && (
                              <div
                                className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg border z-10 ${
                                  isDark
                                    ? "bg-gray-800 border-gray-700"
                                    : "bg-white border-gray-200"
                                }`}
                              >
                                <button
                                  onClick={() => handleViewQuote(quote)}
                                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                                    isDark
                                      ? "hover:bg-gray-700 text-gray-300"
                                      : "hover:bg-gray-50 text-gray-700"
                                  }`}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </button>
                                {(quote.status === "DRAFT" ||
                                  quote.status === "REVISED") && (
                                  <>
                                    <button
                                      onClick={() => handleEditQuote(quote)}
                                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                                        isDark
                                          ? "hover:bg-gray-700 text-gray-300"
                                          : "hover:bg-gray-50 text-gray-700"
                                      }`}
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit Quote
                                    </button>
                                    <button
                                      onClick={() => handleSendQuote(quote)}
                                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                                        isDark
                                          ? "hover:bg-gray-700 text-blue-400"
                                          : "hover:bg-gray-50 text-blue-600"
                                      }`}
                                    >
                                      <Send className="h-4 w-4" />
                                      Send to Client
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Quote Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedQuote(null);
        }}
        title="Quote Details"
        size="xl"
      >
        {selectedQuote && (
          <div className="space-y-6">
            {/* Client Info */}
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <h4
                className={`font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Client Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Name
                  </p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>
                    {selectedQuote.inquiry?.fromName || "No client info"}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Email
                  </p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>
                    {selectedQuote.inquiry?.fromEmail || "-"}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Phone
                  </p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>
                    {selectedQuote.inquiry?.fromPhone || "-"}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Inquiry
                  </p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>
                    View inquiry details
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Event Date
                  </p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>
                    {selectedQuote.inquiry?.eventDate
                      ? formatDate(selectedQuote.inquiry.eventDate)
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Guest Count
                  </p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>
                    {selectedQuote.inquiry?.guestsCount || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quote Status & Dates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Status
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    getStatusColor(selectedQuote.status, isDark).bg
                  } ${getStatusColor(selectedQuote.status, isDark).text}`}
                >
                  {getStatusIcon(selectedQuote.status)}
                  {selectedQuote.status}
                </span>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Valid Until
                </p>
                <p className={isDark ? "text-white" : "text-gray-900"}>
                  {formatDate(selectedQuote.validUntil)}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Sent At
                </p>
                <p className={isDark ? "text-white" : "text-gray-900"}>
                  {selectedQuote.sentAt
                    ? formatDate(selectedQuote.sentAt)
                    : "Not sent"}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Viewed At
                </p>
                <p className={isDark ? "text-white" : "text-gray-900"}>
                  {selectedQuote.viewedAt
                    ? formatDate(selectedQuote.viewedAt)
                    : "Not viewed"}
                </p>
              </div>
            </div>

            {/* Quote Items */}
            <div>
              <h4
                className={`font-semibold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Quote Items
              </h4>
              <div
                className={`rounded-lg border overflow-hidden ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px]">
                    <thead>
                      <tr className={isDark ? "bg-gray-700/50" : "bg-gray-50"}>
                        <th
                          className={`px-4 py-2 text-left text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Description
                        </th>
                        <th
                          className={`px-4 py-2 text-right text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Qty
                        </th>
                        <th
                          className={`px-4 py-2 text-right text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Unit Price
                        </th>
                        <th
                          className={`px-4 py-2 text-right text-sm font-medium ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {selectedQuote.items?.map((item, index) => (
                        <tr key={index}>
                          <td
                            className={`px-4 py-3 ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.description}
                          </td>
                          <td
                            className={`px-4 py-3 text-right ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {item.quantity}
                          </td>
                          <td
                            className={`px-4 py-3 text-right ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr
                        className={
                          isDark
                            ? "bg-gray-700/50 border-t border-gray-600"
                            : "bg-gray-50 border-t border-gray-200"
                        }
                      >
                        <td
                          colSpan={3}
                          className={`px-4 py-3 text-right font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Grand Total
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-bold text-lg ${
                            isDark ? "text-accent" : "text-accent"
                          }`}
                        >
                          {formatCurrency(selectedQuote.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Payment Mode
                </p>
                <p className={isDark ? "text-white" : "text-gray-900"}>
                  {formatPaymentMode(selectedQuote.paymentMode)}
                </p>
              </div>
              {selectedQuote.paymentMode === "DEPOSIT_BALANCE" &&
                selectedQuote.depositPercent && (
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Deposit Amount
                    </p>
                    <p className={isDark ? "text-white" : "text-gray-900"}>
                      {selectedQuote.depositPercent}% (
                      {formatCurrency(
                        (selectedQuote.total * selectedQuote.depositPercent) /
                          100,
                      )}
                      )
                    </p>
                  </div>
                )}
            </div>

            {/* Terms & Notes */}
            {(selectedQuote.terms || selectedQuote.notes) && (
              <div className="space-y-4">
                {selectedQuote.terms && (
                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Terms & Conditions
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {selectedQuote.terms}
                    </p>
                  </div>
                )}
                {selectedQuote.notes && (
                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Notes
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {selectedQuote.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedQuote(null);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Close
              </button>
              {(selectedQuote.status === "DRAFT" ||
                selectedQuote.status === "REVISED") && (
                <>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleEditQuote(selectedQuote);
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      isDark
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    Edit Quote
                  </button>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleSendQuote(selectedQuote);
                    }}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
                  >
                    Send to Client
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Quote Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedQuote(null);
        }}
        title="Edit Quote"
        size="xl"
      >
        {selectedQuote && (
          <div className="space-y-6">
            {/* Quote Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Quote Items
                </h4>
                <button
                  onClick={addQuoteItem}
                  className="flex items-center gap-1 text-sm text-accent hover:text-accent/80"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>
              <div className="space-y-3">
                {editItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 items-start"
                  >
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) =>
                          updateQuoteItem(index, "description", e.target.value)
                        }
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                    <div className="w-full sm:w-20">
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuoteItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <input
                        type="number"
                        placeholder="Unit Price"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateQuoteItem(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                    <div className="w-full sm:w-32 flex items-center sm:justify-end">
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeQuoteItem(index)}
                      disabled={editItems.length === 1}
                      className={`p-2 rounded-lg ${
                        editItems.length === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      }`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <p
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Total: {formatCurrency(calculateTotal())}
                </p>
              </div>
            </div>

            {/* Validity */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Valid Until
              </label>
              <input
                type="date"
                value={editValidUntil}
                onChange={(e) => setEditValidUntil(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Payment Mode */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Payment Mode
              </label>
              <select
                value={editPaymentMode}
                onChange={(e) => setEditPaymentMode(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="FULL_PAYMENT">Full Payment</option>
                <option value="DEPOSIT_BALANCE">Deposit + Balance</option>
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              </select>
            </div>

            {/* Deposit Percent */}
            {editPaymentMode === "DEPOSIT_BALANCE" && (
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Deposit Percentage
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editDepositPercent}
                    onChange={(e) =>
                      setEditDepositPercent(parseInt(e.target.value) || 0)
                    }
                    className={`w-24 px-4 py-2 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    % ={" "}
                    {formatCurrency(
                      (calculateTotal() * editDepositPercent) / 100,
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Terms */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Terms & Conditions
              </label>
              <textarea
                value={editTerms}
                onChange={(e) => setEditTerms(e.target.value)}
                rows={3}
                placeholder="Enter terms and conditions..."
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Notes */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Additional Notes
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                placeholder="Enter any additional notes..."
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedQuote(null);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateQuote}
                disabled={saving}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Send Quote Confirmation Modal */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => {
          setIsSendModalOpen(false);
          setSelectedQuote(null);
        }}
        title="Send Quote"
        size="md"
      >
        {selectedQuote && (
          <div className="space-y-6">
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-blue-900/20" : "bg-blue-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <Send
                  className={`h-6 w-6 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Send this quote to the client?
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    The quote will be sent to{" "}
                    <strong>
                      {selectedQuote.inquiry?.fromEmail || "the client"}
                    </strong>
                    . Once sent, the quote status will change to "Sent".
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Quote Total
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {formatCurrency(selectedQuote.total)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Valid Until
                  </p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>
                    {formatDate(selectedQuote.validUntil)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsSendModalOpen(false);
                  setSelectedQuote(null);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmSendQuote}
                disabled={saving}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Quote
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </VendorLayout>
  );
}
