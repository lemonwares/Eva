"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
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
} from "lucide-react";

const performanceMetrics = [
  { label: "Response Rate", value: "94%", change: "+2%", trend: "up" },
  { label: "Avg Response Time", value: "2.4h", change: "-15min", trend: "up" },
  { label: "Booking Rate", value: "68%", change: "+5%", trend: "up" },
  { label: "Repeat Clients", value: "32%", change: "+8%", trend: "up" },
];

const topServices = [
  { name: "Gold Wedding Package", bookings: 24, revenue: "$108,000" },
  { name: "Platinum DJ Set", bookings: 18, revenue: "$57,600" },
  { name: "Standard Photography", bookings: 31, revenue: "$55,800" },
  { name: "Silver Package", bookings: 15, revenue: "$41,250" },
];

const monthlyData = [
  { month: "Jun", revenue: 12500 },
  { month: "Jul", revenue: 15800 },
  { month: "Aug", revenue: 18200 },
  { month: "Sep", revenue: 16400 },
  { month: "Oct", revenue: 21300 },
  { month: "Nov", revenue: 18750 },
];

export default function VendorAnalyticsPage() {
  const { darkMode } = useVendorTheme();
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <VendorLayout title="Analytics">
      {/* Date Range Filter */}
      <div className="flex justify-end mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
            darkMode
              ? "bg-[#141414] border-white/10 text-white hover:bg-white/10"
              : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
          } border transition-colors text-sm`}
        >
          <CalendarDays size={18} />
          <span>Last 6 Months</span>
          <ChevronDown size={16} />
        </button>
      </div>

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
            <span className="text-gray-500 text-sm">Total Revenue</span>
            <div className="p-2 rounded-lg bg-green-500/20">
              <DollarSign size={18} className="text-green-400" />
            </div>
          </div>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            $156,320
          </p>
          <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
            <ArrowUpRight size={14} />
            +18.5% vs last period
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
            8,432
          </p>
          <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
            <ArrowUpRight size={14} />
            +24% vs last period
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
            <span className="text-gray-500 text-sm">Total Inquiries</span>
            <div className="p-2 rounded-lg bg-accent/20">
              <MessageSquare size={18} className="text-accent" />
            </div>
          </div>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            342
          </p>
          <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
            <ArrowUpRight size={14} />
            +12% vs last period
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
            4.9
          </p>
          <p
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } text-sm flex items-center gap-1 mt-2`}
          >
            <Users size={14} />
            Based on 156 reviews
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div
        className={`${
          darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"
        } rounded-xl border p-5 mb-6`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } font-semibold`}
            >
              Revenue Overview
            </h3>
            <p className="text-gray-500 text-sm">
              Monthly revenue for the last 6 months
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm`}
              >
                Revenue
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
          {monthlyData.map((data, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-linear-to-t from-accent/80 to-accent rounded-t-lg transition-all hover:from-accent hover:to-accent/80"
                style={{
                  height: `${(data.revenue / maxRevenue) * 100}%`,
                  minHeight: "20px",
                }}
              />
              <span className="text-gray-500 text-xs sm:text-sm">
                {data.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Metrics */}
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
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
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
                  <span
                    className={`flex items-center gap-1 text-sm ${
                      metric.trend === "up" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
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
            Top Services
          </h3>
          <div className="space-y-4">
            {topServices.map((service, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? "bg-white/5" : "bg-gray-50"
                }`}
              >
                <div>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {service.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {service.bookings} bookings
                  </p>
                </div>
                <span className="font-bold text-green-400">
                  {service.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiry Sources */}
      <div
        className={`${
          darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"
        } rounded-xl border p-5`}
      >
        <h3
          className={`${
            darkMode ? "text-white" : "text-gray-900"
          } font-semibold mb-4`}
        >
          Inquiry Sources
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-white/5" : "bg-gray-50"
            } text-center`}
          >
            <p className="text-2xl font-bold text-accent mb-1">45%</p>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              EVA Search
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-white/5" : "bg-gray-50"
            } text-center`}
          >
            <p className="text-2xl font-bold text-blue-400 mb-1">28%</p>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              Direct Profile
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-white/5" : "bg-gray-50"
            } text-center`}
          >
            <p className="text-2xl font-bold text-green-400 mb-1">18%</p>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              Referrals
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-white/5" : "bg-gray-50"
            } text-center`}
          >
            <p className="text-2xl font-bold text-yellow-400 mb-1">9%</p>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              Social Media
            </p>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
