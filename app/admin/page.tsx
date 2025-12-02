"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// Stats data
const stats = [
  {
    label: "Total Bookings",
    value: "1,234",
    change: "+5.2%",
    trend: "up",
    period: "last 30 days",
  },
  {
    label: "Revenue Generated",
    value: "$98,765",
    change: "+12.8%",
    trend: "up",
    period: "last 30 days",
  },
  {
    label: "New User Signups",
    value: "567",
    change: "+3.1%",
    trend: "up",
    period: "last 30 days",
  },
  {
    label: "Pending Vendor Approvals",
    value: "12",
    subtext: "Awaiting review",
    isAction: true,
  },
];

// Action items
const actionItems = [
  {
    type: "error",
    title: "Failed Payment",
    description: "Booking #BK7885 for $250.00 failed.",
    icon: AlertCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    type: "warning",
    title: "High-Priority Ticket",
    description: "Support ticket #T1023 requires attention.",
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    type: "info",
    title: "System Update",
    description: "A new system update is scheduled for tonight.",
    icon: Info,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
];

// Recent bookings
const recentBookings = [
  {
    id: "#BK7890",
    user: "Alex Morgan",
    vendor: "City Catering Co.",
    date: "2024-07-28",
    status: "Confirmed",
    statusColor: "bg-green-500",
  },
  {
    id: "#BK7889",
    user: "Casey Jordan",
    vendor: "Downtown Hall",
    date: "2024-07-27",
    status: "Confirmed",
    statusColor: "bg-green-500",
  },
  {
    id: "#BK7888",
    user: "Sam Rivera",
    vendor: "The Jazz Trio",
    date: "2024-07-26",
    status: "Pending",
    statusColor: "bg-amber-500",
  },
  {
    id: "#BK7887",
    user: "Pat Kim",
    vendor: "Bloom Florals",
    date: "2024-07-26",
    status: "Cancelled",
    statusColor: "bg-red-500",
  },
  {
    id: "#BK7886",
    user: "Taylor Smith",
    vendor: "City Catering Co.",
    date: "2024-07-25",
    status: "Confirmed",
    statusColor: "bg-green-500",
  },
];

// Top vendor categories
const vendorCategories = [
  { name: "Photography", count: 245, color: "#ec4899" },
  { name: "Catering", count: 198, color: "#f97316" },
  { name: "Venues", count: 156, color: "#a855f7" },
  { name: "Entertainment", count: 142, color: "#3b82f6" },
  { name: "Florists", count: 89, color: "#22c55e" },
  { name: "Other", count: 60, color: "#6b7280" },
];

const totalVendors = vendorCategories.reduce((sum, cat) => sum + cat.count, 0);

export default function AdminOverviewPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
  } = useAdminTheme();

  return (
    <AdminLayout title="Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${cardBg} border ${cardBorder} rounded-xl p-5 transition-all hover:shadow-md`}
          >
            <p className={`text-sm ${textMuted} mb-1`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${textPrimary} mb-2`}>
              {stat.value}
            </p>
            {stat.change ? (
              <div className="flex items-center gap-1.5">
                {stat.trend === "up" ? (
                  <TrendingUp size={16} className="text-green-500" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
                <span className={`text-sm ${textMuted}`}>{stat.period}</span>
              </div>
            ) : stat.isAction ? (
              <div className="flex items-center gap-1.5">
                <ArrowRight size={14} className="text-accent" />
                <span className="text-sm text-accent">{stat.subtext}</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Charts & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Booking Volume Chart */}
        <div
          className={`lg:col-span-2 ${cardBg} border ${cardBorder} rounded-xl p-5`}
        >
          <h3 className={`font-semibold ${textPrimary} mb-4`}>
            Booking Volume
          </h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {/* Simplified chart bars */}
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
              (height, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-linear-to-t from-accent to-pink-500 rounded-t-sm transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            )}
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${textMuted}`}>Jan</span>
            <span className={`text-xs ${textMuted}`}>Dec</span>
          </div>
        </div>

        {/* Action Required */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-5`}>
          <h3 className={`font-semibold ${textPrimary} mb-4`}>
            Action Required
          </h3>
          <div className="space-y-3">
            {actionItems.map((item, idx) => (
              <div
                key={idx}
                className={`${item.bgColor} border ${item.borderColor} rounded-lg p-3 cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <div className="flex items-start gap-3">
                  <item.icon size={18} className={item.color} />
                  <div>
                    <p className={`font-medium text-sm ${item.color}`}>
                      {item.title}
                    </p>
                    <p className={`text-xs ${textMuted} mt-0.5`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Vendor Categories - Donut Chart */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-5`}>
          <h3 className={`font-semibold ${textPrimary} mb-4`}>
            Top Vendor Categories
          </h3>

          {/* Donut Chart */}
          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {
                vendorCategories.reduce(
                  (acc, cat, idx) => {
                    const percentage = (cat.count / totalVendors) * 100;
                    const strokeDasharray = `${percentage * 2.51} ${
                      251.2 - percentage * 2.51
                    }`;
                    const strokeDashoffset = -acc.offset * 2.51;
                    acc.elements.push(
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="12"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                      />
                    );
                    acc.offset += percentage;
                    return acc;
                  },
                  { elements: [] as React.ReactNode[], offset: 0 }
                ).elements
              }
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${textPrimary}`}>
                {totalVendors}
              </span>
              <span className={`text-xs ${textMuted}`}>Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {vendorCategories.slice(0, 4).map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className={`text-xs ${textSecondary}`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div
          className={`lg:col-span-2 ${cardBg} border ${cardBorder} rounded-xl p-5`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${textPrimary}`}>Recent Bookings</h3>
            <button className="text-accent text-sm font-medium flex items-center gap-1 hover:underline">
              View All <ChevronRight size={16} />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left text-xs uppercase ${textMuted}`}>
                  <th className="pb-3 font-medium">Booking ID</th>
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Vendor</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-white/5" : "divide-gray-100"
                }`}
              >
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`${
                      darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <td className={`py-3 text-sm font-medium ${textPrimary}`}>
                      {booking.id}
                    </td>
                    <td className={`py-3 text-sm ${textSecondary}`}>
                      {booking.user}
                    </td>
                    <td className={`py-3 text-sm ${textSecondary}`}>
                      {booking.vendor}
                    </td>
                    <td className={`py-3 text-sm ${textMuted}`}>
                      {booking.date}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white ${booking.statusColor}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
