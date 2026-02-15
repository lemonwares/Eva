"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { logger } from "@/lib/logger";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  Filter,
  ChevronDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  Eye,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface QuoteItem {
  name: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

interface Quote {
  id: string;
  status: string;
  totalPrice: number;
  subtotal: number;
  tax: number;
  discount: number;
  validUntil: string;
  terms: string | null;
  notes: string | null;
  items: QuoteItem[];
  createdAt: string;
  provider: {
    id: string;
    businessName: string;
  };
  inquiry: {
    id: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusOptions = [
  "All",
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
];

export default function AdminQuotesPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useAdminTheme();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      if (statusFilter !== "All") {
        params.append("status", statusFilter);
      }

      const res = await fetch(`/api/quotes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || []);
        setPagination(data.pagination || null);
      }
    } catch (err) {
      logger.error("Error fetching quotes:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500";
      case "SENT":
        return "bg-blue-500";
      case "DRAFT":
        return "bg-gray-500";
      case "REJECTED":
        return "bg-red-500";
      case "EXPIRED":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AdminLayout
      title="Quotes Management"
      searchPlaceholder="Search by Quote ID, Client, Vendor..."
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium`}
          >
            <Filter size={16} />
            Status: {statusFilter}
            <ChevronDown size={16} />
          </button>
          {showStatusDropdown && (
            <div
              className={`absolute top-full left-0 mt-2 w-48 rounded-lg border ${cardBg} ${cardBorder} shadow-lg z-10`}
            >
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm ${
                    statusFilter === status
                      ? "bg-accent text-white"
                      : `${textPrimary} ${
                          darkMode ? "hover:bg-white/10" : "hover:bg-gray-50"
                        }`
                  } first:rounded-t-lg last:rounded-b-lg`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : quotes.length === 0 ? (
        <div
          className={`${cardBg} border ${cardBorder} rounded-xl p-12 text-center`}
        >
          <FileText className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            No quotes found
          </h3>
          <p className={textMuted}>
            {statusFilter !== "All"
              ? `No ${statusFilter.toLowerCase()} quotes available.`
              : "No quotes have been created yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Quotes Table */}
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Quote ID
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Client
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Vendor
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Total Amount
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Date Issued
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Valid Until
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Status
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-white/5" : "divide-gray-100"
                  }`}
                >
                  {quotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className={`${
                        darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        {quote.id.slice(0, 8)}...
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-medium ${textPrimary}`}
                      >
                        {quote.inquiry?.user?.name ||
                          quote.inquiry?.user?.email ||
                          "N/A"}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {quote.provider.businessName}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {formatCurrency(quote.totalPrice)}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        {formatDate(quote.createdAt)}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        {formatDate(quote.validUntil)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                            quote.status,
                          )}`}
                        >
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className={`p-2 rounded-lg ${
                            darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                          } transition-colors`}
                        >
                          <Eye size={16} className={textMuted} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <p className={`text-sm ${textMuted}`}>
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} results
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronLeft size={18} className={textMuted} />
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded flex items-center justify-center text-sm transition-colors ${
                        currentPage === page
                          ? "bg-accent text-white"
                          : `${textSecondary} ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            }`
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(pagination.pages, p + 1))
                    }
                    disabled={currentPage === pagination.pages}
                    className={`p-2 rounded ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronRight size={18} className={textMuted} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
          >
            <div
              className={`flex items-center justify-between p-6 border-b ${cardBorder}`}
            >
              <h3 className={`text-lg font-bold ${textPrimary}`}>
                Quote Details
              </h3>
              <button
                onClick={() => setSelectedQuote(null)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
              >
                <X size={20} className={textMuted} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Quote Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textMuted}`}>Quote ID</p>
                  <p className={`font-medium ${textPrimary}`}>
                    {selectedQuote.id}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Status</p>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                      selectedQuote.status,
                    )}`}
                  >
                    {selectedQuote.status}
                  </span>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Vendor</p>
                  <p className={`font-medium ${textPrimary}`}>
                    {selectedQuote.provider.businessName}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Client</p>
                  <p className={`font-medium ${textPrimary}`}>
                    {selectedQuote.inquiry?.user?.name ||
                      selectedQuote.inquiry?.user?.email ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Created</p>
                  <p className={textSecondary}>
                    {formatDate(selectedQuote.createdAt)}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Valid Until</p>
                  <p className={textSecondary}>
                    {formatDate(selectedQuote.validUntil)}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className={`font-medium ${textPrimary} mb-3`}>Items</h4>
                <div
                  className={`border ${cardBorder} rounded-lg overflow-x-auto`}
                >
                  <table className="w-full min-w-[400px]">
                    <thead>
                      <tr
                        className={`${darkMode ? "bg-white/5" : "bg-gray-50"}`}
                      >
                        <th
                          className={`text-left text-xs font-medium uppercase ${textMuted} px-4 py-2`}
                        >
                          Item
                        </th>
                        <th
                          className={`text-right text-xs font-medium uppercase ${textMuted} px-4 py-2`}
                        >
                          Qty
                        </th>
                        <th
                          className={`text-right text-xs font-medium uppercase ${textMuted} px-4 py-2`}
                        >
                          Unit Price
                        </th>
                        <th
                          className={`text-right text-xs font-medium uppercase ${textMuted} px-4 py-2`}
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuote.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className={`border-t ${
                            darkMode ? "border-white/5" : "border-gray-100"
                          }`}
                        >
                          <td className={`px-4 py-2 text-sm ${textPrimary}`}>
                            {item.name}
                          </td>
                          <td
                            className={`px-4 py-2 text-sm text-right ${textSecondary}`}
                          >
                            {item.qty}
                          </td>
                          <td
                            className={`px-4 py-2 text-sm text-right ${textSecondary}`}
                          >
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td
                            className={`px-4 py-2 text-sm text-right ${textPrimary}`}
                          >
                            {formatCurrency(item.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className={`border-t ${cardBorder} pt-4 space-y-2`}>
                <div className="flex justify-between">
                  <span className={textSecondary}>Subtotal</span>
                  <span className={textPrimary}>
                    {formatCurrency(selectedQuote.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={textSecondary}>Tax</span>
                  <span className={textPrimary}>
                    {formatCurrency(selectedQuote.tax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={textSecondary}>Discount</span>
                  <span className="text-green-500">
                    -{formatCurrency(selectedQuote.discount)}
                  </span>
                </div>
                <div
                  className={`flex justify-between pt-2 border-t ${cardBorder} font-bold`}
                >
                  <span className={textPrimary}>Total</span>
                  <span className="text-accent">
                    {formatCurrency(selectedQuote.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedQuote.notes && (
                <div>
                  <h4 className={`font-medium ${textPrimary} mb-2`}>Notes</h4>
                  <p className={`text-sm ${textSecondary}`}>
                    {selectedQuote.notes}
                  </p>
                </div>
              )}

              {/* Terms */}
              {selectedQuote.terms && (
                <div>
                  <h4 className={`font-medium ${textPrimary} mb-2`}>
                    Terms & Conditions
                  </h4>
                  <p className={`text-sm ${textSecondary}`}>
                    {selectedQuote.terms}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
