"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import {
  MessageSquare,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "New Inquiries",
    value: "12",
    change: "+5.2%",
    positive: true,
    icon: MessageSquare,
    href: "/vendor/inquiries",
  },
  {
    label: "Pending Quotes",
    value: "5",
    change: "+1.0%",
    positive: true,
    icon: FileText,
    href: "/vendor/quotes",
  },
  {
    label: "Upcoming Bookings",
    value: "8",
    change: "-2.5%",
    positive: false,
    icon: Calendar,
    href: "/vendor/bookings",
  },
  {
    label: "Monthly Revenue",
    value: "$12,450",
    change: "+15.8%",
    positive: true,
    icon: DollarSign,
    href: "/vendor/payments",
  },
];

type InquiryStatus = "New" | "Viewed" | "Quoted" | "Declined";

const recentInquiries = [
  {
    name: "Olivia Rhye",
    event: "Wedding Photography",
    date: "Oct 15, 2024",
    status: "New" as InquiryStatus,
  },
  {
    name: "Phoenix Baker",
    event: "Corporate Event DJ",
    date: "Nov 02, 2024",
    status: "Viewed" as InquiryStatus,
  },
  {
    name: "Lana Steiner",
    event: "Birthday Catering",
    date: "Nov 21, 2024",
    status: "New" as InquiryStatus,
  },
  {
    name: "Demi Wilkinson",
    event: "Anniversary Florals",
    date: "Dec 05, 2024",
    status: "Quoted" as InquiryStatus,
  },
  {
    name: "Candice Wu",
    event: "Engagement Photos",
    date: "Dec 18, 2024",
    status: "Declined" as InquiryStatus,
  },
];

const upcomingBookings = [
  {
    client: "Sarah Johnson",
    event: "Wedding Reception",
    date: "Dec 15, 2024",
    time: "4:00 PM",
    amount: "$3,500",
  },
  {
    client: "Michael Chen",
    event: "Corporate Gala",
    date: "Dec 20, 2024",
    time: "6:00 PM",
    amount: "$2,800",
  },
  {
    client: "Emily Davis",
    event: "Birthday Party",
    date: "Dec 28, 2024",
    time: "2:00 PM",
    amount: "$1,200",
  },
];

const statusStyles: Record<InquiryStatus, string> = {
  New: "bg-blue-500/20 text-blue-600 border border-blue-500/30",
  Viewed: "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30",
  Quoted: "bg-green-500/20 text-green-600 border border-green-500/30",
  Declined: "bg-red-500/20 text-red-600 border border-red-500/30",
};

function DashboardContent() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    divider,
    hoverBg,
  } = useVendorTheme();

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.href}
            className={`rounded-xl p-5 border transition-colors group ${cardBg} ${cardBorder} hover:border-accent/30`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? "bg-white/5" : "bg-gray-100"
                } group-hover:bg-accent/10`}
              >
                <stat.icon
                  size={20}
                  className={`${textSecondary} group-hover:text-accent`}
                />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.positive ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.positive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {stat.change}
              </div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold mb-1 ${textPrimary}`}>
              {stat.value}
            </p>
            <p className={`text-sm ${textMuted}`}>{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className={`rounded-xl border ${cardBg} ${cardBorder}`}>
          <div
            className={`flex items-center justify-between p-5 border-b ${cardBorder}`}
          >
            <h2 className={`text-lg font-bold ${textPrimary}`}>
              Recent Inquiries
            </h2>
            <Link
              href="/vendor/inquiries"
              className="text-accent text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className={`${divider}`}>
            {recentInquiries.map((inquiry, idx) => (
              <div
                key={idx}
                className={`p-4 transition-colors flex items-center justify-between border-b last:border-b-0 ${cardBorder} ${hoverBg}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/50 to-pink-500/50 flex items-center justify-center text-white font-medium text-sm">
                    {inquiry.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${textPrimary}`}>
                      {inquiry.name}
                    </p>
                    <p className={`text-xs ${textMuted}`}>{inquiry.event}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs hidden sm:block ${textMuted}`}>
                    {inquiry.date}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusStyles[inquiry.status]
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className={`rounded-xl border ${cardBg} ${cardBorder}`}>
          <div
            className={`flex items-center justify-between p-5 border-b ${cardBorder}`}
          >
            <h2 className={`text-lg font-bold ${textPrimary}`}>
              Upcoming Bookings
            </h2>
            <Link
              href="/vendor/bookings"
              className="text-accent text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>
          <div>
            {upcomingBookings.map((booking, idx) => (
              <div
                key={idx}
                className={`p-4 transition-colors border-b last:border-b-0 ${cardBorder} ${hoverBg}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={`font-medium text-sm ${textPrimary}`}>
                      {booking.client}
                    </p>
                    <p className={`text-xs ${textMuted}`}>{booking.event}</p>
                  </div>
                  <span className="text-accent font-bold text-sm">
                    {booking.amount}
                  </span>
                </div>
                <div className={`flex items-center gap-4 text-xs ${textMuted}`}>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {booking.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className={`text-lg font-bold mb-4 ${textPrimary}`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/vendor/quotes"
            className={`rounded-xl p-4 border transition-all text-center ${cardBg} ${cardBorder} hover:border-accent/30 hover:bg-accent/5`}
          >
            <FileText size={24} className="text-accent mx-auto mb-2" />
            <p className={`font-medium text-sm ${textPrimary}`}>Create Quote</p>
          </Link>
          <Link
            href="/vendor/bookings"
            className={`rounded-xl p-4 border transition-all text-center ${cardBg} ${cardBorder} hover:border-accent/30 hover:bg-accent/5`}
          >
            <Calendar size={24} className="text-accent mx-auto mb-2" />
            <p className={`font-medium text-sm ${textPrimary}`}>Add Booking</p>
          </Link>
          <Link
            href="/vendor/profile"
            className={`rounded-xl p-4 border transition-all text-center ${cardBg} ${cardBorder} hover:border-accent/30 hover:bg-accent/5`}
          >
            <MessageSquare size={24} className="text-accent mx-auto mb-2" />
            <p className={`font-medium text-sm ${textPrimary}`}>
              View Messages
            </p>
          </Link>
          <Link
            href="/vendor/analytics"
            className={`rounded-xl p-4 border transition-all text-center ${cardBg} ${cardBorder} hover:border-accent/30 hover:bg-accent/5`}
          >
            <TrendingUp size={24} className="text-accent mx-auto mb-2" />
            <p className={`font-medium text-sm ${textPrimary}`}>
              View Analytics
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default function VendorDashboardPage() {
  return (
    <VendorLayout
      title="Dashboard"
      vendorName="Urban Bloom"
      vendorType="Florist"
    >
      <DashboardContent />
    </VendorLayout>
  );
}
