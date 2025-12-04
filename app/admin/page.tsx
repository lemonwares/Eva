"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  AlertTriangle,
  Info,
  ArrowRight,
  ChevronRight,
  Loader2,
  Store,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface AnalyticsData {
  period: string;
  overview: {
    users: { total: number; new: number; growth: number };
    providers: { total: number; active: number; pending: number };
    bookings: { total: number; new: number; completed: number; growth: number };
    inquiries: { total: number; new: number; growth: number };
    reviews: { total: number; pending: number };
  };
  breakdown: {
    categories: Array<{
      id: string;
      name: string;
      slug: string;
      _count: { subcategories: number };
    }>;
    topProviders: Array<{
      id: string;
      businessName: string;
      averageRating: number | null;
      reviewCount: number;
      inquiryCount: number;
    }>;
  };
}

interface Booking {
  id: string;
  eventDate: string;
  status: string;
  totalPrice: number;
  provider: {
    id: string;
    businessName: string;
    owner: { id: string; name: string; email: string };
  };
  quote: { id: string; totalPrice: number } | null;
}

export default function AdminOverviewPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
  } = useAdminTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [analyticsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/analytics?period=30d"),
        fetch("/api/admin/bookings?limit=5"),
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setRecentBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return "bg-green-500";
      case "PENDING":
        return "bg-amber-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Overview">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      label: "Total Bookings",
      value: analytics?.overview.bookings.total.toLocaleString() || "0",
      change: `${analytics?.overview.bookings.growth || 0 >= 0 ? "+" : ""}${
        analytics?.overview.bookings.growth || 0
      }%`,
      trend: (analytics?.overview.bookings.growth || 0) >= 0 ? "up" : "down",
      period: "last 30 days",
      icon: Calendar,
    },
    {
      label: "New Inquiries",
      value: analytics?.overview.inquiries.new.toLocaleString() || "0",
      change: `${(analytics?.overview.inquiries.growth || 0) >= 0 ? "+" : ""}${
        analytics?.overview.inquiries.growth || 0
      }%`,
      trend: (analytics?.overview.inquiries.growth || 0) >= 0 ? "up" : "down",
      period: "last 30 days",
      icon: MessageSquare,
    },
    {
      label: "New User Signups",
      value: analytics?.overview.users.new.toLocaleString() || "0",
      change: `${(analytics?.overview.users.growth || 0) >= 0 ? "+" : ""}${
        analytics?.overview.users.growth || 0
      }%`,
      trend: (analytics?.overview.users.growth || 0) >= 0 ? "up" : "down",
      period: "last 30 days",
      icon: Users,
    },
    {
      label: "Pending Vendor Approvals",
      value: analytics?.overview.providers.pending.toString() || "0",
      subtext: "Awaiting review",
      isAction: true,
      href: "/admin/vendors?status=pending",
      icon: Store,
    },
  ];

  // Action items based on real data
  const actionItems = [];
  if ((analytics?.overview.reviews.pending || 0) > 0) {
    actionItems.push({
      type: "warning",
      title: "Pending Reviews",
      description: `${analytics?.overview.reviews.pending} reviews awaiting moderation`,
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      href: "/admin/reviews?status=pending",
    });
  }
  if ((analytics?.overview.providers.pending || 0) > 0) {
    actionItems.push({
      type: "info",
      title: "Vendor Approvals",
      description: `${analytics?.overview.providers.pending} vendors awaiting approval`,
      icon: Info,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      href: "/admin/vendors?status=pending",
    });
  }

  return (
    <AdminLayout title="Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${cardBg} border ${cardBorder} rounded-xl p-5 transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-2">
              <p className={`text-sm ${textMuted}`}>{stat.label}</p>
              <stat.icon size={18} className="text-accent" />
            </div>
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
              <Link
                href={stat.href || "#"}
                className="flex items-center gap-1.5"
              >
                <ArrowRight size={14} className="text-accent" />
                <span className="text-sm text-accent">{stat.subtext}</span>
              </Link>
            ) : null}
          </div>
        ))}
      </div>

      {/* Charts & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Platform Stats */}
        <div
          className={`lg:col-span-2 ${cardBg} border ${cardBorder} rounded-xl p-5`}
        >
          <h3 className={`font-semibold ${textPrimary} mb-4`}>
            Platform Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-white/5" : "bg-gray-50"
              }`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {analytics?.overview.users.total.toLocaleString() || 0}
              </p>
              <p className={`text-sm ${textMuted}`}>Total Users</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-white/5" : "bg-gray-50"
              }`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {analytics?.overview.providers.active || 0}
              </p>
              <p className={`text-sm ${textMuted}`}>Active Vendors</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-white/5" : "bg-gray-50"
              }`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {analytics?.overview.bookings.completed || 0}
              </p>
              <p className={`text-sm ${textMuted}`}>Completed Bookings</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-white/5" : "bg-gray-50"
              }`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {analytics?.overview.reviews.total || 0}
              </p>
              <p className={`text-sm ${textMuted}`}>Total Reviews</p>
            </div>
          </div>
        </div>

        {/* Action Required */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-5`}>
          <h3 className={`font-semibold ${textPrimary} mb-4`}>
            Action Required
          </h3>
          {actionItems.length === 0 ? (
            <div className={`text-center py-8 ${textMuted}`}>
              <Info size={24} className="mx-auto mb-2 opacity-50" />
              <p>No actions required</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actionItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href || "#"}
                  className={`block ${item.bgColor} border ${item.borderColor} rounded-lg p-3 cursor-pointer hover:opacity-90 transition-opacity`}
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Providers */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-5`}>
          <h3 className={`font-semibold ${textPrimary} mb-4`}>Top Vendors</h3>
          {analytics?.breakdown.topProviders.length === 0 ? (
            <div className={`text-center py-8 ${textMuted}`}>
              <Store size={24} className="mx-auto mb-2 opacity-50" />
              <p>No vendors yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics?.breakdown.topProviders
                .slice(0, 5)
                .map((provider, idx) => (
                  <div
                    key={provider.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${textMuted}`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <p className={`font-medium text-sm ${textPrimary}`}>
                          {provider.businessName}
                        </p>
                        <p className={`text-xs ${textMuted}`}>
                          {provider.reviewCount} reviews
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-accent font-medium">
                        {provider.averageRating?.toFixed(1) || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div
          className={`lg:col-span-2 ${cardBg} border ${cardBorder} rounded-xl p-5`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${textPrimary}`}>Recent Bookings</h3>
            <Link
              href="/admin/bookings"
              className="text-accent text-sm font-medium flex items-center gap-1 hover:underline"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className={`text-center py-8 ${textMuted}`}>
              <Calendar size={24} className="mx-auto mb-2 opacity-50" />
              <p>No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-left text-xs uppercase ${textMuted}`}>
                    <th className="pb-3 font-medium">Booking ID</th>
                    <th className="pb-3 font-medium">Vendor</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Amount</th>
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
                        #{booking.id.slice(-6).toUpperCase()}
                      </td>
                      <td className={`py-3 text-sm ${textSecondary}`}>
                        {booking.provider.businessName}
                      </td>
                      <td className={`py-3 text-sm ${textMuted}`}>
                        {formatDate(booking.eventDate)}
                      </td>
                      <td className={`py-3 text-sm ${textPrimary}`}>
                        £
                        {booking.totalPrice?.toLocaleString() ||
                          booking.quote?.totalPrice?.toLocaleString() ||
                          0}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
