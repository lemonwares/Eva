"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useDashboardTheme } from "./layout";
import { formatCurrency, formatDate } from "@/lib/formatters";

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
        // Fetch bookings
        const bookingsRes = await fetch("/api/bookings?limit=5&upcoming=true");
        const bookingsData = await bookingsRes.json();

        // Fetch inquiries
        const inquiriesRes = await fetch("/api/inquiries?limit=5");
        const inquiriesData = await inquiriesRes.json();

        // Fetch favorites count
        const favoritesRes = await fetch("/api/favorites");
        const favoritesData = await favoritesRes.json();

        // Fetch reviews count
        const reviewsRes = await fetch("/api/reviews?limit=1");
        const reviewsData = await reviewsRes.json();

        // Fetch quotes
        const quotesRes = await fetch("/api/quotes?status=SENT&limit=1");
        const quotesData = await quotesRes.json();

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
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
      DEPOSIT_PAID: "bg-blue-100 text-blue-700",
      FULLY_PAID: "bg-green-100 text-green-700",
      CONFIRMED: "bg-green-100 text-green-700",
      COMPLETED: "bg-gray-100 text-gray-700",
      CANCELLED: "bg-red-100 text-red-700",
      NEW: "bg-blue-100 text-blue-700",
      VIEWED: "bg-purple-100 text-purple-700",
      QUOTED: "bg-amber-100 text-amber-700",
      ACCEPTED: "bg-green-100 text-green-700",
      DECLINED: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>
          Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className={textSecondary}>
          Here&apos;s what&apos;s happening with your events.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link
          href="/dashboard/bookings"
          className={`${cardBg} ${cardBorder} border rounded-xl p-4 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <svg
                className="w-5 h-5 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {stats.upcomingBookings}
              </p>
              <p className={`text-xs ${textMuted}`}>Upcoming Bookings</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/quotes"
          className={`${cardBg} ${cardBorder} border rounded-xl p-4 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {stats.pendingQuotes}
              </p>
              <p className={`text-xs ${textMuted}`}>Pending Quotes</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/inquiries"
          className={`${cardBg} ${cardBorder} border rounded-xl p-4 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {stats.activeInquiries}
              </p>
              <p className={`text-xs ${textMuted}`}>Inquiries</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/favorites"
          className={`${cardBg} ${cardBorder} border rounded-xl p-4 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <svg
                className="w-5 h-5 text-pink-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {stats.favoriteVendors}
              </p>
              <p className={`text-xs ${textMuted}`}>Favorites</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/reviews"
          className={`${cardBg} ${cardBorder} border rounded-xl p-4 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {stats.totalReviews}
              </p>
              <p className={`text-xs ${textMuted}`}>Reviews</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className={`${cardBg} ${cardBorder} border rounded-xl p-6`}>
        <h2 className={`font-semibold ${textPrimary} mb-4`}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/vendors"
            className={`flex flex-col items-center gap-2 p-4 rounded-xl ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-50 hover:bg-gray-100"
            } transition-colors`}
          >
            <div className="p-3 bg-rose-100 rounded-full">
              <svg
                className="w-6 h-6 text-rose-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <span className={`text-sm font-medium ${textPrimary}`}>
              Find Vendors
            </span>
          </Link>

          <Link
            href="/categories"
            className={`flex flex-col items-center gap-2 p-4 rounded-xl ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-50 hover:bg-gray-100"
            } transition-colors`}
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <span className={`text-sm font-medium ${textPrimary}`}>
              Browse Categories
            </span>
          </Link>

          <Link
            href="/dashboard/bookings"
            className={`flex flex-col items-center gap-2 p-4 rounded-xl ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-50 hover:bg-gray-100"
            } transition-colors`}
          >
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <span className={`text-sm font-medium ${textPrimary}`}>
              View Bookings
            </span>
          </Link>

          <Link
            href="/dashboard/settings"
            className={`flex flex-col items-center gap-2 p-4 rounded-xl ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-50 hover:bg-gray-100"
            } transition-colors`}
          >
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className={`text-sm font-medium ${textPrimary}`}>
              Settings
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <div
          className={`${cardBg} ${cardBorder} border rounded-xl overflow-hidden`}
        >
          <div className="flex items-center justify-between p-4 border-b border-inherit">
            <h2 className={`font-semibold ${textPrimary}`}>
              Upcoming Bookings
            </h2>
            <Link
              href="/dashboard/bookings"
              className="text-sm text-rose-500 hover:text-rose-600"
            >
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className={`w-12 h-12 mx-auto ${textMuted}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className={`mt-2 ${textMuted}`}>No upcoming bookings</p>
              <Link
                href="/vendors"
                className="mt-3 inline-block text-sm text-rose-500 hover:text-rose-600"
              >
                Find a vendor →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-inherit">
              {recentBookings.map((booking) => (
                <div key={booking.id} className={`flex items-center gap-4 p-4`}>
                  <div
                    className={`w-12 h-12 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    } flex items-center justify-center overflow-hidden`}
                  >
                    {booking.provider.coverImage ? (
                      <img
                        src={booking.provider.coverImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className={`w-6 h-6 ${textMuted}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
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
                  <div className="text-right">
                    <p className={`font-medium ${textPrimary}`}>
                      {formatCurrency(booking.pricingTotal)}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                        booking.status
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
            <h2 className={`font-semibold ${textPrimary}`}>Recent Inquiries</h2>
            <Link
              href="/dashboard/inquiries"
              className="text-sm text-rose-500 hover:text-rose-600"
            >
              View All
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className={`w-12 h-12 mx-auto ${textMuted}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className={`mt-2 ${textMuted}`}>No inquiries yet</p>
              <Link
                href="/vendors"
                className="mt-3 inline-block text-sm text-rose-500 hover:text-rose-600"
              >
                Contact a vendor →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-inherit">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/dashboard/inquiries/${inquiry.id}`}
                  className={`block p-4 ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-medium ${textPrimary}`}>
                      {inquiry.provider.businessName}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                        inquiry.status
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
