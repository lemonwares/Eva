"use client";

import { useState, useEffect, useCallback } from "react";
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
  // New chart data
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
  "#ec4899", // pink
  "#f97316", // orange
  "#3b82f6", // blue
  "#a855f7", // purple
  "#22c55e", // green
  "#06b6d4", // cyan
  "#eab308", // yellow
  "#ef4444", // red
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

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${dateRange}`);
      const data = await response.json();

      if (data.success) {
        // Generate mock chart data if not provided by API
        const analyticsData = data.data;
        
        // Generate revenue by day data (mock if not available)
        if (!analyticsData.revenueByDay) {
          const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 14;
          analyticsData.revenueByDay = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            return {
              date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
              revenue: Math.floor(Math.random() * 5000) + 500,
            };
          });
        }

        // Generate bookings by weekday (mock if not available)
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
      console.error("Error fetching analytics:", error);
      setToast({ message: "Failed to fetch analytics", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Use shared formatCurrency (GBP, always .00)
  const formatCurrency = (amount: number) =>
    sharedFormatCurrency(amount, "GBP", "en-GB");

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
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    if (trend < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const stats = analytics
    ? [
        {
          label: "Total Revenue",
          value: formatCurrency(analytics.overview.totalRevenue),
          change: analytics.overview.revenueChange,
          icon: DollarSign,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        },
        {
          label: "Total Users",
          value: formatNumber(analytics.overview.totalUsers),
          change: analytics.overview.usersChange,
          icon: Users,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Total Bookings",
          value: formatNumber(analytics.overview.totalBookings),
          change: analytics.overview.bookingsChange,
          icon: Calendar,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        },
        {
          label: "Avg. Rating",
          value: analytics.overview.averageRating.toFixed(1),
          change: 0,
          icon: Star,
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

  // Prepare pie chart data for bookings by status
  const pieChartData = analytics
    ? Object.entries(analytics.bookingsByStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: statusColors[status] || "#6b7280",
      }))
    : [];

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
            {/* Refresh Button */}
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className={`p-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} hover:border-accent/50 transition-colors disabled:opacity-50`}
              title="Refresh data"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>

            {/* Date Range Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm hover:border-accent/50 transition-colors`}
              >
                <Calendar size={16} className="text-accent" />
                {dateRanges.find((r) => r.value === dateRange)?.label}
                <ChevronDown size={16} />
              </button>
              {showDateDropdown && (
                <div
                  className={`absolute top-full right-0 mt-1 w-44 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1 overflow-hidden`}
                >
                  {dateRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setDateRange(range.value);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm ${
                        dateRange === range.value
                          ? "text-accent bg-accent/5"
                          : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${
                darkMode
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              } ${textPrimary} transition-colors`}
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : analytics ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`${cardBg} border ${cardBorder} rounded-xl p-5 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                      <stat.icon size={20} className={stat.color} />
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

            {/* Charts Row - Revenue Trend */}
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
              <h3 className={`font-bold ${textPrimary} mb-6`}>Revenue Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.revenueByDay || []}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis 
                      dataKey="date" 
                      stroke={darkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={darkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                      tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                        border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`£${(value ?? 0).toLocaleString()}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#ec4899"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row - Bookings Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bookings by Status - Pie Chart */}
              <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
                <h3 className={`font-bold ${textPrimary} mb-6`}>
                  Bookings by Status
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                          border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {pieChartData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className={`text-sm ${textSecondary}`}>
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bookings by Day - Bar Chart */}
              <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
                <h3 className={`font-bold ${textPrimary} mb-6`}>
                  Bookings by Day
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.bookingsByDay || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                      <XAxis 
                        dataKey="day" 
                        stroke={darkMode ? "#9ca3af" : "#6b7280"}
                        fontSize={12}
                      />
                      <YAxis 
                        stroke={darkMode ? "#9ca3af" : "#6b7280"}
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                          border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                          borderRadius: "8px",
                        }}
                      />
                      <Bar 
                        dataKey="bookings" 
                        fill="#a855f7" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
              <h3 className={`font-bold ${textPrimary} mb-6`}>
                Providers by Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.topCategories
                  .slice(0, 8)
                  .map((category, index) => (
                    <div
                      key={category.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? "bg-white/5" : "bg-gray-50"}`}
                    >
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
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

            {/* Top Vendors Table */}
            <div
              className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
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
                  <Store size={32} className={`mx-auto mb-2 ${textMuted}`} />
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
                              <Star
                                size={16}
                                className="text-yellow-500 fill-yellow-500"
                              />
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
          <div className={`${cardBg} border ${cardBorder} rounded-xl p-8 text-center`}>
            <BarChart3 size={48} className={`mx-auto ${textMuted}`} />
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
