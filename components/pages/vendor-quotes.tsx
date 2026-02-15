"use client";

import {
  Search,
  Moon,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

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

export default function VendorQuotes() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Sent":
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
      case "Declined":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "Viewed":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-gray-800">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
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
            <a href="#" className="text-white font-medium text-sm">
              Quotes
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white font-medium text-sm"
            >
              Calendar
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-gray-800 rounded-full">
              <Moon size={20} className="text-gray-400" />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-400" />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-[#0a0a0a] px-4 py-4">
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Dashboard
              </a>
              <a href="#" className="text-white font-medium py-2">
                Quotes
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Calendar
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Quotes</h1>
          <button className="bg-accent text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-accent/90 transition-colors text-sm sm:text-base w-full sm:w-auto">
            Create New Quote
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by client or service..."
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#252525] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#252525] border border-gray-700 text-white hover:bg-gray-700 transition-colors text-sm whitespace-nowrap">
                <SlidersHorizontal size={18} />
                <span>Status: All</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#252525] border border-gray-700 text-white hover:bg-gray-700 transition-colors text-sm whitespace-nowrap">
                <ArrowUpDown size={18} />
                <span>Sort By: Date</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
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
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-5 font-medium">{quote.client}</td>
                    <td className="px-6 py-5 text-gray-400">{quote.service}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          quote.status,
                        )}`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-400">
                      {quote.dateSent}
                    </td>
                    <td className="px-6 py-5 text-right font-medium">
                      {quote.amount}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-gray-700 rounded-lg">
                        <MoreHorizontal size={18} className="text-gray-400" />
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
              className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-white">{quote.client}</p>
                  <p className="text-gray-500 text-sm">{quote.service}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    quote.status,
                  )}`}
                >
                  {quote.status}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                <span className="text-gray-500 text-sm">{quote.dateSent}</span>
                <span className="font-bold text-white">{quote.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
