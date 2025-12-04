"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MoreHorizontal,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  createdAt: string;
  validUntil: string;
  items: QuoteItem[];
  inquiry: {
    id: string;
    fromName: string;
    fromEmail: string;
    eventDate: string | null;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

function QuotesContent() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
    hoverBg,
  } = useVendorTheme();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchQuotes();
  }, [pagination.page, statusFilter]);

  async function fetchQuotes() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(`/api/quotes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching quotes:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredQuotes = quotes.filter((quote) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      quote.inquiry?.fromName?.toLowerCase().includes(query) ||
      quote.items?.some((item) => item.name.toLowerCase().includes(query))
    );
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500/20 text-green-600 border border-green-500/30";
      case "SENT":
        return "bg-blue-500/20 text-blue-600 border border-blue-500/30";
      case "DECLINED":
        return "bg-red-500/20 text-red-600 border border-red-500/30";
      case "VIEWED":
        return "bg-purple-500/20 text-purple-600 border border-purple-500/30";
      case "DRAFT":
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
      case "EXPIRED":
        return "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getServiceDescription = (items: QuoteItem[]) => {
    if (!items || items.length === 0) return "No items";
    if (items.length === 1) return items[0].name;
    return `${items[0].name} +${items.length - 1} more`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div
        className={`rounded-xl border p-4 sm:p-6 mb-6 ${cardBg} ${cardBorder}`}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`}
              size={18}
            />
            <input
              type="text"
              placeholder="Search by client or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${inputBg} ${inputBorder} ${textPrimary}`}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm ${inputBg} ${inputBorder} ${textPrimary}`}
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="VIEWED">Viewed</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="DECLINED">Declined</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {filteredQuotes.length === 0 ? (
        <div
          className={`rounded-xl border p-12 text-center ${cardBg} ${cardBorder}`}
        >
          <FileText size={48} className={`mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium mb-2 ${textPrimary}`}>
            No quotes found
          </h3>
          <p className={textMuted}>
            {searchQuery || statusFilter
              ? "Try adjusting your filters"
              : "You haven't created any quotes yet"}
          </p>
        </div>
      ) : (
        <>
          {/* Table - Desktop */}
          <div
            className={`hidden md:block rounded-xl border overflow-hidden ${cardBg} ${cardBorder}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`text-xs uppercase tracking-wider border-b ${textMuted} ${cardBorder}`}
                  >
                    <th className="text-left px-6 py-4 font-medium">Client</th>
                    <th className="text-left px-6 py-4 font-medium">Service</th>
                    <th className="text-left px-6 py-4 font-medium">Status</th>
                    <th className="text-left px-6 py-4 font-medium">
                      Date Sent
                    </th>
                    <th className="text-right px-6 py-4 font-medium">Amount</th>
                    <th className="text-right px-6 py-4 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className={`border-b transition-colors ${cardBorder} ${hoverBg}`}
                    >
                      <td className={`px-6 py-5 font-medium ${textPrimary}`}>
                        {quote.inquiry?.fromName || "Direct Quote"}
                      </td>
                      <td className={`px-6 py-5 ${textSecondary}`}>
                        {getServiceDescription(quote.items)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            quote.status
                          )}`}
                        >
                          {quote.status}
                        </span>
                      </td>
                      <td className={`px-6 py-5 ${textSecondary}`}>
                        {formatDate(quote.createdAt)}
                      </td>
                      <td
                        className={`px-6 py-5 text-right font-medium ${textPrimary}`}
                      >
                        £{quote.totalPrice?.toLocaleString() || "0"}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className={`p-2 rounded-lg ${hoverBg}`}>
                          <MoreHorizontal size={18} className={textSecondary} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className={`rounded-xl border p-4 ${cardBg} ${cardBorder}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`font-medium ${textPrimary}`}>
                      {quote.inquiry?.fromName || "Direct Quote"}
                    </p>
                    <p className={`text-sm ${textMuted}`}>
                      {getServiceDescription(quote.items)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      quote.status
                    )}`}
                  >
                    {quote.status}
                  </span>
                </div>
                <div
                  className={`flex justify-between items-center pt-3 border-t ${cardBorder}`}
                >
                  <span className={`text-sm ${textMuted}`}>
                    {formatDate(quote.createdAt)}
                  </span>
                  <span className={`font-bold ${textPrimary}`}>
                    £{quote.totalPrice?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <button
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.max(1, p.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className={`flex items-center gap-2 ${
                  pagination.page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : `${textMuted} hover:${textPrimary}`
                } transition-colors text-sm`}
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          setPagination((p) => ({ ...p, page: pageNum }))
                        }
                        className={`w-9 h-9 rounded-lg font-medium text-sm ${
                          pagination.page === pageNum
                            ? "bg-accent text-white"
                            : `${textMuted} ${hoverBg}`
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                {pagination.pages > 5 && (
                  <>
                    <span className={`px-2 ${textMuted}`}>...</span>
                    <button
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: pagination.pages }))
                      }
                      className={`w-9 h-9 rounded-lg ${textMuted} ${hoverBg} font-medium text-sm`}
                    >
                      {pagination.pages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.min(pagination.pages, p.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.pages}
                className={`flex items-center gap-2 ${
                  pagination.page === pagination.pages
                    ? "opacity-50 cursor-not-allowed"
                    : `${textMuted} hover:${textPrimary}`
                } transition-colors text-sm`}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function VendorQuotesPage() {
  return (
    <VendorLayout
      title="Quotes"
      actionButton={{ label: "Create New Quote", onClick: () => {} }}
    >
      <QuotesContent />
    </VendorLayout>
  );
}
