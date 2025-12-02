"use client";

import {
  Moon,
  ChevronDown,
  Mail,
  Menu,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

const statusFilters = ["All", "New", "Replied", "Archived"];

const inquiries = [
  {
    id: 1,
    initials: "AC",
    initialsColor: "bg-gradient-to-br from-orange-400 to-pink-500",
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
    initialsColor: "bg-gradient-to-br from-blue-400 to-blue-600",
    name: "Liam Smith",
    receivedTime: "1 day ago",
    status: "Replied",
    title: "Corporate Headshots",
    date: "September 15, 2024",
    message:
      "Following up on our conversation, please find the attached mood board for the project...",
  },
];

export default function VendorInquiries() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "New":
        return "text-pink-400";
      case "Replied":
        return "text-gray-500 bg-gray-800 px-3 py-1 rounded-full text-xs";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-gray-800">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
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
            <a href="#" className="text-blue-400 font-medium text-sm">
              Inquiries
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white font-medium text-sm"
            >
              Calendar
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white font-medium text-sm"
            >
              Profile
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-gray-800 rounded-full">
              <Moon size={20} className="text-gray-400" />
            </button>

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
              <a href="#" className="text-blue-400 font-medium py-2">
                Inquiries
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Calendar
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white font-medium py-2"
              >
                Profile
              </a>
            </nav>
          </div>
        )}
      </header>

      <div className="flex max-w-[1400px] mx-auto">
        {/* Filter Sidebar Overlay - Mobile */}
        {filterSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setFilterSidebarOpen(false)}
          />
        )}

        {/* Filter Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] lg:bg-transparent border-r border-gray-800 lg:border-0 p-4 sm:p-6 transform transition-transform duration-300 ${
            filterSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h3 className="font-bold text-lg">Filters</h3>
            <button
              onClick={() => setFilterSidebarOpen(false)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="font-bold text-sm mb-4 hidden lg:block">
            Filter Inquiries
          </h3>

          {/* Status Filter */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm mb-3">Status</p>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm mb-3">Date Range</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                className="flex-1 px-3 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                className="flex-1 px-3 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Event Type */}
          <div>
            <p className="text-gray-500 text-sm mb-3">Event Type</p>
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white text-sm">
              <span>Wedding, Corporate...</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFilterSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
              >
                <SlidersHorizontal size={20} />
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold">Inquiries</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm hidden sm:inline">
                Sort by:
              </span>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white text-sm">
                <span>Newest</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 sm:p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${inquiry.initialsColor} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {inquiry.initials}
                    </div>
                    <div>
                      <p className="font-medium text-white">{inquiry.name}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">
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
                  <h3 className="font-bold text-white mb-1">{inquiry.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{inquiry.date}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {inquiry.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors text-sm">
                    View & Reply
                  </button>
                  <button className="flex-1 bg-gray-700/50 text-gray-300 font-semibold py-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors text-sm">
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 border-dashed p-8 sm:p-12 mt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-gray-500" />
            </div>
            <h3 className="font-bold text-white mb-2">No new inquiries here</h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or check back later.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
