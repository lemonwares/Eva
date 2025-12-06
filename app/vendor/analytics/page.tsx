"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import { formatCurrency } from "@/lib/formatters";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Eye,
  MessageSquare,
  Star,
  CalendarDays,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AnalyticsData {
  period: string;
  providerId: string;
  businessName: string;
  overview: {
    profileViews: number;
    averageRating: number | null;
    totalReviews: number;
    newReviews: number;
  };
  inquiries: {
    total: number;
    new: number;
    responseRate: number;
  };
  bookings: {
    total: number;
    new: number;
    completed: number;
    upcoming: number;
  };
  quotes: {
    sent: number;
    accepted: number;
    conversionRate: number;
  };
  revenue: {
    period: number;
    bookings: number;
  };
  recentActivity: {
    inquiries: any[];
    bookings: any[];
    reviews: any[];
  };
}

const periodOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 3 Months" },
  { value: "1y", label: "Last Year" },
];

export default function VendorAnalyticsPage() {
  const { darkMode } = useVendorTheme();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  async function fetchAnalytics() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/vendor/analytics?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const performanceMetrics = analytics
    ? [
        {
          label: "Response Rate",
          value: `${analytics.inquiries.responseRate}%`,
          trend: analytics.inquiries.responseRate >= 80 ? "up" : "down",
        },
        {
          label: "Quote Conversion",
          value: `${analytics.quotes.conversionRate}%`,
          trend: analytics.quotes.conversionRate >= 50 ? "up" : "down",
        },
        {
          label: "Completed Bookings",
          value: analytics.bookings.completed.toString(),
          trend: "up",
        },
        {
          label: "Upcoming Events",
          value: analytics.bookings.upcoming.toString(),
          trend: "up",
        },
      ]
    : [];

  return (
    <VendorLayout title="Analytics">
      {/* Date Range Filter */}
      <div className="flex justify-end mb-6">
        <div className="relative">
          <button
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
              darkMode
                ? "bg-[#141414] border-white/10 text-white hover:bg-white/10"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
            } border transition-colors text-sm`}
          >
            <CalendarDays size={18} />
            <span>{periodOptions.find((p) => p.value === period)?.label}</span>
            <ChevronDown size={16} />
          </button>
          {showPeriodDropdown && (
            <div
              className={`absolute right-0 top-full mt-1 ${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } border rounded-lg shadow-lg z-10 py-1 min-w-40`}
            >
              {periodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setPeriod(opt.value);
                    setShowPeriodDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    period === opt.value
                      ? "text-accent"
                      : darkMode
                      ? "text-gray-400 hover:bg-white/5"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2
            className={`w-8 h-8 animate-spin ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          />
        </div>
      ) : analytics ? (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">Period Revenue</span>
                <div className="p-2 rounded-lg bg-green-500/20">
                  <DollarSign size={18} className="text-green-400" />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {formatCurrency(analytics.revenue.period)}
              </p>
              <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
                <ArrowUpRight size={14} />
                {analytics.revenue.bookings} bookings
              </p>
            </div>

            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">Profile Views</span>
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Eye size={18} className="text-blue-400" />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {analytics.overview.profileViews.toLocaleString()}
              </p>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm mt-2`}
              >
                All time views
              </p>
            </div>

            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">New Inquiries</span>
                <div className="p-2 rounded-lg bg-accent/20">
                  <MessageSquare size={18} className="text-accent" />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {analytics.inquiries.new}
              </p>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm mt-2`}
              >
                {analytics.inquiries.total} total inquiries
              </p>
            </div>

            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">Avg Rating</span>
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Star size={18} className="text-yellow-400" />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {analytics.overview.averageRating?.toFixed(1) || "N/A"}
              </p>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm flex items-center gap-1 mt-2`}
              >
                <Users size={14} />
                {analytics.overview.totalReviews} reviews
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold mb-4`}
              >
                Performance Metrics
              </h3>
              <div className="space-y-4">
                {performanceMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-50"
                    }`}
                  >
                    <span
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {metric.value}
                      </span>
                      {metric.trend === "up" ? (
                        <TrendingUp size={14} className="text-green-400" />
                      ) : (
                        <TrendingDown size={14} className="text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Stats */}
            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold mb-4`}
              >
                Booking Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  } text-center`}
                >
                  <p className="text-2xl font-bold text-accent mb-1">
                    {analytics.bookings.total}
                  </p>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Total Bookings
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  } text-center`}
                >
                  <p className="text-2xl font-bold text-blue-400 mb-1">
                    {analytics.bookings.new}
                  </p>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    New This Period
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  } text-center`}
                >
                  <p className="text-2xl font-bold text-green-400 mb-1">
                    {analytics.bookings.completed}
                  </p>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Completed
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  } text-center`}
                >
                  <p className="text-2xl font-bold text-yellow-400 mb-1">
                    {analytics.bookings.upcoming}
                  </p>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Upcoming
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Stats */}
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-5`}
          >
            <h3
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } font-semibold mb-4`}
            >
              Quote Performance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                } text-center`}
              >
                <p className="text-2xl font-bold text-accent mb-1">
                  {analytics.quotes.sent}
                </p>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
                  Quotes Sent
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                } text-center`}
              >
                <p className="text-2xl font-bold text-green-400 mb-1">
                  {analytics.quotes.accepted}
                </p>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
                  Quotes Accepted
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                } text-center`}
              >
                <p className="text-2xl font-bold text-blue-400 mb-1">
                  {analytics.quotes.conversionRate}%
                </p>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
                  Conversion Rate
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          className={`text-center py-20 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          No analytics data available
        </div>
      )}
    </VendorLayout>
  );
}
