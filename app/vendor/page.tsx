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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Inquiry {
  id: string;
  fromName: string;
  message: string;
  eventDate: string | null;
  status: string;
  createdAt: string;
}

interface Booking {
  id: string;
  eventDate: string;
  eventType: string | null;
  totalPrice: number;
  status: string;
  quote: {
    inquiry: {
      fromName: string;
    };
  };
}

interface DashboardStats {
  newInquiries: number;
  pendingQuotes: number;
  upcomingBookings: number;
  monthlyRevenue: number;
}

type InquiryStatus = "NEW" | "VIEWED" | "QUOTED" | "DECLINED" | "REPLIED";

const statusStyles: Record<InquiryStatus, string> = {
  NEW: "bg-blue-500/20 text-blue-600 border border-blue-500/30",
  VIEWED: "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30",
  REPLIED: "bg-purple-500/20 text-purple-600 border border-purple-500/30",
  QUOTED: "bg-green-500/20 text-green-600 border border-green-500/30",
  DECLINED: "bg-red-500/20 text-red-600 border border-red-500/30",
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

  const [isLoading, setIsLoading] = useState(true);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    newInquiries: 0,
    pendingQuotes: 0,
    upcomingBookings: 0,
    monthlyRevenue: 0,
  });
  const [providerName, setProviderName] = useState("Your Business");
  const [providerType, setProviderType] = useState("Vendor");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setIsLoading(true);
    try {
      // Fetch inquiries
      const inquiriesRes = await fetch("/api/inquiries?limit=5");
      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        setRecentInquiries(inquiriesData.inquiries || []);
        const newCount = (inquiriesData.inquiries || []).filter(
          (i: Inquiry) => i.status === "NEW"
        ).length;
        setStats((prev) => ({
          ...prev,
          newInquiries: inquiriesData.pagination?.total || 0,
        }));
      }

      // Fetch bookings
      const bookingsRes = await fetch("/api/bookings?limit=5&upcoming=true");
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setUpcomingBookings(bookingsData.bookings || []);
        setStats((prev) => ({
          ...prev,
          upcomingBookings: bookingsData.pagination?.total || 0,
        }));
      }

      // Fetch provider profile
      const profileRes = await fetch("/api/vendor/profile");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.provider) {
          setProviderName(profileData.provider.businessName);
          setProviderType(profileData.provider.categories?.[0] || "Vendor");
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const statsConfig = [
    {
      label: "New Inquiries",
      value: stats.newInquiries.toString(),
      icon: MessageSquare,
      href: "/vendor/inquiries",
    },
    {
      label: "Pending Quotes",
      value: stats.pendingQuotes.toString(),
      icon: FileText,
      href: "/vendor/quotes",
    },
    {
      label: "Upcoming Bookings",
      value: stats.upcomingBookings.toString(),
      icon: Calendar,
      href: "/vendor/bookings",
    },
    {
      label: "Monthly Revenue",
      value: `£${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      href: "/vendor/payments",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsConfig.map((stat, idx) => (
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
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`p-4 transition-colors flex items-center justify-between border-b last:border-b-0 ${cardBorder} ${hoverBg}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent/50 to-pink-500/50 flex items-center justify-center text-white font-medium text-sm">
                      {getInitials(inquiry.fromName)}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${textPrimary}`}>
                        {inquiry.fromName}
                      </p>
                      <p className={`text-xs ${textMuted} line-clamp-1`}>
                        {inquiry.message.slice(0, 40)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs hidden sm:block ${textMuted}`}>
                      {formatTimeAgo(inquiry.createdAt)}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusStyles[inquiry.status as InquiryStatus] ||
                        statusStyles.NEW
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={`p-8 text-center ${textMuted}`}>
                <MessageSquare className="mx-auto mb-2 opacity-50" size={24} />
                <p className="text-sm">No inquiries yet</p>
              </div>
            )}
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
            {upcomingBookings.length === 0 ? (
              <div className={`p-8 text-center ${textMuted}`}>
                <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                <p>No upcoming bookings</p>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-4 transition-colors border-b last:border-b-0 ${cardBorder} ${hoverBg}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`font-medium text-sm ${textPrimary}`}>
                        {booking.quote?.inquiry?.fromName || "Client"}
                      </p>
                      <p className={`text-xs ${textMuted}`}>
                        {booking.eventType || "Event"}
                      </p>
                    </div>
                    <span className="text-accent font-bold text-sm">
                      £{booking.totalPrice?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-4 text-xs ${textMuted}`}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(booking.eventDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
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
