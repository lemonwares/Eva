"use client";

import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  ChevronDown,
  Download,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: MessageSquare, label: "Inquiries", active: false },
  { icon: BarChart3, label: "Analytics", active: true },
  { icon: User, label: "Profile", active: false },
];

const stats = [
  {
    label: "Total Inquiries",
    value: "1,230",
    change: "+5%",
    changePositive: true,
  },
  {
    label: "Quotes Sent",
    value: "890",
    change: "-2%",
    changePositive: false,
  },
  {
    label: "Bookings Confirmed",
    value: "215",
    change: "+12%",
    changePositive: true,
  },
  {
    label: "Estimated Revenue",
    value: "$54,800",
    change: "+15%",
    changePositive: true,
  },
];

const inquirySources = [
  { label: "EVA Search", percentage: 60, color: "bg-blue-500" },
  { label: "Direct", percentage: 25, color: "bg-green-400" },
  { label: "Social Media", percentage: 15, color: "bg-pink-500" },
];

const topServices = [
  {
    name: "Full Day Wedding Photography",
    inquiries: 450,
    bookings: 95,
    conversionRate: "21.1%",
  },
  {
    name: "Corporate Event DJ",
    inquiries: 310,
    bookings: 62,
    conversionRate: "20.0%",
  },
  {
    name: "Premium Catering Package",
    inquiries: 220,
    bookings: 35,
    conversionRate: "15.9%",
  },
  {
    name: "Elopement Videography",
    inquiries: 150,
    bookings: 23,
    conversionRate: "15.3%",
  },
];

export default function VendorAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-56 bg-[#0a0a0a] border-r border-gray-800 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & Vendor */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-pink-500" />
              <div>
                <p className="font-bold text-sm">Eva Vendor</p>
                <p className="text-gray-500 text-xs">Vendor Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-2">
          {sidebarItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                item.active
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Settings */}
        <div className="p-3 border-t border-gray-800">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a] border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Analytics
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white text-sm">
                <span className="hidden sm:inline">Last 30 Days</span>
                <span className="sm:hidden">30 Days</span>
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white text-sm">
                <span className="hidden sm:inline">This Quarter</span>
                <span className="sm:hidden">Quarter</span>
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 transition-colors">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5 border border-gray-800"
              >
                <p className="text-gray-500 text-xs sm:text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
                  {stat.value}
                </p>
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    stat.changePositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Performance Over Time */}
            <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-4 sm:mb-6">
                Performance Over Time
              </h3>
              {/* Chart Placeholder */}
              <div className="h-48 sm:h-64 relative">
                {/* Y-axis lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b border-gray-800 w-full" />
                  ))}
                </div>
                {/* Chart Line SVG */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 200"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0 150 Q 30 80 60 100 T 120 60 T 180 120 T 240 40 T 300 80 T 360 100 T 400 70"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />
                </svg>
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-gray-500 text-xs sm:text-sm pt-4 translate-y-6">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>

            {/* Inquiry Sources */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-4 sm:mb-6">
                Inquiry Sources
              </h3>
              {/* Donut Chart */}
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Blue - 60% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeDasharray="150.8 251.2"
                      strokeDashoffset="0"
                    />
                    {/* Green - 25% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="12"
                      strokeDasharray="62.8 251.2"
                      strokeDashoffset="-150.8"
                    />
                    {/* Pink - 15% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="12"
                      strokeDasharray="37.7 251.2"
                      strokeDashoffset="-213.6"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold">1.2k</span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      Total
                    </span>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-3">
                {inquirySources.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${source.color}`} />
                      <span className="text-gray-400 text-sm">
                        {source.label}
                      </span>
                    </div>
                    <span className="text-white font-medium text-sm">
                      {source.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performing Services */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-800">
              <h3 className="text-lg font-bold">Top Performing Services</h3>
            </div>

            {/* Table - Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                    <th className="text-left px-6 py-4 font-medium">
                      Service Name
                    </th>
                    <th className="text-center px-6 py-4 font-medium">
                      Inquiries
                    </th>
                    <th className="text-center px-6 py-4 font-medium">
                      Bookings
                    </th>
                    <th className="text-right px-6 py-4 font-medium">
                      Conversion Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topServices.map((service, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-sm">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400 text-sm">
                        {service.inquiries}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400 text-sm">
                        {service.bookings}
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-medium text-sm">
                        {service.conversionRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards - Mobile */}
            <div className="sm:hidden p-4 space-y-3">
              {topServices.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-[#252525] rounded-lg p-4 border border-gray-700"
                >
                  <p className="font-medium text-white mb-3">{service.name}</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Inquiries</p>
                      <p className="text-white font-medium">
                        {service.inquiries}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Bookings</p>
                      <p className="text-white font-medium">
                        {service.bookings}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Conv. Rate</p>
                      <p className="text-green-400 font-medium">
                        {service.conversionRate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
