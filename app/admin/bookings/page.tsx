"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Download,
  Search,
  ChevronDown,
  MoreVertical,
  Filter,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const bookings = [
  {
    id: "#E8C42-B",
    customer: "Liam Johnson",
    vendor: "Culinary Creations",
    eventDate: "2024-08-15",
    total: "$2,450.00",
    status: "Confirmed",
    statusColor: "bg-green-500",
  },
  {
    id: "#F2B19-A",
    customer: "Olivia Smith",
    vendor: "Vintage Venues",
    eventDate: "2024-09-02",
    total: "$5,120.50",
    status: "Completed",
    statusColor: "bg-blue-500",
  },
  {
    id: "#A9D55-C",
    customer: "Noah Williams",
    vendor: "PhotoBooths Inc.",
    eventDate: "2024-08-22",
    total: "$850.00",
    status: "Pending",
    statusColor: "bg-amber-500",
  },
  {
    id: "#C3E71-F",
    customer: "Emma Brown",
    vendor: "Soundwave DJs",
    eventDate: "2024-07-30",
    total: "$1,200.00",
    status: "Cancelled",
    statusColor: "bg-red-500",
  },
  {
    id: "#G4H88-D",
    customer: "Ava Jones",
    vendor: "Floral Dreams",
    eventDate: "2024-10-05",
    total: "$3,500.75",
    status: "Confirmed",
    statusColor: "bg-green-500",
  },
];

const statusOptions = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];
const dateRangeOptions = [
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "All Time",
];

export default function AdminBookingsPage() {
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
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(3);

  return (
    <AdminLayout
      title="Bookings Management"
      actionButton={{
        label: "Export Data",
        icon: <Download size={18} />,
        onClick: () => {},
      }}
      searchPlaceholder="Booking ID, Customer, Vendor..."
    >
      {/* Filters */}
      <div className={`${cardBg} border ${cardBorder} rounded-xl p-4 mb-6`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className={`text-xs font-medium ${textMuted} mb-1.5 block`}>
              Search
            </label>
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
                size={18}
              />
              <input
                type="text"
                placeholder="Booking ID, Customer, Vendor..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>
          </div>

          {/* Status */}
          <div className="w-full md:w-44">
            <label className={`text-xs font-medium ${textMuted} mb-1.5 block`}>
              Status
            </label>
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
              >
                {statusFilter}
                <ChevronDown size={16} />
              </button>
              {showStatusDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        statusFilter === status ? "text-accent" : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div className="w-full md:w-48">
            <label className={`text-xs font-medium ${textMuted} mb-1.5 block`}>
              Date Range
            </label>
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
              >
                {dateRange}
                <ChevronDown size={16} />
              </button>
              {showDateDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {dateRangeOptions.map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        dateRange === range ? "text-accent" : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
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
                  <input type="checkbox" className="rounded" />
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Booking ID
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Customer
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Vendor
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Event Date
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Total
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                >
                  Status
                </th>
                <th
                  className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                ></th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-white/5" : "divide-gray-100"
              }`}
            >
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className={`${
                    darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-accent font-medium text-sm">
                      {booking.id}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${textPrimary}`}>
                    {booking.customer}
                  </td>
                  <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                    {booking.vendor}
                  </td>
                  <td className={`px-6 py-4 text-sm ${textMuted}`}>
                    {booking.eventDate}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${textPrimary}`}
                  >
                    {booking.total}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white ${booking.statusColor}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      }`}
                    >
                      <MoreVertical size={16} className={textMuted} />
                    </button>
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
          <p className={`text-sm ${textMuted}`}>
            Showing <span className={textPrimary}>1-5</span> of{" "}
            <span className={textPrimary}>1000</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
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
              className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              100
            </button>
            <button
              className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              } transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
