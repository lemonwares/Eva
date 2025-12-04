"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import {
  Search,
  ChevronDown,
  Mail,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

const statusFilters = ["All", "NEW", "VIEWED", "REPLIED", "ARCHIVED"];

interface Inquiry {
  id: string;
  fromName: string;
  fromEmail: string;
  fromPhone: string | null;
  eventDate: string | null;
  guestsCount: number | null;
  budgetRange: string | null;
  message: string;
  status: string;
  createdAt: string;
  provider: {
    id: string;
    businessName: string;
  };
}

function InquiriesContent() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useVendorTheme();

  useEffect(() => {
    fetchInquiries();
  }, [activeFilter]);

  async function fetchInquiries() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (activeFilter !== "All") {
        params.append("status", activeFilter);
      }
      const response = await fetch(`/api/inquiries?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch inquiries");
      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateInquiryStatus(inquiryId: string, status: string) {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchInquiries();
      }
    } catch (err) {
      console.error("Error updating inquiry:", err);
    }
  }

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getInitialsColor = (name: string) => {
    const colors = [
      "from-orange-400 to-pink-500",
      "from-blue-400 to-blue-600",
      "from-green-400 to-teal-500",
      "from-purple-400 to-purple-600",
      "from-yellow-400 to-orange-500",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return past.toLocaleDateString();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "NEW":
        return "text-accent";
      case "VIEWED":
        return `${
          darkMode
            ? "text-yellow-400 bg-yellow-500/20"
            : "text-yellow-600 bg-yellow-100"
        } px-3 py-1 rounded-full text-xs`;
      case "REPLIED":
        return `${
          darkMode
            ? "text-green-400 bg-green-500/20"
            : "text-green-600 bg-green-100"
        } px-3 py-1 rounded-full text-xs`;
      case "ARCHIVED":
        return `${
          darkMode ? "text-gray-500 bg-white/10" : "text-gray-600 bg-gray-100"
        } px-3 py-1 rounded-full text-xs`;
      default:
        return textSecondary;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Filter Sidebar Overlay - Mobile */}
      {filterSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setFilterSidebarOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-48 shrink-0 ${
          darkMode ? "bg-[#0f0f0f]" : "bg-white"
        } lg:bg-transparent p-4 sm:p-6 lg:p-0 transform transition-transform duration-300 lg:transform-none ${
          filterSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <h3 className={`font-bold text-sm mb-4 ${textPrimary}`}>
          Filter Inquiries
        </h3>

        {/* Status Filter */}
        <div className="mb-5">
          <p className={`text-sm mb-2 ${textMuted}`}>Status</p>
          <div className="flex flex-wrap gap-1.5">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : `${textSecondary} ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      }`
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-5">
          <p className={`text-sm mb-2 ${textMuted}`}>Date Range</p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Start date"
              className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 ${inputBg} ${inputBorder} ${textPrimary}`}
            />
            <input
              type="text"
              placeholder="End date"
              className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 ${inputBg} ${inputBorder} ${textPrimary}`}
            />
          </div>
        </div>

        {/* Event Type */}
        <div>
          <p className={`text-sm mb-2 ${textMuted}`}>Event Type</p>
          <button
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${inputBg} ${inputBorder} ${textPrimary}`}
          >
            <span>All types</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-4 mb-6 lg:hidden">
          <button
            onClick={() => setFilterSidebarOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm ${inputBg} ${inputBorder} ${textPrimary}`}
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`}
            size={18}
          />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${cardBg} ${cardBorder} ${textPrimary}`}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        )}

        {/* Inquiries List */}
        {!isLoading && filteredInquiries.length > 0 && (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`rounded-xl border p-4 sm:p-6 ${cardBg} ${cardBorder}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br ${getInitialsColor(
                        inquiry.fromName
                      )} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {getInitials(inquiry.fromName)}
                    </div>
                    <div>
                      <p className={`font-medium ${textPrimary}`}>
                        {inquiry.fromName}
                      </p>
                      <p className={`text-xs sm:text-sm ${textMuted}`}>
                        Received: {formatTimeAgo(inquiry.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={getStatusStyle(inquiry.status)}>
                    {inquiry.status}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {inquiry.eventDate && (
                      <span className={`text-sm ${textMuted}`}>
                        📅 {new Date(inquiry.eventDate).toLocaleDateString()}
                      </span>
                    )}
                    {inquiry.guestsCount && (
                      <span className={`text-sm ${textMuted}`}>
                        👥 {inquiry.guestsCount} guests
                      </span>
                    )}
                    {inquiry.budgetRange && (
                      <span className={`text-sm ${textMuted}`}>
                        💰 {inquiry.budgetRange}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>
                    {inquiry.message}
                  </p>
                  <p className={`text-xs mt-2 ${textMuted}`}>
                    📧 {inquiry.fromEmail}{" "}
                    {inquiry.fromPhone && `• 📞 ${inquiry.fromPhone}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => updateInquiryStatus(inquiry.id, "REPLIED")}
                    className="flex-1 bg-accent text-white font-semibold py-3 rounded-lg hover:bg-accent/90 transition-colors text-sm"
                  >
                    View & Reply
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(inquiry.id, "ARCHIVED")}
                    className={`flex-1 font-semibold py-3 rounded-lg border transition-colors text-sm ${
                      darkMode
                        ? "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredInquiries.length === 0 && (
          <div
            className={`rounded-xl border border-dashed p-8 sm:p-12 mt-6 text-center ${cardBg} ${cardBorder}`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                darkMode ? "bg-white/5" : "bg-gray-100"
              }`}
            >
              <Mail size={28} className={textMuted} />
            </div>
            <h3 className={`font-bold mb-2 ${textPrimary}`}>
              No inquiries found
            </h3>
            <p className={`text-sm ${textMuted}`}>
              {searchQuery
                ? "Try adjusting your search or filters."
                : "When customers contact you, their inquiries will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VendorInquiriesPage() {
  return (
    <VendorLayout
      title="Inquiries"
      actionButton={{ label: "Export", onClick: () => {} }}
    >
      <InquiriesContent />
    </VendorLayout>
  );
}
