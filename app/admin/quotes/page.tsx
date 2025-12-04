"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Plus,
  Filter,
  ChevronDown,
  Calendar,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const quotes = [
  {
    id: "QUO-00124",
    clientName: "Alex Johnson",
    vendorName: "Prestige Events",
    totalAmount: "$2,450.00",
    dateIssued: "2023-10-26",
    status: "Approved",
    statusColor: "bg-green-500",
  },
  {
    id: "QUO-00123",
    clientName: "Samantha Bee",
    vendorName: "Bloomfield Florist",
    totalAmount: "$850.00",
    dateIssued: "2023-10-25",
    status: "Pending",
    statusColor: "bg-amber-500",
  },
  {
    id: "QUO-00122",
    clientName: "Michael Chen",
    vendorName: "Gourmet Catering Co.",
    totalAmount: "$5,200.00",
    dateIssued: "2023-10-25",
    status: "Rejected",
    statusColor: "bg-red-500",
  },
  {
    id: "QUO-00121",
    clientName: "Emily Carter",
    vendorName: "Prestige Events",
    totalAmount: "$1,800.00",
    dateIssued: "2023-09-15",
    status: "Expired",
    statusColor: "bg-gray-500",
  },
  {
    id: "QUO-00120",
    clientName: "David Lee",
    vendorName: "City Soundscapes",
    totalAmount: "$1,200.00",
    dateIssued: "2023-09-12",
    status: "Approved",
    statusColor: "bg-green-500",
  },
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
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <AdminLayout
      title="Quotes Management"
      actionButton={{
        label: "Create New Quote",
        icon: <Plus size={18} />,
        onClick: () => {},
      }}
      searchPlaceholder="Search by Quote ID, Client, Vendor..."
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium`}
        >
          <Filter size={16} />
          Status: All
          <ChevronDown size={16} />
        </button>

        <button
          onClick={() => setShowDateDropdown(!showDateDropdown)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium`}
        >
          <Calendar size={16} />
          Date Range
          <ChevronDown size={16} />
        </button>

        <button
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium`}
        >
          <Store size={16} />
          Vendor Category
          <ChevronDown size={16} />
        </button>
      </div>

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
                  Client Name
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Vendor Name
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
                  Status
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
                  } transition-colors cursor-pointer`}
                >
                  <td className={`px-6 py-4 text-sm ${textMuted}`}>
                    {quote.id}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${textPrimary}`}
                  >
                    {quote.clientName}
                  </td>
                  <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                    {quote.vendorName}
                  </td>
                  <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                    {quote.totalAmount}
                  </td>
                  <td className={`px-6 py-4 text-sm ${textMuted}`}>
                    {quote.dateIssued}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white ${quote.statusColor}`}
                    >
                      {quote.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
            darkMode ? "border-white/10" : "border-gray-200"
          }`}
        >
          <p className={`text-sm ${textMuted}`}>Showing 1 to 5 of 57 results</p>
          <div className="flex items-center gap-1">
            <button
              className={`p-2 rounded ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              <ChevronLeft size={18} className={textMuted} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded flex items-center justify-center text-sm transition-colors ${
                  currentPage === page
                    ? "bg-accent text-white"
                    : `${textSecondary} ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      }`
                }`}
              >
                {page}
              </button>
            ))}
            <span className={textMuted}>...</span>
            <button
              className={`w-9 h-9 rounded flex items-center justify-center text-sm ${textSecondary} ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              12
            </button>
            <button
              className={`p-2 rounded ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              <ChevronRight size={18} className={textMuted} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
