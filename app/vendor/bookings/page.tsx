"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import {
  Search,
  CalendarDays,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

const bookings = [
  {
    clientName: "Olivia Chen",
    eventType: "Wedding",
    eventDateTime: "Oct 26, 2024, 2:00 PM",
    servicePackage: "Gold Package",
    status: "Confirmed",
    totalAmount: "$4,500.00",
  },
  {
    clientName: "Benjamin Carter",
    eventType: "Corporate Gala",
    eventDateTime: "Nov 5, 2024, 7:00 PM",
    servicePackage: "Platinum DJ Set",
    status: "Paid",
    totalAmount: "$3,200.00",
  },
  {
    clientName: "Sophia Rodriguez",
    eventType: "Birthday Party",
    eventDateTime: "Nov 12, 2024, 5:00 PM",
    servicePackage: "Standard Photography",
    status: "Confirmed",
    totalAmount: "$1,800.00",
  },
  {
    clientName: "Liam Goldberg",
    eventType: "Charity Fundraiser",
    eventDateTime: "Nov 18, 2024, 6:30 PM",
    servicePackage: "Full Event Coverage",
    status: "Confirmed",
    totalAmount: "$6,000.00",
  },
  {
    clientName: "Ava Nguyen",
    eventType: "Wedding",
    eventDateTime: "Dec 2, 2024, 3:00 PM",
    servicePackage: "Silver Package",
    status: "Paid",
    totalAmount: "$2,750.00",
  },
];

export default function VendorBookingsPage() {
  const { darkMode } = useVendorTheme();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Paid":
        return "bg-accent/20 text-accent border border-accent/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <VendorLayout
      title="Bookings"
      actionButton={{ label: "Add Manual Booking", onClick: () => {} }}
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by client name, event..."
            className={`w-full pl-11 pr-4 py-3 rounded-lg ${
              darkMode
                ? "bg-[#141414] text-white border-white/10"
                : "bg-white text-gray-900 border-gray-200"
            } border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm`}
          />
        </div>
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
              darkMode
                ? "bg-[#141414] border-white/10 text-white hover:bg-white/10"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
            } border transition-colors text-sm whitespace-nowrap`}
          >
            <CalendarDays size={18} />
            <span>Date Range</span>
            <ChevronDown size={16} />
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
              darkMode
                ? "bg-[#141414] border-white/10 text-white hover:bg-white/10"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
            } border transition-colors text-sm whitespace-nowrap`}
          >
            <ArrowUpDown size={18} />
            <span className="hidden sm:inline">Sort by:</span>
            <span>Event Date (Newest)</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Table - Desktop */}
      <div
        className={`hidden md:block ${
          darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"
        } rounded-xl border overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`text-gray-500 text-xs uppercase tracking-wider ${
                  darkMode ? "border-white/10" : "border-gray-200"
                } border-b`}
              >
                <th className="text-left px-6 py-4 font-medium">Client Name</th>
                <th className="text-left px-6 py-4 font-medium">Event Type</th>
                <th className="text-left px-6 py-4 font-medium">
                  Event Date & Time
                </th>
                <th className="text-left px-6 py-4 font-medium">
                  Service Package
                </th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-right px-6 py-4 font-medium">
                  Total Amount
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr
                  key={idx}
                  className={`${
                    darkMode
                      ? "border-white/10 hover:bg-white/5"
                      : "border-gray-200 hover:bg-gray-50"
                  } border-b transition-colors`}
                >
                  <td
                    className={`px-6 py-5 font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {booking.clientName}
                  </td>
                  <td
                    className={`px-6 py-5 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {booking.eventType}
                  </td>
                  <td
                    className={`px-6 py-5 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {booking.eventDateTime}
                  </td>
                  <td
                    className={`px-6 py-5 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {booking.servicePackage}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-5 text-right font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {booking.totalAmount}
                  </td>
                  <td className="px-6 py-5">
                    <button
                      className={`p-2 ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                      } rounded-lg`}
                    >
                      <MoreVertical size={18} className="text-gray-400" />
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
        {bookings.map((booking, idx) => (
          <div
            key={idx}
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-4`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {booking.clientName}
                </p>
                <p className="text-gray-500 text-sm">{booking.eventType}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time</span>
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {booking.eventDateTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Package</span>
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {booking.servicePackage}
                </span>
              </div>
              <div
                className={`flex justify-between pt-2 ${
                  darkMode ? "border-white/10" : "border-gray-200"
                } border-t`}
              >
                <span className="text-gray-500">Total</span>
                <span
                  className={`font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {booking.totalAmount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <button
          className={`flex items-center gap-2 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-900"
          } transition-colors text-sm`}
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg bg-accent text-white font-medium text-sm">
            1
          </button>
          <button
            className={`w-9 h-9 rounded-lg ${
              darkMode
                ? "text-gray-400 hover:bg-white/10"
                : "text-gray-500 hover:bg-gray-100"
            } font-medium text-sm`}
          >
            2
          </button>
          <button
            className={`w-9 h-9 rounded-lg ${
              darkMode
                ? "text-gray-400 hover:bg-white/10"
                : "text-gray-500 hover:bg-gray-100"
            } font-medium text-sm`}
          >
            3
          </button>
          <span className="text-gray-500 px-2">...</span>
          <button
            className={`w-9 h-9 rounded-lg ${
              darkMode
                ? "text-gray-400 hover:bg-white/10"
                : "text-gray-500 hover:bg-gray-100"
            } font-medium text-sm`}
          >
            10
          </button>
        </div>

        <button
          className={`flex items-center gap-2 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-900"
          } transition-colors text-sm`}
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </VendorLayout>
  );
}
