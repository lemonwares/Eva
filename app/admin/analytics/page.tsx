"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toast, ToastType } from "@/components/admin/Toast";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalUsers: number;
    totalBookings: number;
    totalProviders: number;
    totalReviews: number;
    averageRating: number;
    revenueChange: number;
    usersChange: number;
    bookingsChange: number;
    providersChange: number;
  };
  recentActivity: {
    recentBookings: number;
    recentReviews: number;
    recentUsers: number;
    recentProviders: number;
  };
  topProviders: Array<{
    id: string;
    businessName: string;
    bookingCount: number;
    reviewCount: number;
    averageRating: number;
    totalRevenue: number;
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    providerCount: number;
    percentage: number;
  }>;
  bookingsByStatus: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

const dateRanges = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last Year", value: "1y" },
  { label: "All Time", value: "all" },
];

const categoryColors = [
  "bg-pink-500",
  "bg-orange-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-cyan-500",
  "bg-yellow-500",
  "bg-red-500",
];

export default function AnalyticsPage() {
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

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${dateRange}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        setToast({
          message: data.error || "Failed to fetch analytics",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setToast({ message: "Failed to fetch analytics", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Get trend icon
  const TrendIcon = ({ trend }: { trend: number }) => {
    if (trend > 0) {
      return (
        <svg
          className="w-4 h-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 11l5-5m0 0l5 5m-5-5v12"
          />
        </svg>
      );
    }
    if (trend < 0) {
      return (
        <svg
          className="w-4 h-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 13l-5 5m0 0l-5-5m5 5V6"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14"
        />
      </svg>
    );
  };

  const stats = analytics
    ? [
        {
          label: "Total Revenue",
          value: formatCurrency(analytics.overview.totalRevenue),
          change: analytics.overview.revenueChange,
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        },
        {
          label: "Total Users",
          value: formatNumber(analytics.overview.totalUsers),
          change: analytics.overview.usersChange,
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ),
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Total Bookings",
          value: formatNumber(analytics.overview.totalBookings),
          change: analytics.overview.bookingsChange,
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        },
        {
          label: "Avg. Rating",
          value: analytics.overview.averageRating.toFixed(1),
          change: 0,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ),
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        },
      ]
    : [];

  const exportReport = async () => {
    try {
      const response = await fetch(
        `/api/admin/export?type=analytics&period=${dateRange}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-report-${dateRange}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setToast({ message: "Report exported successfully", type: "success" });
      } else {
        setToast({ message: "Failed to export report", type: "error" });
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      setToast({ message: "Failed to export report", type: "error" });
    }
  };

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className={textSecondary}>
              Overview of platform performance and metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm`}
              >
                {dateRanges.find((r) => r.value === dateRange)?.label}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showDateDropdown && (
                <div
                  className={`absolute top-full right-0 mt-1 w-40 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {dateRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setDateRange(range.value);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        dateRange === range.value
                          ? "text-rose-500"
                          : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={exportReport}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${textPrimary}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full"></div>
          </div>
        ) : analytics ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`${cardBg} ${cardBorder} rounded-xl p-5`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        stat.change > 0
                          ? "text-green-500"
                          : stat.change < 0
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      <TrendIcon trend={stat.change} />
                      {stat.change !== 0 &&
                        `${Math.abs(stat.change).toFixed(1)}%`}
                    </div>
                  </div>
                  <p className={`text-2xl font-bold ${textPrimary} mb-1`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm ${textMuted}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className={`${cardBg} ${cardBorder} rounded-xl p-4 text-center`}
              >
                <p className={`text-3xl font-bold text-rose-500`}>
                  {analytics.recentActivity.recentBookings}
                </p>
                <p className={`text-sm ${textMuted}`}>New Bookings (7d)</p>
              </div>
              <div
                className={`${cardBg} ${cardBorder} rounded-xl p-4 text-center`}
              >
                <p className={`text-3xl font-bold text-blue-500`}>
                  {analytics.recentActivity.recentUsers}
                </p>
                <p className={`text-sm ${textMuted}`}>New Users (7d)</p>
              </div>
              <div
                className={`${cardBg} ${cardBorder} rounded-xl p-4 text-center`}
              >
                <p className={`text-3xl font-bold text-green-500`}>
                  {analytics.recentActivity.recentProviders}
                </p>
                <p className={`text-sm ${textMuted}`}>New Providers (7d)</p>
              </div>
              <div
                className={`${cardBg} ${cardBorder} rounded-xl p-4 text-center`}
              >
                <p className={`text-3xl font-bold text-purple-500`}>
                  {analytics.recentActivity.recentReviews}
                </p>
                <p className={`text-sm ${textMuted}`}>New Reviews (7d)</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bookings by Status */}
              <div className={`${cardBg} ${cardBorder} rounded-xl p-6`}>
                <h3 className={`font-bold ${textPrimary} mb-6`}>
                  Bookings by Status
                </h3>
                <div className="space-y-4">
                  {Object.entries(analytics.bookingsByStatus).map(
                    ([status, count]) => {
                      const total = Object.values(
                        analytics.bookingsByStatus
                      ).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      const colors: Record<string, string> = {
                        pending: "bg-yellow-500",
                        confirmed: "bg-blue-500",
                        completed: "bg-green-500",
                        cancelled: "bg-red-500",
                      };

                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-sm capitalize ${textSecondary}`}
                            >
                              {status}
                            </span>
                            <span
                              className={`text-sm font-medium ${textPrimary}`}
                            >
                              {count} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div
                            className={`h-2 rounded-full ${
                              darkMode ? "bg-white/10" : "bg-gray-100"
                            }`}
                          >
                            <div
                              className={`h-full rounded-full ${
                                colors[status] || "bg-gray-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Category Breakdown */}
              <div
                className={`lg:col-span-2 ${cardBg} ${cardBorder} rounded-xl p-6`}
              >
                <h3 className={`font-bold ${textPrimary} mb-6`}>
                  Providers by Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analytics.topCategories
                    .slice(0, 8)
                    .map((category, index) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            categoryColors[index % categoryColors.length]
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${textPrimary} truncate`}
                          >
                            {category.name}
                          </p>
                          <p className={`text-xs ${textMuted}`}>
                            {category.providerCount} providers
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium ${textSecondary}`}
                        >
                          {category.percentage.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Top Vendors Table */}
            <div
              className={`${cardBg} ${cardBorder} rounded-xl overflow-hidden`}
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h3 className={`font-bold ${textPrimary}`}>
                  Top Performing Vendors
                </h3>
                <p className={`text-sm ${textMuted}`}>
                  Vendors with highest bookings and revenue
                </p>
              </div>

              {analytics.topProviders.length === 0 ? (
                <div className="p-8 text-center">
                  <p className={textMuted}>No vendor data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={darkMode ? "bg-white/5" : "bg-gray-50"}>
                        <th
                          className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                        >
                          Rank
                        </th>
                        <th
                          className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                        >
                          Vendor
                        </th>
                        <th
                          className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                        >
                          Bookings
                        </th>
                        <th
                          className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                        >
                          Revenue
                        </th>
                        <th
                          className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                        >
                          Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-white/5" : "divide-gray-100"
                      }`}
                    >
                      {analytics.topProviders.map((vendor, index) => (
                        <tr
                          key={vendor.id}
                          className={`${
                            darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : index === 1
                                  ? "bg-gray-400/10 text-gray-400"
                                  : index === 2
                                  ? "bg-orange-500/10 text-orange-500"
                                  : darkMode
                                  ? "bg-white/5 text-gray-400"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td
                            className={`px-6 py-4 text-sm font-medium ${textPrimary}`}
                          >
                            {vendor.businessName}
                          </td>
                          <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                            {vendor.bookingCount}
                          </td>
                          <td
                            className={`px-6 py-4 text-sm font-medium ${textPrimary}`}
                          >
                            {formatCurrency(vendor.totalRevenue)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span
                                className={`text-sm font-medium ${textPrimary}`}
                              >
                                {vendor.averageRating.toFixed(1)}
                              </span>
                              <span className={`text-xs ${textMuted}`}>
                                ({vendor.reviewCount})
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={`${cardBg} ${cardBorder} rounded-xl p-8 text-center`}>
            <svg
              className={`w-16 h-16 mx-auto ${textMuted}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className={`mt-4 ${textMuted}`}>No analytics data available</p>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
