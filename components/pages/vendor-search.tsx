"use client";

import {
  Search,
  ChevronDown,
  Clock,
  MapPin,
  Moon,
  Menu,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

const vendors = [
  {
    name: "Aperture Alchemists",
    category: "Photography",
    quoteTime: "24 hrs",
    score: 92,
    image: "/images/vendor1.jpg",
  },
  {
    name: "Sweet Harmony Cakes",
    category: "Catering",
    quoteTime: "12 hrs",
    score: 88,
    image: "/images/vendor2.jpg",
  },
  {
    name: "Petal Perfect",
    category: "Florist",
    quoteTime: "48 hrs",
    score: 95,
    image: "/images/vendor3.jpg",
  },
  {
    name: "Moment Captures",
    category: "Photography",
    quoteTime: "6 hrs",
    score: 85,
    image: "/images/vendor4.jpg",
  },
  {
    name: "The Brooklyn Loft",
    category: "Venue",
    quoteTime: "72 hrs",
    score: 91,
    image: "/images/vendor5.jpg",
  },
  {
    name: "Groove Collective",
    category: "Music Band",
    quoteTime: "24 hrs",
    score: 90,
    image: "/images/vendor6.jpg",
  },
];

const filterSections = [
  {
    label: "Location",
    expanded: false,
    options: [],
  },
  {
    label: "Service Type",
    expanded: true,
    options: [
      { name: "Photography", checked: true },
      { name: "Videography", checked: false },
      { name: "Photo Booth", checked: false },
      { name: "Drone", checked: false },
    ],
  },
  {
    label: "Availability",
    expanded: false,
    options: [],
  },
  {
    label: "Budget",
    expanded: false,
    options: [],
  },
];

export default function VendorSearch() {
  const [filters, setFilters] = useState(filterSections);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EVA</span>
          </div>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                defaultValue="Wedding Photographers in Brooklyn"
                className="w-full pl-11 pr-4 py-2.5 lg:py-3 rounded-full bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Discover
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Bookings
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Messages
            </a>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Moon size={20} className="text-gray-600" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-orange-400" />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Moon size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              defaultValue="Wedding Photographers in Brooklyn"
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4">
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                Discover
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                Bookings
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                Messages
              </a>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-orange-400" />
                <span className="text-gray-900 font-medium">My Account</span>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex flex-col lg:flex-row max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 gap-4 lg:gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 font-medium w-full justify-center"
          >
            <SlidersHorizontal size={18} />
            {filtersOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`${
            filtersOpen ? "block" : "hidden"
          } lg:block w-full lg:w-64 flex-shrink-0`}
        >
          <div className="bg-white lg:bg-transparent rounded-xl lg:rounded-none p-4 lg:p-0 border border-gray-200 lg:border-0">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
              Filters
            </h2>

            <div className="space-y-4 lg:space-y-6">
              {filters.map((section, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4">
                  <button className="flex items-center justify-between w-full text-left">
                    <span className="font-medium text-gray-900 text-sm lg:text-base">
                      {section.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform ${
                        section.expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {section.expanded && section.options.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {section.options.map((option, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={option.checked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                          />
                          <span className="text-gray-600 text-sm">
                            {option.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full mt-4 lg:mt-6 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors text-sm lg:text-base">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Results Section */}
        <section className="flex-1">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 lg:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Showing results for 'Wedding Photographers'
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                247 results found in Brooklyn
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                Sort by:
              </span>
              <select className="bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm flex-1 sm:flex-none">
                <option>Relevance</option>
                <option>Rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Vendor Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {vendors.map((vendor, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
                  {/* Score Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                      <svg className="w-12 h-12 sm:w-14 sm:h-14 -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                          fill="transparent"
                          className="sm:hidden"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#22c55e"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={`${
                            (vendor.score / 100) * 125.6
                          } 125.6`}
                          strokeLinecap="round"
                          className="sm:hidden"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke="#e5e7eb"
                          strokeWidth="4"
                          fill="transparent"
                          className="hidden sm:block"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke="#22c55e"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={`${
                            (vendor.score / 100) * 150.8
                          } 150.8`}
                          strokeLinecap="round"
                          className="hidden sm:block"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-green-600">
                        {vendor.score}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                    {vendor.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2 sm:mb-3">
                    {vendor.category}
                  </p>

                  <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                    <Clock size={14} />
                    <span>Median Quote Time: {vendor.quoteTime}</span>
                  </div>

                  <button className="w-full bg-green-500 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-8 sm:mt-12">
            <button className="px-3 sm:px-4 py-2 rounded-lg bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 text-sm">
              Previous
            </button>
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-500 text-white font-bold text-sm">
              1
            </button>
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 text-sm">
              2
            </button>
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 text-sm hidden xs:flex items-center justify-center">
              3
            </button>
            <span className="px-1 sm:px-2 text-gray-400">...</span>
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 text-sm">
              12
            </button>
            <button className="px-3 sm:px-4 py-2 rounded-lg bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 text-sm">
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
