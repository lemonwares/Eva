"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Download,
  Search,
  ChevronDown,
  MoreVertical,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarX,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Booking {
  id: string;
  eventDate: string;
  status: string;
  totalPrice: number;
  notes: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  provider: {
    id: string;
    businessName: string;
    owner: { id: string; name: string | null; email: string };
  };
  quote: {
    id: string;
    totalPrice: number;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StatusCounts {
  PENDING: number;
  CONFIRMED: number;
  COMPLETED: number;
  CANCELLED: number;
}

const statusOptions = ["All", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function AdminBookingsPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useAdminTheme();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      if (statusFilter !== "All") {
        params.append("status", statusFilter);
      }

      const res = await fetch(`/api/admin/bookings?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setPagination(data.pagination || null);
        setStatusCounts(data.statusCounts || null);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500";
      case "COMPLETED":
        return "bg-blue-500";
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pages = [];
    const { totalPages } = pagination;

    pages.push(1);

    if (currentPage > 3) {
      pages.push(-1);
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push(-2);
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages.map((page, idx) =>
      page < 0 ? (
        <span key={idx} className={textMuted}>
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            currentPage === page
              ? "bg-accent text-white"
              : `${textSecondary} ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`
          }`}
        >
          {page}
        </button>
      )
    );
  };

  // Filter bookings by search query (client-side)
  const filteredBookings = searchQuery
    ? bookings.filter(
        (b) =>
          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.provider.businessName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : bookings;

  return (
    <AdminLayout
      title="Bookings Management"
      actionButton={{
        label: "Export Data",
        icon: <Download size={18} />,
        onClick: () => {},
      }}
    >
      {/* Status Summary */}
      {statusCounts && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`${cardBg} border ${cardBorder} rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                statusFilter === status ? "ring-2 ring-accent" : ""
              }`}
            >
              <p className={`text-2xl font-bold ${textPrimary}`}>{count}</p>
              <p className={`text-sm ${textMuted}`}>{status}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className={`${cardBg} border ${cardBorder} rounded-xl p-4 mb-6`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className={`text-xs font-medium ${textMuted} mb-1.5 block`}>
              Search
            </label>
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
                size={18}
              />
              <input
                type="text"
                placeholder="Booking ID, Customer, Vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>
          </div>

          {/* Status */}
          <div className="w-full md:w-44">
            <label className={`text-xs font-medium ${textMuted} mb-1.5 block`}>
              Status
            </label>
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm`}
              >
                {statusFilter}
                <ChevronDown size={16} />
              </button>
              {showStatusDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-10 py-1`}
                >
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowStatusDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        statusFilter === status ? "text-accent" : textSecondary
                      } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div
        className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className={`text-center py-16 ${textMuted}`}>
            <CalendarX size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No bookings found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Booking ID
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Customer
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Vendor
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Event Date
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Total
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Status
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    ></th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-white/5" : "divide-gray-100"
                  }`}
                >
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className={`${
                        darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-accent font-medium text-sm">
                          #{booking.id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`text-sm ${textPrimary}`}>
                            {booking.user.name || "No Name"}
                          </p>
                          <p className={`text-xs ${textMuted}`}>
                            {booking.user.email}
                          </p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {booking.provider.businessName}
                      </td>
                      <td className={`px-6 py-4 text-sm ${textMuted}`}>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {formatDate(booking.eventDate)}
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-medium ${textPrimary}`}
                      >
                        £
                        {booking.totalPrice?.toLocaleString() ||
                          booking.quote?.totalPrice?.toLocaleString() ||
                          "0"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className={`p-2 rounded-lg ${
                            darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                          }`}
                        >
                          <MoreVertical size={16} className={textMuted} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <p className={`text-sm ${textMuted}`}>
                  Showing{" "}
                  <span className={textPrimary}>
                    {(pagination.page - 1) * pagination.limit + 1}-
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className={textPrimary}>{pagination.total}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {renderPagination()}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className={`px-3 py-1.5 rounded text-sm ${textSecondary} ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
