"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";

const quotes = [
  {
    client: "Eleanor Vance",
    service: "Wedding Photography Package",
    status: "Accepted",
    dateSent: "2024-08-15",
    amount: "$3,500.00",
  },
  {
    client: "Marcus Holloway",
    service: "Corporate Event DJ Set",
    status: "Sent",
    dateSent: "2024-08-12",
    amount: "$1,200.00",
  },
  {
    client: "Sofia Reyes",
    service: "Floral Arrangements for Gala",
    status: "Declined",
    dateSent: "2024-08-10",
    amount: "$2,800.00",
  },
  {
    client: "Liam Gallagher",
    service: "Custom Catering for 50",
    status: "Viewed",
    dateSent: "2024-08-09",
    amount: "$4,500.00",
  },
];

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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-500/20 text-green-600 border border-green-500/30";
      case "Sent":
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
      case "Declined":
        return "bg-red-500/20 text-red-600 border border-red-500/30";
      case "Viewed":
        return "bg-blue-500/20 text-blue-600 border border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
    }
  };

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
              className={`w-full pl-11 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${inputBg} ${inputBorder} ${textPrimary}`}
            />
          </div>
          <div className="flex gap-3">
            <button
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors text-sm whitespace-nowrap ${inputBg} ${inputBorder} ${textPrimary} ${hoverBg}`}
            >
              <SlidersHorizontal size={18} />
              <span>Status: All</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors text-sm whitespace-nowrap ${inputBg} ${inputBorder} ${textPrimary} ${hoverBg}`}
            >
              <ArrowUpDown size={18} />
              <span>Sort By: Date</span>
            </button>
          </div>
        </div>
      </div>

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
                <th className="text-left px-6 py-4 font-medium">Date Sent</th>
                <th className="text-right px-6 py-4 font-medium">Amount</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote, idx) => (
                <tr
                  key={idx}
                  className={`border-b transition-colors ${cardBorder} ${hoverBg}`}
                >
                  <td className={`px-6 py-5 font-medium ${textPrimary}`}>
                    {quote.client}
                  </td>
                  <td className={`px-6 py-5 ${textSecondary}`}>
                    {quote.service}
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
                    {quote.dateSent}
                  </td>
                  <td
                    className={`px-6 py-5 text-right font-medium ${textPrimary}`}
                  >
                    {quote.amount}
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
        {quotes.map((quote, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 ${cardBg} ${cardBorder}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className={`font-medium ${textPrimary}`}>{quote.client}</p>
                <p className={`text-sm ${textMuted}`}>{quote.service}</p>
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
              <span className={`text-sm ${textMuted}`}>{quote.dateSent}</span>
              <span className={`font-bold ${textPrimary}`}>{quote.amount}</span>
            </div>
          </div>
        ))}
      </div>
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
