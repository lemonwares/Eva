"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import {
  Search,
  CalendarDays,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Booking {
  id: string;
  eventDate: string;
  eventType: string | null;
  totalPrice: number;
  status: string;
  notes: string | null;
  quote: {
    id: string;
    items: any[];
    totalPrice: number;
    inquiry: {
      fromName: string;
      fromEmail: string;
    };
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function VendorBookingsPage() {
  const { darkMode } = useVendorTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, statusFilter]);

  async function fetchBookings() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(`/api/bookings?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.quote?.inquiry?.fromName?.toLowerCase().includes(query) ||
      booking.eventType?.toLowerCase().includes(query)
    );
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "PAID":
        return "bg-accent/20 text-accent border border-accent/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "COMPLETED":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
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
      <VendorLayout title="Bookings">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout
      title="Bookings"
      actionButton={{ label: "Add Manual Booking", onClick: () => {} }}
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by client name, event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-lg ${
              darkMode
                ? "bg-[#141414] text-white border-white/10"
                : "bg-white text-gray-900 border-gray-200"
            } border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm`}
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
              darkMode
                ? "bg-[#141414] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            } border text-sm`}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PAID">Paid</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div
          className={`rounded-xl border p-12 text-center ${
            darkMode
              ? "bg-[#141414] border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          <Calendar
            size={48}
            className={`mx-auto mb-4 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <h3
            className={`text-lg font-medium mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No bookings found
          </h3>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            {searchQuery || statusFilter
              ? "Try adjusting your filters"
              : "You don't have any bookings yet"}
          </p>
        </div>
      ) : (
        <>
          {/* Table - Desktop */}
          <div
            className={`hidden md:block ${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`text-gray-500 text-xs uppercase tracking-wider ${
                      darkMode ? "border-white/10" : "border-gray-200"
                    } border-b`}
                  >
                    <th className="text-left px-6 py-4 font-medium">
                      Client Name
                    </th>
                    <th className="text-left px-6 py-4 font-medium">
                      Event Type
                    </th>
                    <th className="text-left px-6 py-4 font-medium">
                      Event Date
                    </th>
                    <th className="text-left px-6 py-4 font-medium">Status</th>
                    <th className="text-right px-6 py-4 font-medium">
                      Total Amount
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className={`${
                        darkMode
                          ? "border-white/10 hover:bg-white/5"
                          : "border-gray-200 hover:bg-gray-50"
                      } border-b transition-colors`}
                    >
                      <td
                        className={`px-6 py-5 font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {booking.quote?.inquiry?.fromName || "Client"}
                      </td>
                      <td
                        className={`px-6 py-5 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {booking.eventType || "Event"}
                      </td>
                      <td
                        className={`px-6 py-5 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {formatDate(booking.eventDate)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-5 text-right font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        £{booking.totalPrice?.toLocaleString() || "0"}
                      </td>
                      <td className="px-6 py-5">
                        <button
                          className={`p-2 ${
                            darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                          } rounded-lg`}
                        >
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className={`${
                  darkMode
                    ? "bg-[#141414] border-white/10"
                    : "bg-white border-gray-200"
                } rounded-xl border p-4`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {booking.quote?.inquiry?.fromName || "Client"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {booking.eventType || "Event"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Event Date</span>
                    <span
                      className={darkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      {formatDate(booking.eventDate)}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between pt-2 ${
                      darkMode ? "border-white/10" : "border-gray-200"
                    } border-t`}
                  >
                    <span className="text-gray-500">Total</span>
                    <span
                      className={`font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      £{booking.totalPrice?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <button
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.max(1, p.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className={`flex items-center gap-2 ${
                  pagination.page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                } transition-colors text-sm`}
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          setPagination((p) => ({ ...p, page: pageNum }))
                        }
                        className={`w-9 h-9 rounded-lg font-medium text-sm ${
                          pagination.page === pageNum
                            ? "bg-accent text-white"
                            : darkMode
                            ? "text-gray-400 hover:bg-white/10"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                {pagination.pages > 5 && (
                  <>
                    <span className="text-gray-500 px-2">...</span>
                    <button
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: pagination.pages }))
                      }
                      className={`w-9 h-9 rounded-lg ${
                        darkMode
                          ? "text-gray-400 hover:bg-white/10"
                          : "text-gray-500 hover:bg-gray-100"
                      } font-medium text-sm`}
                    >
                      {pagination.pages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.min(pagination.pages, p.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.pages}
                className={`flex items-center gap-2 ${
                  pagination.page === pagination.pages
                    ? "opacity-50 cursor-not-allowed"
                    : darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                } transition-colors text-sm`}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </VendorLayout>
  );
}
