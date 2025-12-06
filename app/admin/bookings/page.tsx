"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
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
  Eye,
  Edit2,
  Trash2,
  X,
  User,
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Booking {
  id: string;
  eventDate: string;
  eventLocation: string | null;
  eventType: string | null;
  status: string;
  totalPrice: number;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  specialRequests: string | null;
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
    items: any[];
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

// View Booking Modal Component
function ViewBookingModal({
  booking,
  isOpen,
  onClose,
  darkMode,
}: {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}) {
  if (!booking) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Booking ID
            </p>
            <p className="text-accent font-mono font-bold">
              #{booking.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
        </div>

        {/* Event Details */}
        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <h4
            className={`font-semibold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Event Details
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-accent" />
              <div>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Date
                </p>
                <p className={darkMode ? "text-white" : "text-gray-900"}>
                  {formatDate(booking.eventDate)}
                </p>
              </div>
            </div>
            {booking.eventType && (
              <div>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Event Type
                </p>
                <p className={darkMode ? "text-white" : "text-gray-900"}>
                  {booking.eventType}
                </p>
              </div>
            )}
            {booking.eventLocation && (
              <div className="flex items-center gap-2 col-span-2">
                <MapPin size={16} className="text-accent" />
                <div>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Location
                  </p>
                  <p className={darkMode ? "text-white" : "text-gray-900"}>
                    {booking.eventLocation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Client Info */}
        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <h4
            className={`font-semibold mb-3 flex items-center gap-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <User size={16} /> Client Information
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Name
              </p>
              <p className={darkMode ? "text-white" : "text-gray-900"}>
                {booking.clientName || booking.user?.name || "N/A"}
              </p>
            </div>
            <div>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Email
              </p>
              <p className={darkMode ? "text-white" : "text-gray-900"}>
                {booking.clientEmail || booking.user?.email || "N/A"}
              </p>
            </div>
            {booking.clientPhone && (
              <div>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Phone
                </p>
                <p className={darkMode ? "text-white" : "text-gray-900"}>
                  {booking.clientPhone}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Vendor Info */}
        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <h4
            className={`font-semibold mb-3 flex items-center gap-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <Store size={16} /> Vendor
          </h4>
          <p className={darkMode ? "text-white" : "text-gray-900"}>
            {booking.provider.businessName}
          </p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {booking.provider.owner?.email}
          </p>
        </div>

        {/* Quote Items */}
        {booking.quote?.items && booking.quote.items.length > 0 && (
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <h4
              className={`font-semibold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Quote Items
            </h4>
            <div className="space-y-2">
              {booking.quote.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    {item.name} x{item.qty}
                  </span>
                  <span className={darkMode ? "text-white" : "text-gray-900"}>
                    ₦{item.totalPrice?.toLocaleString()}
                  </span>
                </div>
              ))}
              <div
                className={`pt-2 mt-2 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } flex justify-between font-semibold`}
              >
                <span className={darkMode ? "text-white" : "text-gray-900"}>
                  Total
                </span>
                <span className="text-accent">
                  ₦
                  {(
                    booking.totalPrice ||
                    booking.quote?.totalPrice ||
                    0
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Special Requests */}
        {booking.specialRequests && (
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <h4
              className={`font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Special Requests
            </h4>
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              {booking.specialRequests}
            </p>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <h4
              className={`font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Notes
            </h4>
            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              {booking.notes}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex items-center gap-2 text-sm">
          <Clock
            size={14}
            className={darkMode ? "text-gray-400" : "text-gray-500"}
          />
          <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
            Created: {new Date(booking.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </Modal>
  );
}

// Edit Booking Status Modal
function EditStatusModal({
  booking,
  isOpen,
  onClose,
  onSave,
  darkMode,
}: {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: string) => void;
  darkMode: boolean;
}) {
  const [status, setStatus] = useState(booking?.status || "PENDING");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (booking) setStatus(booking.status);
  }, [booking]);

  if (!booking) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave(status);
    setSaving(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Booking Status"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-accent/50`}
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Status"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

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

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

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
    return new Date(dateString).toLocaleDateString("en-NG", {
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

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  // Handle status update
  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedBooking) return;

    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === selectedBooking.id ? { ...b, status: newStatus } : b
          )
        );
        setEditModalOpen(false);
        showToast("Booking status updated successfully", "success");
        fetchBookings(); // Refresh to update counts
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update booking status", "error");
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      showToast("An error occurred while updating booking", "error");
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
        setDeleteDialogOpen(false);
        showToast("Booking deleted successfully", "success");
        fetchBookings(); // Refresh to update counts
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete booking", "error");
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      showToast("An error occurred while deleting booking", "error");
    }
  };

  // Open view modal
  const openViewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
    setActionMenuOpen(null);
  };

  // Open edit modal
  const openEditModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditModalOpen(true);
    setActionMenuOpen(null);
  };

  // Open delete dialog
  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
    setActionMenuOpen(null);
  };

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
                        ₦
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
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActionMenuOpen(
                                actionMenuOpen === booking.id
                                  ? null
                                  : booking.id
                              )
                            }
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <MoreVertical size={16} className={textMuted} />
                          </button>
                          {actionMenuOpen === booking.id && (
                            <div
                              className={`absolute right-0 top-full mt-1 w-40 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-20 py-1`}
                            >
                              <button
                                onClick={() => openViewModal(booking)}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${textSecondary} ${
                                  darkMode
                                    ? "hover:bg-white/5"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <Eye size={14} /> View Details
                              </button>
                              <button
                                onClick={() => openEditModal(booking)}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${textSecondary} ${
                                  darkMode
                                    ? "hover:bg-white/5"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <Edit2 size={14} /> Update Status
                              </button>
                              <button
                                onClick={() => openDeleteDialog(booking)}
                                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
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

      {/* View Modal */}
      <ViewBookingModal
        booking={selectedBooking}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        darkMode={darkMode}
      />

      {/* Edit Status Modal */}
      <EditStatusModal
        booking={selectedBooking}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdateStatus}
        darkMode={darkMode}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteBooking}
        title="Delete Booking"
        message={`Are you sure you want to delete booking #${selectedBooking?.id
          .slice(-8)
          .toUpperCase()}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-2"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
