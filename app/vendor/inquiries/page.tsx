"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import { Search, ChevronDown, Mail, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const statusFilters = ["All", "New", "Replied", "Archived"];

const inquiries = [
  {
    id: 1,
    initials: "AC",
    initialsColor: "from-orange-400 to-pink-500",
    name: "Amelia Chen",
    receivedTime: "2 hours ago",
    status: "New",
    title: "Wedding Photography",
    date: "October 26, 2024",
    message:
      "Hi, we love your portfolio and were wondering about your availability for our wedding...",
  },
  {
    id: 2,
    initials: "LS",
    initialsColor: "from-blue-400 to-blue-600",
    name: "Liam Smith",
    receivedTime: "1 day ago",
    status: "Replied",
    title: "Corporate Headshots",
    date: "September 15, 2024",
    message:
      "Following up on our conversation, please find the attached mood board for the project...",
  },
  {
    id: 3,
    initials: "JD",
    initialsColor: "from-green-400 to-teal-500",
    name: "Jane Doe",
    receivedTime: "3 days ago",
    status: "New",
    title: "Birthday Party Coverage",
    date: "November 10, 2024",
    message:
      "We are planning a surprise birthday party and would love to have professional photos...",
  },
];

function InquiriesContent() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "New":
        return "text-accent";
      case "Replied":
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
            className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${cardBg} ${cardBorder} ${textPrimary}`}
          />
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`rounded-xl border p-4 sm:p-6 ${cardBg} ${cardBorder}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br ${inquiry.initialsColor} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {inquiry.initials}
                  </div>
                  <div>
                    <p className={`font-medium ${textPrimary}`}>
                      {inquiry.name}
                    </p>
                    <p className={`text-xs sm:text-sm ${textMuted}`}>
                      Received: {inquiry.receivedTime}
                    </p>
                  </div>
                </div>
                <span className={getStatusStyle(inquiry.status)}>
                  {inquiry.status}
                </span>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className={`font-bold mb-1 ${textPrimary}`}>
                  {inquiry.title}
                </h3>
                <p className={`text-sm mb-3 ${textMuted}`}>{inquiry.date}</p>
                <p className={`text-sm leading-relaxed ${textSecondary}`}>
                  {inquiry.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-accent text-white font-semibold py-3 rounded-lg hover:bg-accent/90 transition-colors text-sm">
                  View & Reply
                </button>
                <button
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

        {/* Empty State */}
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
            No new inquiries here
          </h3>
          <p className={`text-sm ${textMuted}`}>
            Try adjusting your filters or check back later.
          </p>
        </div>
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
