"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import { Modal } from "@/components/ui/Modal";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  Calendar,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

interface QuoteItem {
  name: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

interface Booking {
  id: string;
  eventDate: string;
  eventLocation: string | null;
  eventType: string | null;
  guestsCount: number | null;
  specialRequests: string | null;
  pricingTotal: number;
  depositAmount: number | null;
  balanceAmount: number | null;
  paymentMode: string;
  status: string;
  notes: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  statusTimeline: { status: string; timestamp: string; note?: string }[];
  createdAt: string;
  quote: {
    id: string;
    items: QuoteItem[];
    totalPrice: number;
    inquiry: {
      fromName: string;
      fromEmail: string;
      fromPhone: string | null;
      message: string;
    } | null;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "FULLY_PAID":
        return "bg-green-500";
      case "COMPLETED":
        return "bg-blue-500";
      case "PENDING_PAYMENT":
      case "DEPOSIT_PAID":
        return "bg-amber-500";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details" size="lg">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="font-mono text-lg font-semibold">
              #{booking.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium text-white ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Client Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <User size={16} /> Client Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <span>{booking.clientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              <span>{booking.clientEmail}</span>
            </div>
            {booking.clientPhone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <span>{booking.clientPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar size={16} /> Event Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{formatDate(booking.eventDate)}</p>
            </div>
            {booking.eventLocation && (
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin size={14} /> {booking.eventLocation}
                </p>
              </div>
            )}
            {booking.guestsCount && (
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium">{booking.guestsCount} people</p>
              </div>
            )}
            {booking.eventType && (
              <div>
                <p className="text-sm text-gray-500">Event Type</p>
                <p className="font-medium">{booking.eventType}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quote Items */}
        {booking.quote?.items && booking.quote.items.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileText size={16} /> Services & Pricing
            </h4>
            <div className="space-y-2">
              {booking.quote.items.map((item: QuoteItem, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between py-2 border-b border-gray-200 last:border-0"
                >
                  <span>
                    {item.name} x{item.qty}
                  </span>
                  <span className="font-medium">
                    ₦{item.totalPrice?.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t-2 border-gray-300 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-accent">
                  ₦{booking.pricingTotal?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Payment Details</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Payment Mode</p>
              <p className="font-medium">
                {booking.paymentMode?.replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-medium">
                ₦{booking.pricingTotal?.toLocaleString()}
              </p>
            </div>
            {booking.depositAmount && (
              <div>
                <p className="text-gray-500">Deposit</p>
                <p className="font-medium">
                  ₦{booking.depositAmount?.toLocaleString()}
                </p>
              </div>
            )}
            {booking.balanceAmount && (
              <div>
                <p className="text-gray-500">Balance</p>
                <p className="font-medium">
                  ₦{booking.balanceAmount?.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Special Requests</h4>
            <p className="text-gray-600">{booking.specialRequests}</p>
          </div>
        )}

        {/* Status Timeline */}
        {booking.statusTimeline && booking.statusTimeline.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Clock size={16} /> Status History
            </h4>
            <div className="space-y-3">
              {booking.statusTimeline.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-accent" />
                  <div>
                    <p className="font-medium">
                      {entry.status.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    {entry.note && (
                      <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Update Status Modal Component
function UpdateStatusModal({
  booking,
  isOpen,
  onClose,
  onUpdate,
}: {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (status: string, note: string) => Promise<void>;
}) {
  const [status, setStatus] = useState(booking?.status || "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (booking) {
      setStatus(booking.status);
      setNote("");
    }
  }, [booking]);

  if (!booking) return null;

  const statusOptions = [
    { value: "PENDING_PAYMENT", label: "Pending Payment" },
    { value: "DEPOSIT_PAID", label: "Deposit Paid" },
    { value: "FULLY_PAID", label: "Fully Paid" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onUpdate(status, note);
      onClose();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Booking Status">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this status change..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || status === booking.status}
            className="flex-1 px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </Modal>
  );
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

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

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

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleUpdateStatus = async (newStatus: string, note: string) => {
    if (!selectedBooking) return;

    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });

      if (res.ok) {
        showToast("Booking status updated successfully", "success");
        fetchBookings();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to update status", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    }
  };

  const handleMarkComplete = async (booking: Booking) => {
    try {
      const res = await fetch(`/api/bookings/${booking.id}/complete`, {
        method: "POST",
      });

      if (res.ok) {
        showToast("Booking marked as completed", "success");
        fetchBookings();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to complete booking", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    }
    setActionMenuOpen(null);
  };

  const handleCancelBooking = async (booking: Booking) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Cancelled by vendor" }),
      });

      if (res.ok) {
        showToast("Booking cancelled", "success");
        fetchBookings();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to cancel booking", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    }
    setActionMenuOpen(null);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.clientName?.toLowerCase().includes(query) ||
      booking.quote?.inquiry?.fromName?.toLowerCase().includes(query) ||
      booking.eventType?.toLowerCase().includes(query)
    );
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "FULLY_PAID":
        return "bg-green-500/20 text-green-600 border border-green-500/30";
      case "DEPOSIT_PAID":
      case "BALANCE_SCHEDULED":
        return "bg-accent/20 text-accent border border-accent/30";
      case "PENDING_PAYMENT":
        return "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-500/20 text-red-600 border border-red-500/30";
      case "COMPLETED":
        return "bg-blue-500/20 text-blue-600 border border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
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
    <VendorLayout title="Bookings">
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
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="DEPOSIT_PAID">Deposit Paid</option>
            <option value="FULLY_PAID">Fully Paid</option>
            <option value="CONFIRMED">Confirmed</option>
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
                    <th className="text-left px-6 py-4 font-medium">Client</th>
                    <th className="text-left px-6 py-4 font-medium">Event</th>
                    <th className="text-left px-6 py-4 font-medium">
                      Event Date
                    </th>
                    <th className="text-left px-6 py-4 font-medium">Status</th>
                    <th className="text-right px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 w-20"></th>
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
                      <td className="px-6 py-5">
                        <div>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {booking.clientName ||
                              booking.quote?.inquiry?.fromName ||
                              "Client"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.clientEmail}
                          </p>
                        </div>
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
                          {booking.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-5 text-right font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ₦{booking.pricingTotal?.toLocaleString() || "0"}
                      </td>
                      <td className="px-6 py-5">
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
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>
                          {actionMenuOpen === booking.id && (
                            <div
                              className={`absolute right-0 top-full mt-1 w-48 ${
                                darkMode
                                  ? "bg-[#1a1a1a] border-white/10"
                                  : "bg-white border-gray-200"
                              } border rounded-lg shadow-lg z-20 py-1`}
                            >
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setViewModalOpen(true);
                                  setActionMenuOpen(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                                  darkMode
                                    ? "text-gray-300 hover:bg-white/5"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <Eye size={14} /> View Details
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setUpdateModalOpen(true);
                                  setActionMenuOpen(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                                  darkMode
                                    ? "text-gray-300 hover:bg-white/5"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <Edit2 size={14} /> Update Status
                              </button>
                              {booking.status !== "COMPLETED" &&
                                booking.status !== "CANCELLED" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleMarkComplete(booking)
                                      }
                                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-green-600 ${
                                        darkMode
                                          ? "hover:bg-white/5"
                                          : "hover:bg-gray-50"
                                      }`}
                                    >
                                      <CheckCircle size={14} /> Mark Complete
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleCancelBooking(booking)
                                      }
                                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-red-500 ${
                                        darkMode
                                          ? "hover:bg-white/5"
                                          : "hover:bg-gray-50"
                                      }`}
                                    >
                                      <XCircle size={14} /> Cancel Booking
                                    </button>
                                  </>
                                )}
                            </div>
                          )}
                        </div>
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
                      {booking.clientName ||
                        booking.quote?.inquiry?.fromName ||
                        "Client"}
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
                    {booking.status.replace(/_/g, " ")}
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
                      ₦{booking.pricingTotal?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setViewModalOpen(true);
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      darkMode
                        ? "bg-white/10 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setUpdateModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-accent text-white"
                  >
                    Update
                  </button>
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

      {/* View Modal */}
      <ViewBookingModal
        booking={selectedBooking}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        darkMode={darkMode}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        booking={selectedBooking}
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onUpdate={handleUpdateStatus}
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
    </VendorLayout>
  );
}
