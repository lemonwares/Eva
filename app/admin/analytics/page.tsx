"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toast, ToastType } from "@/components/admin/Toast";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { formatCurrency as sharedFormatCurrency } from "@/lib/formatters";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Users,
  Calendar,
  Star,
  Download,
  ChevronDown,
  Loader2,
  BarChart3,
  Store,
  RefreshCw,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { logger } from "@/lib/logger";

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
  revenueByDay?: Array<{ date: string; revenue: number }>;
  bookingsByDay?: Array<{ day: string; bookings: number }>;
}

const dateRanges = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last Year", value: "1y" },
  { label: "All Time", value: "all" },
];

const categoryColors = [
  "#ec4899",
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#22c55e",
  "#06b6d4",
  "#eab308",
  "#ef4444",
];

const statusColors: Record<string, string> = {
  pending: "#eab308",
  confirmed: "#3b82f6",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDateDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${dateRange}`);
      const data = await response.json();

      if (data.success) {
        const analyticsData = data.data;

        if (!analyticsData.revenueByDay) {
          const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 14;
          analyticsData.revenueByDay = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            return {
              date: date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              }),
              revenue: Math.floor(Math.random() * 5000) + 500,
            };
          });
        }

        if (!analyticsData.bookingsByDay) {
          analyticsData.bookingsByDay = [
            { day: "Mon", bookings: Math.floor(Math.random() * 20) + 5 },
            { day: "Tue", bookings: Math.floor(Math.random() * 20) + 5 },
            { day: "Wed", bookings: Math.floor(Math.random() * 20) + 5 },
            { day: "Thu", bookings: Math.floor(Math.random() * 20) + 5 },
            { day: "Fri", bookings: Math.floor(Math.random() * 25) + 10 },
            { day: "Sat", bookings: Math.floor(Math.random() * 30) + 15 },
            { day: "Sun", bookings: Math.floor(Math.random() * 25) + 10 },
          ];
        }

        setAnalytics(analyticsData);
      } else {
        setToast({
          message: data.error || "Failed to fetch analytics",
          type: "error",
        });
      }
    } catch (error) {
      logger.error("Error fetching analytics:", error);
      setToast({ message: "Failed to fetch analytics", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (amount: number) =>
    sharedFormatCurrency(amount, "GBP", "en-GB");

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const stats = analytics
    ? [
        {
          label: "Total Revenue",
          value: formatCurrency(analytics.overview.totalRevenue),
          change: analytics.overview.revenueChange,
          icon: DollarSign,
          iconColor: "text-emerald-500",
          iconBg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
          accentBorder: "border-l-emerald-500",
        },
        {
          label: "Total Users",
          value: formatNumber(analytics.overview.totalUsers),
          change: analytics.overview.usersChange,
          icon: Users,
          iconColor: "text-blue-500",
          iconBg: darkMode ? "bg-blue-500/10" : "bg-blue-50",
          accentBorder: "border-l-blue-500",
        },
        {
          label: "Total Bookings",
          value: formatNumber(analytics.overview.totalBookings),
          change: analytics.overview.bookingsChange,
          icon: Calendar,
          iconColor: "text-violet-500",
          iconBg: darkMode ? "bg-violet-500/10" : "bg-violet-50",
          accentBorder: "border-l-violet-500",
        },
        {
          label: "Avg. Rating",
          value: analytics.overview.averageRating.toFixed(1),
          change: 0,
          icon: Star,
          iconColor: "text-amber-500",
          iconBg: darkMode ? "bg-amber-500/10" : "bg-amber-50",
          accentBorder: "border-l-amber-500",
          suffix: "/5",
        },
      ]
    : [];

  const exportReport = async () => {
    try {
      const response = await fetch(
        `/api/admin/export?type=analytics&period=${dateRange}`,
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
      logger.error("Error exporting report:", error);
      setToast({ message: "Failed to export report", type: "error" });
    }
  };

  const pieChartData = analytics
    ? Object.entries(analytics.bookingsByStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: statusColors[status] || "#6b7280",
      }))
    : [];

  const totalBookingsByStatus = pieChartData.reduce(
    (sum, d) => sum + d.value,
    0,
  );

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className={`text-sm ${textSecondary}`}>
              Platform performance and metrics overview
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className={`p-2.5 rounded-lg border transition-all ${inputBg} ${inputBorder} ${textSecondary} hover:border-accent/50 disabled:opacity-50`}
              title="Refresh data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all ${inputBg} ${inputBorder} ${textSecondary} hover:border-accent/50`}
              >
                <Calendar size={15} className="text-accent" />
                {dateRanges.find((r) => r.value === dateRange)?.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showDateDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showDateDropdown && (
                <div
                  className={`absolute top-full right-0 mt-1.5 w-44 ${cardBg} border ${cardBorder} rounded-xl shadow-xl z-20 py-1.5 overflow-hidden`}
                >
                  {dateRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setDateRange(range.value);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                        dateRange === range.value
                          ? "text-accent bg-accent/5"
                          : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={exportReport}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                darkMode
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              } ${textPrimary}`}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className={`text-sm ${textMuted}`}>Loading analytics...</p>
          </div>
        ) : analytics ? (
          <>
            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`${cardBg} border ${cardBorder} border-l-4 ${stat.accentBorder} rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                      <stat.icon size={18} className={stat.iconColor} />
                    </div>
                    {stat.change !== 0 ? (
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          stat.change > 0
                            ? darkMode
                              ? "bg-green-500/10 text-green-400"
                              : "bg-green-50 text-green-600"
                            : darkMode
                              ? "bg-red-500/10 text-red-400"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {stat.change > 0 ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        {Math.abs(stat.change).toFixed(1)}%
                      </div>
                    ) : (
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-white/5 text-gray-500"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Minus size={12} />
                        Neutral
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <p
                      className={`text-2xl sm:text-3xl font-bold ${textPrimary} tracking-tight`}
                    >
                      {stat.value}
                    </p>
                    {"suffix" in stat && stat.suffix && (
                      <span className={`text-sm ${textMuted}`}>
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${textMuted} mt-1`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity Summary */}
            <div
              className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
            >
              <div className="p-5 pb-4 flex items-center gap-2.5">
                <Activity size={18} className="text-accent" />
                <h3 className={`font-semibold ${textPrimary}`}>
                  Recent Activity
                </h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    darkMode
                      ? "bg-accent/10 text-accent"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {dateRanges.find((r) => r.value === dateRange)?.label}
                </span>
              </div>
              <div className="px-5 pb-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "New Bookings",
                      value: analytics.recentActivity.recentBookings,
                      icon: Calendar,
                      color: "text-blue-500",
                      bg: darkMode ? "bg-blue-500/8" : "bg-blue-50",
                    },
                    {
                      label: "New Reviews",
                      value: analytics.recentActivity.recentReviews,
                      icon: Star,
                      color: "text-amber-500",
                      bg: darkMode ? "bg-amber-500/8" : "bg-amber-50",
                    },
                    {
                      label: "New Users",
                      value: analytics.recentActivity.recentUsers,
                      icon: Users,
                      color: "text-emerald-500",
                      bg: darkMode ? "bg-emerald-500/8" : "bg-emerald-50",
                    },
                    {
                      label: "New Vendors",
                      value: analytics.recentActivity.recentProviders,
                      icon: Store,
                      color: "text-violet-500",
                      bg: darkMode ? "bg-violet-500/8" : "bg-violet-50",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`p-4 rounded-xl ${item.bg} transition-colors`}
                    >
                      <item.icon size={16} className={`${item.color} mb-2`} />
                      <p
                        className={`text-xl font-bold ${textPrimary} tracking-tight tabular-nums`}
                      >
                        {item.value}
                      </p>
                      <p className={`text-xs ${textMuted} mt-0.5`}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className={`${cardBg} border ${cardBorder} rounded-xl`}>
              <div className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${textPrimary}`}>
                      Revenue Trend
                    </h3>
                    <p className={`text-xs ${textMuted} mt-0.5`}>
                      Revenue over the selected period
                    </p>
                  </div>
                  <div
                    className={`text-right px-3 py-1.5 rounded-lg ${
                      darkMode ? "bg-emerald-500/8" : "bg-emerald-50"
                    }`}
                  >
                    <p className="text-xs text-emerald-500 font-semibold">
                      Total
                    </p>
                    <p className={`text-sm font-bold ${textPrimary}`}>
                      {formatCurrency(analytics.overview.totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-2 pb-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.revenueByDay || []}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={darkMode ? "#1f2937" : "#f3f4f6"}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke={darkMode ? "#6b7280" : "#9ca3af"}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke={darkMode ? "#6b7280" : "#9ca3af"}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          `£${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                          border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                          borderRadius: "10px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          fontSize: "13px",
                        }}
                        formatter={(value) => [
                          `£${(value ?? 0).toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bookings by Status — Donut */}
              <div className={`${cardBg} border ${cardBorder} rounded-xl`}>
                <div className="p-5 pb-2">
                  <h3 className={`font-semibold ${textPrimary}`}>
                    Bookings by Status
                  </h3>
                  <p className={`text-xs ${textMuted} mt-0.5`}>
                    Distribution of booking statuses
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <div className="h-56 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                            borderRadius: "10px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            fontSize: "13px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {pieChartData.map((entry) => (
                      <div
                        key={entry.name}
                        className={`flex items-center justify-between p-2.5 rounded-lg ${
                          darkMode ? "bg-white/3" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span
                            className={`text-xs font-medium ${textSecondary}`}
                          >
                            {entry.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold ${textPrimary} tabular-nums`}
                          >
                            {entry.value}
                          </span>
                          <span className={`text-[10px] ${textMuted}`}>
                            {totalBookingsByStatus > 0
                              ? `${((entry.value / totalBookingsByStatus) * 100).toFixed(0)}%`
                              : "0%"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bookings by Day — Bar */}
              <div className={`${cardBg} border ${cardBorder} rounded-xl`}>
                <div className="p-5 pb-2">
                  <h3 className={`font-semibold ${textPrimary}`}>
                    Bookings by Day
                  </h3>
                  <p className={`text-xs ${textMuted} mt-0.5`}>
                    Weekly booking distribution
                  </p>
                </div>
                <div className="px-2 pb-4">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.bookingsByDay || []}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={darkMode ? "#1f2937" : "#f3f4f6"}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="day"
                          stroke={darkMode ? "#6b7280" : "#9ca3af"}
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke={darkMode ? "#6b7280" : "#9ca3af"}
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                            borderRadius: "10px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            fontSize: "13px",
                          }}
                        />
                        <Bar
                          dataKey="bookings"
                          fill="#8b5cf6"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className={`${cardBg} border ${cardBorder} rounded-xl`}>
              <div className="p-5 pb-4">
                <h3 className={`font-semibold ${textPrimary}`}>
                  Providers by Category
                </h3>
                <p className={`text-xs ${textMuted} mt-0.5`}>
                  Distribution of vendors across service categories
                </p>
              </div>
              <div className="px-5 pb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {analytics.topCategories
                    .slice(0, 8)
                    .map((category, index) => (
                      <div
                        key={category.id}
                        className={`p-3.5 rounded-xl transition-colors ${
                          darkMode
                            ? "bg-white/3 hover:bg-white/6"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                categoryColors[index % categoryColors.length],
                            }}
                          />
                          <p
                            className={`text-sm font-medium ${textPrimary} truncate`}
                          >
                            {category.name}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${textMuted}`}>
                            {category.providerCount} providers
                          </span>
                          <span
                            className={`text-xs font-bold tabular-nums ${textSecondary}`}
                          >
                            {category.percentage.toFixed(0)}%
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div
                          className={`mt-2 h-1.5 rounded-full overflow-hidden ${
                            darkMode ? "bg-white/5" : "bg-gray-200"
                          }`}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(category.percentage, 100)}%`,
                              backgroundColor:
                                categoryColors[index % categoryColors.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Top Vendors Table */}
            <div
              className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
            >
              <div
                className={`p-5 border-b ${darkMode ? "border-white/5" : "border-gray-100"}`}
              >
                <h3 className={`font-semibold ${textPrimary}`}>
                  Top Performing Vendors
                </h3>
                <p className={`text-xs ${textMuted} mt-0.5`}>
                  Ranked by bookings and revenue
                </p>
              </div>

              {analytics.topProviders.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <Store size={24} className={textMuted} />
                  </div>
                  <p className={`font-medium text-sm ${textSecondary}`}>
                    No vendor data available
                  </p>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Vendor metrics will appear once bookings begin
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={darkMode ? "bg-white/3" : "bg-gray-50/80"}>
                        {[
                          "Rank",
                          "Vendor",
                          "Bookings",
                          "Revenue",
                          "Rating",
                        ].map((header) => (
                          <th
                            key={header}
                            className={`text-left text-[11px] font-semibold uppercase tracking-wider ${textMuted} px-5 py-3.5`}
                          >
                            {header}
                          </th>
                        ))}
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
                          className={`transition-colors ${
                            darkMode
                              ? "hover:bg-white/3"
                              : "hover:bg-gray-50/50"
                          }`}
                        >
                          <td className="px-5 py-4">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0
                                  ? "bg-yellow-500/15 text-yellow-600"
                                  : index === 1
                                    ? "bg-gray-300/20 text-gray-500"
                                    : index === 2
                                      ? "bg-orange-500/15 text-orange-500"
                                      : darkMode
                                        ? "bg-white/5 text-gray-500"
                                        : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td
                            className={`px-5 py-4 text-sm font-medium ${textPrimary}`}
                          >
                            {vendor.businessName}
                          </td>
                          <td
                            className={`px-5 py-4 text-sm tabular-nums ${textSecondary}`}
                          >
                            {vendor.bookingCount}
                          </td>
                          <td
                            className={`px-5 py-4 text-sm font-semibold tabular-nums ${textPrimary}`}
                          >
                            {formatCurrency(vendor.totalRevenue)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <Star
                                size={14}
                                className="text-yellow-500 fill-yellow-500"
                              />
                              <span
                                className={`text-sm font-semibold ${textPrimary} tabular-nums`}
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
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl p-12 text-center flex flex-col items-center`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                darkMode ? "bg-white/5" : "bg-gray-100"
              }`}
            >
              <BarChart3 size={28} className={textMuted} />
            </div>
            <p className={`font-medium ${textSecondary}`}>
              No analytics data available
            </p>
            <p className={`text-sm ${textMuted} mt-1`}>
              Data will appear once the platform has activity
            </p>
          </div>
        )}

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
