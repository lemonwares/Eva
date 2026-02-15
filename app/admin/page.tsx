"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { logger } from "@/lib/logger";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  AlertTriangle,
  Info,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Loader2,
  Store,
  MessageSquare,
  Star,
  ShoppingBag,
  Clock,
  Bell,
  CheckCircle2,
  BarChart3,
  Zap,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

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
  createdAt: string;
  provider: {
    id: string;
    businessName: string;
    owner: { id: string; name: string; email: string };
  };
  quote: { id: string; totalPrice: number } | null;
}

interface ActivityItem {
  id: string;
  type: "booking" | "user" | "vendor" | "review";
  title: string;
  description: string;
  time: string;
  icon: typeof Calendar;
  iconBg: string;
  iconColor: string;
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(refresh = false) {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const [analyticsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/analytics?period=30d"),
        fetch("/api/admin/bookings?limit=10"),
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        const bookings = data.bookings || [];
        setRecentBookings(bookings.slice(0, 5));

        const activities: ActivityItem[] = bookings
          .slice(0, 8)
          .map((b: Booking) => ({
            id: b.id,
            type: "booking" as const,
            title: "New Booking",
            description: `${b.provider.businessName} received a booking`,
            time: formatRelativeTime(b.createdAt || b.eventDate),
            icon: ShoppingBag,
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-500",
          }));
        setActivityFeed(activities);
      }
    } catch (err) {
      logger.error("Error fetching admin data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; dot: string }> = {
      CONFIRMED: {
        bg: darkMode ? "bg-green-500/15" : "bg-green-50",
        text: "text-green-600",
        dot: "bg-green-500",
      },
      COMPLETED: {
        bg: darkMode ? "bg-green-500/15" : "bg-green-50",
        text: "text-green-600",
        dot: "bg-green-500",
      },
      PENDING: {
        bg: darkMode ? "bg-amber-500/15" : "bg-amber-50",
        text: "text-amber-600",
        dot: "bg-amber-500",
      },
      PENDING_PAYMENT: {
        bg: darkMode ? "bg-amber-500/15" : "bg-amber-50",
        text: "text-amber-600",
        dot: "bg-amber-500",
      },
      CANCELLED: {
        bg: darkMode ? "bg-red-500/15" : "bg-red-50",
        text: "text-red-600",
        dot: "bg-red-500",
      },
    };
    const s = styles[status] || {
      bg: darkMode ? "bg-gray-500/15" : "bg-gray-100",
      text: "text-gray-600",
      dot: "bg-gray-500",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {status.replace("_", " ")}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const todayDate = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  if (isLoading) {
    return (
      <AdminLayout title="Overview">
        <div className="flex flex-col justify-center items-center py-24 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className={`text-sm ${textMuted}`}>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      label: "Total Bookings",
      value: analytics?.overview.bookings.total.toLocaleString() || "0",
      change: analytics?.overview.bookings.growth || 0,
      period: "vs last period",
      icon: Calendar,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      accentBorder: "border-l-blue-500",
      href: "/admin/bookings",
    },
    {
      label: "New Inquiries",
      value: analytics?.overview.inquiries.new.toLocaleString() || "0",
      change: analytics?.overview.inquiries.growth || 0,
      period: "vs last period",
      icon: MessageSquare,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      accentBorder: "border-l-violet-500",
      href: "/admin/quotes",
    },
    {
      label: "New Users",
      value: analytics?.overview.users.new.toLocaleString() || "0",
      change: analytics?.overview.users.growth || 0,
      period: "vs last period",
      icon: Users,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      accentBorder: "border-l-emerald-500",
      href: "/admin/users",
    },
    {
      label: "Pending Approvals",
      value: analytics?.overview.providers.pending.toString() || "0",
      icon: Store,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      accentBorder: "border-l-amber-500",
      href: "/admin/vendors?status=pending",
      isAction: true,
    },
  ];

  const actionItems = [];
  if ((analytics?.overview.reviews.pending || 0) > 0) {
    actionItems.push({
      title: "Pending Reviews",
      description: `${analytics?.overview.reviews.pending} reviews awaiting moderation`,
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: darkMode ? "bg-amber-500/8" : "bg-amber-50",
      borderColor: darkMode ? "border-amber-500/20" : "border-amber-200",
      href: "/admin/reviews?status=pending",
      count: analytics?.overview.reviews.pending || 0,
    });
  }
  if ((analytics?.overview.providers.pending || 0) > 0) {
    actionItems.push({
      title: "Vendor Approvals",
      description: `${analytics?.overview.providers.pending} vendors awaiting approval`,
      icon: Store,
      color: "text-blue-500",
      bgColor: darkMode ? "bg-blue-500/8" : "bg-blue-50",
      borderColor: darkMode ? "border-blue-500/20" : "border-blue-200",
      href: "/admin/vendors?status=pending",
      count: analytics?.overview.providers.pending || 0,
    });
  }

  // Platform health score
  const totalItems =
    (analytics?.overview.reviews.pending || 0) +
    (analytics?.overview.providers.pending || 0);
  const healthStatus =
    totalItems === 0 ? "excellent" : totalItems <= 3 ? "good" : "attention";

  return (
    <AdminLayout title="Overview">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2
              className={`text-lg sm:text-xl font-semibold ${textPrimary} tracking-tight`}
            >
              {greeting} 👋
            </h2>
            <p className={`text-sm ${textMuted} mt-0.5`}>{todayDate}</p>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              darkMode
                ? "border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
            } disabled:opacity-50`}
          >
            <RefreshCw
              size={15}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Link
              key={idx}
              href={stat.href || "#"}
              className={`group relative ${cardBg} border ${cardBorder} border-l-4 ${stat.accentBorder} rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                  <stat.icon size={18} className={stat.iconColor} />
                </div>
                <ArrowUpRight
                  size={16}
                  className={`${textMuted} opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity`}
                />
              </div>
              <p
                className={`text-2xl sm:text-3xl font-bold ${textPrimary} tracking-tight`}
              >
                {stat.value}
              </p>
              <p className={`text-sm ${textMuted} mt-1`}>{stat.label}</p>
              {!stat.isAction && stat.change !== undefined && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-dashed border-gray-200/50">
                  {stat.change >= 0 ? (
                    <TrendingUp size={14} className="text-green-500" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      stat.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change >= 0 ? "+" : ""}
                    {stat.change}%
                  </span>
                  <span className={`text-xs ${textMuted}`}>{stat.period}</span>
                </div>
              )}
              {stat.isAction && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-dashed border-gray-200/50">
                  <ArrowRight
                    size={14}
                    className="text-accent group-hover:translate-x-1 transition-transform"
                  />
                  <span className="text-xs font-medium text-accent">
                    Review now
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Platform Overview + Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Health */}
          <div
            className={`lg:col-span-2 ${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
          >
            <div className="p-5 pb-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <BarChart3 size={18} className="text-accent" />
                  <h3 className={`font-semibold ${textPrimary}`}>
                    Platform Overview
                  </h3>
                </div>
                <Link
                  href="/admin/analytics"
                  className="text-accent text-xs font-medium flex items-center gap-1 hover:underline"
                >
                  Full Analytics <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Total Users",
                    value:
                      analytics?.overview.users.total.toLocaleString() || "0",
                    icon: Users,
                    color: "text-blue-500",
                    bg: darkMode ? "bg-blue-500/8" : "bg-blue-50",
                  },
                  {
                    label: "Active Vendors",
                    value: (
                      analytics?.overview.providers.active || 0
                    ).toString(),
                    icon: Store,
                    color: "text-emerald-500",
                    bg: darkMode ? "bg-emerald-500/8" : "bg-emerald-50",
                  },
                  {
                    label: "Completed",
                    value: (
                      analytics?.overview.bookings.completed || 0
                    ).toString(),
                    icon: CheckCircle2,
                    color: "text-violet-500",
                    bg: darkMode ? "bg-violet-500/8" : "bg-violet-50",
                  },
                  {
                    label: "Reviews",
                    value: (analytics?.overview.reviews.total || 0).toString(),
                    icon: Star,
                    color: "text-amber-500",
                    bg: darkMode ? "bg-amber-500/8" : "bg-amber-50",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`p-4 rounded-xl ${item.bg} transition-colors`}
                  >
                    <item.icon size={16} className={`${item.color} mb-2`} />
                    <p
                      className={`text-xl font-bold ${textPrimary} tracking-tight`}
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

            {/* Platform Health Bar */}
            <div
              className={`px-5 py-3 border-t ${
                darkMode
                  ? "border-white/5 bg-white/2"
                  : "border-gray-100 bg-gray-50/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      healthStatus === "excellent"
                        ? "bg-green-500"
                        : healthStatus === "good"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    } animate-pulse`}
                  />
                  <span className={`text-xs font-medium ${textSecondary}`}>
                    Platform Health:{" "}
                    <span
                      className={
                        healthStatus === "excellent"
                          ? "text-green-500"
                          : healthStatus === "good"
                            ? "text-amber-500"
                            : "text-red-500"
                      }
                    >
                      {healthStatus === "excellent"
                        ? "All clear"
                        : healthStatus === "good"
                          ? "Minor items pending"
                          : `${totalItems} items need attention`}
                    </span>
                  </span>
                </div>
                <span className={`text-xs ${textMuted}`}>Last 30 days</span>
              </div>
            </div>
          </div>

          {/* Action Required */}
          <div className={`${cardBg} border ${cardBorder} rounded-xl`}>
            <div className="p-5 pb-4">
              <div className="flex items-center gap-2.5 mb-4">
                <Zap size={18} className="text-accent" />
                <h3 className={`font-semibold ${textPrimary}`}>
                  Action Required
                </h3>
              </div>
              {actionItems.length === 0 ? (
                <div
                  className={`text-center py-8 ${textMuted} flex flex-col items-center`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      darkMode ? "bg-green-500/10" : "bg-green-50"
                    }`}
                  >
                    <CheckCircle2 size={22} className="text-green-500" />
                  </div>
                  <p className={`font-medium text-sm ${textSecondary}`}>
                    All caught up!
                  </p>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    No pending actions right now
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {actionItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href || "#"}
                      className={`group flex items-center gap-3 ${item.bgColor} border ${item.borderColor} rounded-xl p-3.5 transition-all hover:shadow-sm`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          darkMode ? "bg-white/5" : "bg-white/80"
                        }`}
                      >
                        <item.icon size={18} className={item.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm ${textPrimary} leading-tight`}
                        >
                          {item.title}
                        </p>
                        <p className={`text-xs ${textMuted} mt-0.5`}>
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-sm font-bold ${item.color} tabular-nums`}
                        >
                          {item.count}
                        </span>
                        <ChevronRight
                          size={14}
                          className={`${item.color} opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity`}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div
              className={`px-5 py-3 border-t ${
                darkMode ? "border-white/5" : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: "Vendors", href: "/admin/vendors" },
                  { label: "Reviews", href: "/admin/reviews" },
                  { label: "Users", href: "/admin/users" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      darkMode
                        ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row — Activity, Top Vendors, Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className={`${cardBg} border ${cardBorder} rounded-xl`}>
            <div className="flex items-center justify-between p-5 pb-3">
              <div className="flex items-center gap-2.5">
                <Bell size={18} className="text-accent" />
                <h3 className={`font-semibold ${textPrimary}`}>
                  Recent Activity
                </h3>
              </div>
            </div>
            <div className="px-5 pb-5">
              {activityFeed.length === 0 ? (
                <div
                  className={`text-center py-10 ${textMuted} flex flex-col items-center`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <Clock size={20} className={textMuted} />
                  </div>
                  <p className={`text-sm ${textSecondary}`}>
                    No recent activity
                  </p>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Activity will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {activityFeed.slice(0, 5).map((activity, idx) => (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${activity.iconBg}`}
                      >
                        <activity.icon
                          size={14}
                          className={activity.iconColor}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${textPrimary} leading-tight`}
                        >
                          {activity.title}
                        </p>
                        <p className={`text-xs ${textMuted} mt-0.5 truncate`}>
                          {activity.description}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] ${textMuted} shrink-0 tabular-nums`}
                      >
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Vendors */}
          <div className={`${cardBg} border ${cardBorder} rounded-xl`}>
            <div className="flex items-center justify-between p-5 pb-3">
              <div className="flex items-center gap-2.5">
                <Store size={18} className="text-accent" />
                <h3 className={`font-semibold ${textPrimary}`}>Top Vendors</h3>
              </div>
              <Link
                href="/admin/vendors"
                className="text-accent text-xs font-medium flex items-center gap-1 hover:underline"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="px-5 pb-5">
              {analytics?.breakdown.topProviders.length === 0 ? (
                <div
                  className={`text-center py-10 ${textMuted} flex flex-col items-center`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <Store size={20} className={textMuted} />
                  </div>
                  <p className={`text-sm ${textSecondary}`}>No vendors yet</p>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Vendors will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {analytics?.breakdown.topProviders
                    .slice(0, 5)
                    .map((provider, idx) => (
                      <div
                        key={provider.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            idx === 0
                              ? "bg-yellow-500/15 text-yellow-600"
                              : idx === 1
                                ? "bg-gray-300/20 text-gray-500"
                                : idx === 2
                                  ? "bg-orange-500/15 text-orange-500"
                                  : darkMode
                                    ? "bg-white/5 text-gray-500"
                                    : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm ${textPrimary} truncate leading-tight`}
                          >
                            {provider.businessName}
                          </p>
                          <p className={`text-xs ${textMuted} mt-0.5`}>
                            {provider.reviewCount} reviews &middot;{" "}
                            {provider.inquiryCount} inquiries
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star
                            size={13}
                            className="text-yellow-500 fill-yellow-500"
                          />
                          <span
                            className={`text-sm font-semibold ${textPrimary} tabular-nums`}
                          >
                            {provider.averageRating?.toFixed(1) || "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className={`${cardBg} border ${cardBorder} rounded-xl`}>
            <div className="flex items-center justify-between p-5 pb-3">
              <div className="flex items-center gap-2.5">
                <Calendar size={18} className="text-accent" />
                <h3 className={`font-semibold ${textPrimary}`}>
                  Recent Bookings
                </h3>
              </div>
              <Link
                href="/admin/bookings"
                className="text-accent text-xs font-medium flex items-center gap-1 hover:underline"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="px-5 pb-5">
              {recentBookings.length === 0 ? (
                <div
                  className={`text-center py-10 ${textMuted} flex flex-col items-center`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <Calendar size={20} className={textMuted} />
                  </div>
                  <p className={`text-sm ${textSecondary}`}>No bookings yet</p>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Bookings will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        darkMode
                          ? "bg-white/2 border-white/5 hover:bg-white/5"
                          : "bg-gray-50/50 border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-mono font-semibold ${textSecondary}`}
                        >
                          #{booking.id.slice(-6).toUpperCase()}
                        </span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p
                        className={`text-sm font-medium ${textPrimary} truncate`}
                      >
                        {booking.provider.businessName}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${textMuted}`}>
                          {formatDate(booking.eventDate)}
                        </span>
                        <span
                          className={`text-sm font-semibold ${textPrimary} tabular-nums`}
                        >
                          {formatCurrency(
                            booking.totalPrice ??
                              booking.quote?.totalPrice ??
                              0,
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
