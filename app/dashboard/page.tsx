"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useDashboardTheme } from "./layout";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  CalendarDays,
  FileText,
  MessageCircle,
  Heart,
  Star,
  Search,
  LayoutGrid,
  ClipboardCheck,
  Settings,
  Building2,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { logger } from "@/lib/logger";

interface DashboardStats {
  upcomingBookings: number;
  pendingQuotes: number;
  activeInquiries: number;
  totalReviews: number;
  favoriteVendors: number;
}

interface RecentBooking {
  id: string;
  eventDate: string;
  status: string;
  pricingTotal: number;
  provider: {
    businessName: string;
    coverImage?: string;
  };
}

interface RecentInquiry {
  id: string;
  status: string;
  message: string;
  createdAt: string;
  provider: {
    businessName: string;
  };
}

const statCards = [
  {
    key: "upcomingBookings",
    label: "Upcoming Bookings",
    href: "/dashboard/bookings",
    icon: CalendarDays,
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-900/20",
  },
  {
    key: "pendingQuotes",
    label: "Pending Quotes",
    href: "/dashboard/quotes",
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    key: "activeInquiries",
    label: "Inquiries",
    href: "/dashboard/inquiries",
    icon: MessageCircle,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    key: "favoriteVendors",
    label: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    key: "totalReviews",
    label: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
] as const;

const quickActions = [
  {
    label: "Find Vendors",
    href: "/vendors",
    icon: Search,
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-900/20",
  },
  {
    label: "Browse Categories",
    href: "/categories",
    icon: LayoutGrid,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    label: "View Bookings",
    href: "/dashboard/bookings",
    icon: ClipboardCheck,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
  } = useDashboardTheme();

  const [stats, setStats] = useState<DashboardStats>({
    upcomingBookings: 0,
    pendingQuotes: 0,
    activeInquiries: 0,
    totalReviews: 0,
    favoriteVendors: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, inquiriesRes, favoritesRes, reviewsRes, quotesRes] =
          await Promise.all([
            fetch("/api/bookings?limit=5&upcoming=true"),
            fetch("/api/inquiries?limit=5"),
            fetch("/api/favorites"),
            fetch("/api/reviews?limit=1"),
            fetch("/api/quotes?status=SENT&limit=1"),
          ]);

        const [
          bookingsData,
          inquiriesData,
          favoritesData,
          reviewsData,
          quotesData,
        ] = await Promise.all([
          bookingsRes.json(),
          inquiriesRes.json(),
          favoritesRes.json(),
          reviewsRes.json(),
          quotesRes.json(),
        ]);

        setStats({
          upcomingBookings: bookingsData.pagination?.total || 0,
          pendingQuotes: quotesData.pagination?.total || 0,
          activeInquiries: inquiriesData.pagination?.total || 0,
          totalReviews: reviewsData.pagination?.total || 0,
          favoriteVendors: favoritesData.favorites?.length || 0,
        });

        setRecentBookings(bookingsData.bookings || []);
        setRecentInquiries(inquiriesData.inquiries || []);
      } catch (error) {
        logger.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      DEPOSIT_PAID:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      FULLY_PAID:
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      CONFIRMED:
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      COMPLETED:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      NEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      VIEWED:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      QUOTED:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
      ACCEPTED:
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      DECLINED: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        <p className={`text-sm ${textMuted}`}>Loading your dashboard...</p>
      </div>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* ─── Welcome Banner ─── */}
      <div
        className={`relative overflow-hidden rounded-2xl border ${cardBorder} bg-linear-to-br from-accent/10 via-transparent to-purple-500/10 p-6 sm:p-8`}
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">
                Dashboard
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
              {greeting}, {firstName}!
            </h1>
            <p className={`mt-1 ${textSecondary}`}>
              Here&apos;s what&apos;s happening with your events.
            </p>
          </div>
          <div
            className={`hidden sm:flex items-center gap-2 rounded-xl border ${cardBorder} ${cardBg} px-4 py-2.5 shadow-sm`}
          >
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className={`text-sm font-medium ${textSecondary}`}>
              {stats.upcomingBookings} upcoming
            </span>
          </div>
        </div>
      </div>

      {/* ─── Quick Stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key];
          return (
            <Link
              key={card.key}
              href={card.href}
              className={`group ${cardBg} ${cardBorder} border rounded-xl p-4 hover:shadow-md transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{value}</p>
                  <p className={`text-xs ${textMuted}`}>{card.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ─── Quick Actions ─── */}
      <div className={`${cardBg} ${cardBorder} border rounded-xl p-6`}>
        <h2 className={`font-semibold ${textPrimary} mb-4`}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`group flex flex-col items-center gap-2.5 p-4 rounded-xl ${
                  darkMode
                    ? "bg-white/3 hover:bg-white/7"
                    : "bg-gray-50 hover:bg-gray-100"
                } transition-colors`}
              >
                <div
                  className={`p-3 rounded-full ${action.bg} transition-transform group-hover:scale-110`}
                >
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className={`text-sm font-medium ${textPrimary}`}>
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── Recent Activity ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <div
          className={`${cardBg} ${cardBorder} border rounded-xl overflow-hidden`}
        >
          <div className="flex items-center justify-between p-4 border-b border-inherit">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                <CalendarDays className="h-4 w-4 text-teal-600" />
              </div>
              <h2 className={`font-semibold ${textPrimary}`}>
                Upcoming Bookings
              </h2>
            </div>
            <Link
              href="/dashboard/bookings"
              className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="p-8 text-center">
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                  darkMode ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <CalendarDays className={`h-6 w-6 ${textMuted}`} />
              </div>
              <p className={`${textMuted}`}>No upcoming bookings</p>
              <Link
                href="/vendors"
                className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80"
              >
                Find a vendor
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-inherit">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`flex items-center gap-4 p-4 ${
                    darkMode ? "hover:bg-white/3" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    } flex items-center justify-center overflow-hidden shrink-0`}
                  >
                    {booking.provider.coverImage ? (
                      <Image
                        src={booking.provider.coverImage}
                        alt=""
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Building2 className={`w-5 h-5 ${textMuted}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${textPrimary}`}>
                      {booking.provider.businessName}
                    </p>
                    <p className={`text-sm ${textMuted}`}>
                      {formatDate(booking.eventDate)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-medium ${textPrimary}`}>
                      {formatCurrency(booking.pricingTotal)}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                        booking.status,
                      )}`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div
          className={`${cardBg} ${cardBorder} border rounded-xl overflow-hidden`}
        >
          <div className="flex items-center justify-between p-4 border-b border-inherit">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className={`font-semibold ${textPrimary}`}>
                Recent Inquiries
              </h2>
            </div>
            <Link
              href="/dashboard/inquiries"
              className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center">
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                  darkMode ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <MessageCircle className={`h-6 w-6 ${textMuted}`} />
              </div>
              <p className={`${textMuted}`}>No inquiries yet</p>
              <Link
                href="/vendors"
                className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80"
              >
                Contact a vendor
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-inherit">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/dashboard/inquiries/${inquiry.id}`}
                  className={`block p-4 ${
                    darkMode ? "hover:bg-white/3" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-medium ${textPrimary}`}>
                      {inquiry.provider.businessName}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                        inquiry.status,
                      )}`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className={`text-sm ${textSecondary} line-clamp-2`}>
                    {inquiry.message}
                  </p>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    {formatDate(inquiry.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
