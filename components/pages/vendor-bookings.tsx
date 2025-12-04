"use client";

import {
  LayoutDashboard,
  CheckCircle,
  Calendar,
  Briefcase,
  Settings,
  Moon,
  Search,
  CalendarDays,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: CheckCircle, label: "Bookings", active: true },
  { icon: Calendar, label: "Calendar", active: false },
  { icon: Briefcase, label: "Services", active: false },
  { icon: Settings, label: "Account Settings", active: false },
];

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

export default function VendorBookings() {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Paid":
        return "bg-pink-500/20 text-pink-400 border border-pink-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-pink-600" />
            <div>
              <p className="font-bold">EVA Platform</p>
              <p className="text-gray-500 text-sm">Vendor Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4">
          {sidebarItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                item.active
                  ? "bg-pink-500/10 text-pink-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-400">
              <Moon size={20} />
              <span className="font-medium">Dark Mode</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                darkMode ? "bg-pink-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a] border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold italic">
                Confirmed Bookings
              </h1>
            </div>
            <button className="bg-pink-500 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base whitespace-nowrap">
              Add Manual Booking
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
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
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white hover:bg-gray-800 transition-colors text-sm whitespace-nowrap">
                <CalendarDays size={18} />
                <span>Date Range</span>
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white hover:bg-gray-800 transition-colors text-sm whitespace-nowrap">
                <ArrowUpDown size={18} />
                <span className="hidden sm:inline">Sort by:</span>
                <span>Event Date (Newest)</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                    <th className="text-left px-6 py-4 font-medium">
                      Client Name
                    </th>
                    <th className="text-left px-6 py-4 font-medium">
                      Event Type
                    </th>
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
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-5 font-medium">
                        {booking.clientName}
                      </td>
                      <td className="px-6 py-5 text-gray-400">
                        {booking.eventType}
                      </td>
                      <td className="px-6 py-5 text-gray-400">
                        {booking.eventDateTime}
                      </td>
                      <td className="px-6 py-5 text-gray-400">
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
                      <td className="px-6 py-5 text-right font-medium">
                        {booking.totalAmount}
                      </td>
                      <td className="px-6 py-5">
                        <button className="p-2 hover:bg-gray-700 rounded-lg">
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
                className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-white">
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
                    <span className="text-gray-300">
                      {booking.eventDateTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Package</span>
                    <span className="text-gray-300">
                      {booking.servicePackage}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-800">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold text-white">
                      {booking.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-lg bg-pink-500 text-white font-medium text-sm">
                1
              </button>
              <button className="w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-800 font-medium text-sm">
                2
              </button>
              <button className="w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-800 font-medium text-sm">
                3
              </button>
              <span className="text-gray-500 px-2">...</span>
              <button className="w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-800 font-medium text-sm">
                10
              </button>
            </div>

            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
