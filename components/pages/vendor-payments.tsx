"use client";

import {
  Moon,
  Bell,
  Search,
  CalendarDays,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const stats = [
  {
    label: "Current Balance",
    value: "$1,234.56",
    change: "+5.2%",
    changePositive: true,
  },
  {
    label: "Pending Payout",
    value: "$850.00",
    change: "+12.0%",
    changePositive: true,
  },
  {
    label: "Last Payout Amount",
    value: "$987.65",
    change: null,
    changePositive: null,
  },
  {
    label: "Next Payout Date",
    value: "Oct 25, 2024",
    change: null,
    changePositive: null,
  },
];

const payments = [
  {
    date: "Oct 15, 2024",
    bookingId: "#BK-1024",
    clientName: "Jane Cooper",
    amount: "$150.00",
    status: "Paid",
  },
  {
    date: "Oct 12, 2024",
    bookingId: "#BK-1021",
    clientName: "Wade Warren",
    amount: "$275.50",
    status: "Paid",
  },
  {
    date: "Oct 10, 2024",
    bookingId: "#BK-1019",
    clientName: "Esther Howard",
    amount: "$85.00",
    status: "Pending",
  },
  {
    date: "Oct 08, 2024",
    bookingId: "#BK-1015",
    clientName: "Cameron Williamson",
    amount: "$220.00",
    status: "Paid",
  },
  {
    date: "Oct 05, 2024",
    bookingId: "#BK-1011",
    clientName: "Brooklyn Simmons",
    amount: "$130.75",
    status: "Failed",
  },
];

export default function VendorPayments() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "Failed":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1a12] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d1a12] border-b border-green-900/30">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold">EVA</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <a
              href="#"
              className="text-gray-400 hover:text-white font-medium text-sm"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white font-medium text-sm"
            >
              Bookings
            </a>
            <a href="#" className="text-green-400 font-medium text-sm">
              Payments
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-green-900/20 rounded-full">
              <Moon size={20} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-green-900/20 rounded-full">
              <Bell size={20} className="text-gray-400" />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-green-400 to-teal-400 border-2 border-green-500" />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-green-900/20 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-green-900/30 bg-[#0d1a12] px-4 py-4">
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Bookings
              </a>
              <a href="#" className="text-green-400 font-medium py-2">
                Payments
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">
              Payments
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Here&apos;s an overview of your payment history and balances.
            </p>
          </div>
          <button className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-green-500 text-green-400 font-semibold hover:bg-green-500/10 transition-colors text-sm whitespace-nowrap">
            Withdraw Funds
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#1a2e22] rounded-xl p-4 sm:p-5 border border-green-900/30"
            >
              <p className="text-gray-500 text-xs sm:text-sm mb-1">
                {stat.label}
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
                {stat.value}
              </p>
              {stat.change && (
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    stat.changePositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Payment History */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Payment History
          </h2>

          {/* Filters */}
          <div className="bg-[#1a2e22] rounded-xl border border-green-900/30 p-4 sm:p-5 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by Booking ID or Client"
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-lg bg-[#0d1a12] text-white border border-green-900/30 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg bg-[#0d1a12] border border-green-900/30 text-white hover:bg-green-900/20 transition-colors text-sm whitespace-nowrap">
                  <CalendarDays size={18} />
                  <span>Last 30 Days</span>
                  <ChevronDown size={16} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-green-500 text-green-400 hover:bg-green-500/10 transition-colors text-sm whitespace-nowrap font-medium">
                  <Download size={18} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block bg-[#1a2e22] rounded-xl border border-green-900/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-green-900/30">
                    <th className="text-left px-6 py-4 font-medium">Date</th>
                    <th className="text-left px-6 py-4 font-medium">
                      Booking ID
                    </th>
                    <th className="text-left px-6 py-4 font-medium">
                      Client Name
                    </th>
                    <th className="text-right px-6 py-4 font-medium">Amount</th>
                    <th className="text-center px-6 py-4 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-green-900/30 hover:bg-green-900/10 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-sm">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {payment.bookingId}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {payment.clientName}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-sm">
                        {payment.amount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards - Mobile */}
          <div className="md:hidden space-y-3">
            {payments.map((payment, idx) => (
              <div
                key={idx}
                className="bg-[#1a2e22] rounded-xl border border-green-900/30 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-white text-sm">
                      {payment.clientName}
                    </p>
                    <p className="text-gray-500 text-xs">{payment.bookingId}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-green-900/30">
                  <span className="text-gray-500 text-xs">{payment.date}</span>
                  <span className="font-bold text-white">{payment.amount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-gray-500 text-sm">
              Showing <span className="text-white font-medium">1-5</span> of{" "}
              <span className="text-white font-medium">100</span>
            </p>

            <div className="flex items-center gap-1">
              <button className="px-3 py-2 text-gray-400 hover:text-white text-sm border border-green-900/30 rounded-l-lg hover:bg-green-900/20">
                Previous
              </button>
              <button className="w-9 h-9 text-gray-400 hover:bg-green-900/20 text-sm border-y border-green-900/30">
                1
              </button>
              <button className="w-9 h-9 text-gray-400 hover:bg-green-900/20 text-sm border-y border-green-900/30">
                2
              </button>
              <button className="w-9 h-9 bg-green-500 text-white text-sm border-y border-green-500">
                3
              </button>
              <span className="px-2 text-gray-500 border-y border-green-900/30 h-9 flex items-center">
                ...
              </span>
              <button className="px-3 py-2 text-gray-400 hover:text-white text-sm border border-green-900/30 rounded-r-lg hover:bg-green-900/20">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
