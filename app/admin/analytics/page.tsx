"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Download,
} from "lucide-react";
import { useState } from "react";

const stats = [
  {
    label: "Total Revenue",
    value: "$847,320",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Total Users",
    value: "24,582",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Total Bookings",
    value: "12,847",
    change: "+15.3%",
    trend: "up",
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    label: "Avg. Rating",
    value: "4.8",
    change: "-0.2%",
    trend: "down",
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
];

const revenueData = [
  { month: "Jan", revenue: 45000, bookings: 890 },
  { month: "Feb", revenue: 52000, bookings: 1020 },
  { month: "Mar", revenue: 48000, bookings: 950 },
  { month: "Apr", revenue: 61000, bookings: 1180 },
  { month: "May", revenue: 55000, bookings: 1100 },
  { month: "Jun", revenue: 67000, bookings: 1320 },
  { month: "Jul", revenue: 72000, bookings: 1450 },
  { month: "Aug", revenue: 69000, bookings: 1380 },
  { month: "Sep", revenue: 78000, bookings: 1520 },
  { month: "Oct", revenue: 82000, bookings: 1620 },
  { month: "Nov", revenue: 88000, bookings: 1750 },
  { month: "Dec", revenue: 95000, bookings: 1890 },
];

const topVendors = [
  {
    name: "Elegant Events Co.",
    bookings: 342,
    revenue: "$85,240",
    rating: 4.9,
  },
  { name: "Party Perfect", bookings: 298, revenue: "$72,150", rating: 4.8 },
  { name: "Dream Weddings", bookings: 276, revenue: "$68,920", rating: 4.9 },
  { name: "Corporate Elite", bookings: 254, revenue: "$64,580", rating: 4.7 },
  { name: "Festive Catering", bookings: 231, revenue: "$58,320", rating: 4.8 },
];

const topCategories = [
  { name: "Wedding Planning", percentage: 28, color: "bg-pink-500" },
  { name: "Catering", percentage: 22, color: "bg-orange-500" },
  { name: "Photography", percentage: 18, color: "bg-blue-500" },
  { name: "Venue Rental", percentage: 15, color: "bg-purple-500" },
  { name: "Entertainment", percentage: 10, color: "bg-green-500" },
  { name: "Others", percentage: 7, color: "bg-gray-500" },
];

const dateRanges = [
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "Last Year",
  "All Time",
];

export default function AdminAnalyticsPage() {
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
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <AdminLayout
      title="Analytics"
      actionButton={{
        label: "Export Report",
        onClick: () => {},
        icon: <Download size={18} />,
        variant: "secondary",
      }}
    >
      {/* Date Range Selector */}
      <div className="flex justify-end mb-6">
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm`}
          >
            {dateRange}
            <ChevronDown size={16} />
          </button>
          {showDateDropdown && (
            <div
              className={`absolute top-full right-0 mt-1 w-40 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
            >
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setShowDateDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    dateRange === range ? "text-accent" : textSecondary
                  } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${cardBg} border ${cardBorder} rounded-xl p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                {stat.change}
              </div>
            </div>
            <p className={`text-2xl font-bold ${textPrimary} mb-1`}>
              {stat.value}
            </p>
            <p className={`text-sm ${textMuted}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div
          className={`lg:col-span-2 ${cardBg} border ${cardBorder} rounded-xl p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`font-bold ${textPrimary}`}>Revenue Overview</h3>
              <p className={`text-sm ${textMuted}`}>Monthly revenue trend</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className={`text-xs ${textMuted}`}>Revenue</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-48 gap-2">
            {revenueData.map((data, index) => (
              <div
                key={data.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-accent rounded-t-md transition-all hover:opacity-80"
                  style={{
                    height: `${(data.revenue / maxRevenue) * 100}%`,
                  }}
                ></div>
                <span className={`text-xs ${textMuted}`}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-6`}>
          <h3 className={`font-bold ${textPrimary} mb-6`}>
            Bookings by Category
          </h3>

          <div className="space-y-4">
            {topCategories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${textSecondary}`}>
                    {category.name}
                  </span>
                  <span className={`text-sm font-medium ${textPrimary}`}>
                    {category.percentage}%
                  </span>
                </div>
                <div
                  className={`h-2 rounded-full ${
                    darkMode ? "bg-white/10" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
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
        <div className="p-6 border-b border-gray-100 dark:border-white/5">
          <h3 className={`font-bold ${textPrimary}`}>Top Performing Vendors</h3>
          <p className={`text-sm ${textMuted}`}>
            Vendors with highest bookings and revenue
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
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
              {topVendors.map((vendor, index) => (
                <tr
                  key={vendor.name}
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
                    {vendor.name}
                  </td>
                  <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                    {vendor.bookings}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${textPrimary}`}
                  >
                    {vendor.revenue}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={14}
                        className="text-yellow-500"
                        fill="currentColor"
                      />
                      <span className={`text-sm font-medium ${textPrimary}`}>
                        {vendor.rating}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
