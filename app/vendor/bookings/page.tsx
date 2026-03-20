"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/formatters";
import {
  Search, ChevronLeft, ChevronRight, MoreVertical, Loader2,
  Calendar, Eye, CheckCircle, Clock, MapPin, User, Mail,
  Phone, FileText, X, MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { logger } from "@/lib/logger";

interface QuoteItem { name: string; qty: number; unitPrice: number; totalPrice: number; }

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
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  statusTimeline: { status: string; timestamp: string; note?: string }[];
  createdAt: string;
  quote: {
    id: string;
    items: QuoteItem[];
    totalPrice: number;
    inquiry: { fromName: string; fromEmail: string; fromPhone: string | null; message: string; } | null;
  } | null;
}

interface Pagination { page: number; limit: number; total: number; pages: number; }

// ─── helpers ─────────────────────────────────────────────────────────────────

function isEventTomorrow(eventDate: string): boolean {
  const now = new Date();
  const event = new Date(eventDate);
  const diffMs = event.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 1 && diffDays >= -1; // within 1 day window
}

function getStatusStyle(status: string) {
  switch (status) {
    case "CONFIRMED": case "FULLY_PAID": return "bg-green-500/20 text-green-600 border border-green-500/30";
    case "DEPOSIT_PAID": case "BALANCE_SCHEDULED": return "bg-accent/20 text-accent border border-accent/30";
    case "PENDING_PAYMENT": return "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30";
    case "CANCELLED": case "REFUNDED": return "bg-red-500/20 text-red-600 border border-red-500/30";
    case "COMPLETED": return "bg-blue-500/20 text-blue-600 border border-blue-500/30";
    default: return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

// ─── View Booking Modal ───────────────────────────────────────────────────────

function ViewBookingModal({ booking, isOpen, onClose }: { booking: Booking | null; isOpen: boolean; onClose: () => void; }) {
  if (!booking) return null;
  const getStatusColor = (s: string) => {
    switch (s) {
      case "CONFIRMED": case "FULLY_PAID": return "bg-green-500";
      case "COMPLETED": return "bg-blue-500";
      case "PENDING_PAYMENT": case "DEPOSIT_PAID": return "bg-amber-500";
      case "CANCELLED": case "REFUNDED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  const fmtLong = (d: string) => new Date(d).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details" size="lg">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="font-mono text-lg font-semibold">#{booking.id.slice(-8).toUpperCase()}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${getStatusColor(booking.status)}`}>
            {booking.status.replace(/_/g, " ")}
          </span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2"><User size={16} /> Client Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2"><User size={14} className="text-gray-400" /><span>{booking.clientName}</span></div>
            <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /><span>{booking.clientEmail}</span></div>
            {booking.clientPhone && <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /><span>{booking.clientPhone}</span></div>}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2"><Calendar size={16} /> Event Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><p className="text-sm text-gray-500">Date</p><p className="font-medium">{fmtLong(booking.eventDate)}</p></div>
            {booking.eventLocation && <div><p className="text-sm text-gray-500">Location</p><p className="font-medium flex items-center gap-1"><MapPin size={14} />{booking.eventLocation}</p></div>}
            {booking.guestsCount && <div><p className="text-sm text-gray-500">Guests</p><p className="font-medium">{booking.guestsCount} people</p></div>}
          </div>
        </div>
        {booking.quote?.items && booking.quote.items.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><FileText size={16} /> Services & Pricing</h4>
            <div className="space-y-2">
              {booking.quote.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                  <span>{item.name} x{item.qty}</span>
                  <span className="font-medium">{formatCurrency(item.totalPrice ?? 0)}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t-2 border-gray-300 flex justify-between font-bold">
                <span>Total</span><span className="text-accent">{formatCurrency(booking.pricingTotal ?? 0)}</span>
              </div>
            </div>
          </div>
        )}
        {booking.specialRequests && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Special Requests</h4>
            <p className="text-gray-600">{booking.specialRequests}</p>
          </div>
        )}
        {booking.statusTimeline && booking.statusTimeline.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><Clock size={16} /> Status History</h4>
            <div className="space-y-3">
              {booking.statusTimeline.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-accent" />
                  <div>
                    <p className="font-medium">{entry.status.replace(/_/g, " ")}</p>
                    <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                    {entry.note && <p className="text-sm text-gray-600 mt-1">{entry.note}</p>}
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

// ─── Cancellation Request Modal ───────────────────────────────────────────────

function CancelRequestModal({ booking, isOpen, onClose, onSend }: {
  booking: Booking | null; isOpen: boolean; onClose: () => void;
  onSend: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSend = async () => {
    if (!reason.trim()) return;
    setSending(true);
    try { await onSend(reason); onClose(); setReason(""); }
    finally { setSending(false); }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-white/10 w-full max-w-md shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-accent" /> Request Cancellation
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Describe why you'd like to cancel booking <span className="font-mono font-semibold">#{booking.id.slice(-8).toUpperCase()}</span>. Your message will be sent directly to the admin for review.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain your reason for cancellation..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#141414] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
        />
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
            Never mind
          </button>
          <button onClick={handleSend} disabled={sending || !reason.trim()} className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {sending && <Loader2 size={14} className="animate-spin" />}
            {sending ? "Sending..." : "Send to Admin"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Actions Modal (portal, centered) ────────────────────────────────────────

function BookingActionsModal({ booking, isOpen, onClose, onView, onMarkComplete, onRequestCancel, actionLoading, darkMode }: {
  booking: Booking | null; isOpen: boolean; onClose: () => void;
  onView: () => void; onMarkComplete: () => void; onRequestCancel: () => void;
  actionLoading: boolean; darkMode: boolean;
}) {
  if (!isOpen || !booking) return null;

  const canComplete = booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && isEventTomorrow(booking.eventDate);
  const canRequestCancel = booking.status !== "COMPLETED" && booking.status !== "CANCELLED";

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-xs rounded-2xl border shadow-2xl overflow-hidden ${darkMode ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-200"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-4 py-3 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Booking #{booking.id.slice(-8).toUpperCase()}
          </p>
          <p className={`text-sm font-semibold mt-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>{booking.clientName}</p>
        </div>
        <div className="py-1">
          <button onClick={() => { onView(); onClose(); }} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 ${darkMode ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"} transition-colors`}>
            <Eye size={16} className="text-gray-400" /> View Details
          </button>
          {canComplete && (
            <button onClick={() => { onMarkComplete(); onClose(); }} disabled={actionLoading} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 text-green-600 disabled:opacity-50 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
              {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              Mark as Completed
            </button>
          )}
          {canRequestCancel && (
            <button onClick={() => { onRequestCancel(); onClose(); }} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 text-amber-600 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
              <MessageSquare size={16} /> Request Cancellation
            </button>
          )}
        </div>
        <div className={`px-4 py-3 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <button onClick={onClose} className={`w-full py-2 rounded-lg text-sm font-medium ${darkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} transition-colors`}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VendorBookingsPage() {
  const { darkMode } = useVendorTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  useEffect(() => { fetchBookings(); }, [pagination.page, statusFilter]);

  async function fetchBookings() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page.toString(), limit: pagination.limit.toString() });
      if (statusFilter) params.append("status", statusFilter);
      const res = await fetch(`/api/bookings?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setPagination((prev) => ({ ...prev, total: data.pagination?.total || 0, pages: data.pagination?.pages || 0 }));
      }
    } catch (err) { logger.error("Error fetching bookings:", err); }
    finally { setIsLoading(false); }
  }

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleMarkComplete = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (res.ok) { showToast("Booking marked as completed", "success"); fetchBookings(); }
      else { const d = await res.json(); showToast(d.message || "Failed", "error"); }
    } catch { showToast("An error occurred", "error"); }
    finally { setActionLoading(false); }
  };

  const handleCancelRequest = async (reason: string) => {
    if (!selectedBooking) return;
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}/cancel-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        showToast("Cancellation request sent to admin", "success");
        fetchBookings();
      } else {
        const d = await res.json();
        showToast(d.message || "Failed to send request", "error");
      }
    } catch { showToast("Failed to send request", "error"); }
  };

  const openActions = (booking: Booking) => { setSelectedBooking(booking); setActionsModalOpen(true); };

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.clientName?.toLowerCase().includes(q) || b.quote?.inquiry?.fromName?.toLowerCase().includes(q) || b.eventType?.toLowerCase().includes(q);
  });

  if (isLoading) {
    return (
      <VendorLayout title="Bookings">
        <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout title="Bookings">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Search by client name, event..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-lg ${darkMode ? "bg-[#141414] text-white border-white/10" : "bg-white text-gray-900 border-gray-200"} border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm`} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-3 rounded-lg ${darkMode ? "bg-[#141414] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"} border text-sm`}>
          <option value="">All Status</option>
          <option value="PENDING_PAYMENT">Pending Payment</option>
          <option value="DEPOSIT_PAID">Deposit Paid</option>
          <option value="FULLY_PAID">Fully Paid</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className={`rounded-xl border p-12 text-center ${darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"}`}>
          <Calendar size={48} className={`mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>No bookings found</h3>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>{searchQuery || statusFilter ? "Try adjusting your filters" : "You don't have any bookings yet"}</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className={`hidden md:block ${darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"} rounded-xl border overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-gray-500 text-xs uppercase tracking-wider ${darkMode ? "border-white/10" : "border-gray-200"} border-b`}>
                    <th className="text-left px-6 py-4 font-medium">Client</th>
                    <th className="text-left px-6 py-4 font-medium">Event</th>
                    <th className="text-left px-6 py-4 font-medium">Event Date</th>
                    <th className="text-left px-6 py-4 font-medium">Status</th>
                    <th className="text-right px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className={`${darkMode ? "border-white/10 hover:bg-white/5" : "border-gray-200 hover:bg-gray-50"} border-b transition-colors`}>
                      <td className="px-6 py-5">
                        <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{booking.clientName || booking.quote?.inquiry?.fromName || "Client"}</p>
                        <p className="text-sm text-gray-500">{booking.clientEmail}</p>
                      </td>
                      <td className={`px-6 py-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{booking.eventType || "Event"}</td>
                      <td className={`px-6 py-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{formatDate(booking.eventDate)}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>{booking.status.replace(/_/g, " ")}</span>
                      </td>
                      <td className={`px-6 py-5 text-right font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{formatCurrency(booking.pricingTotal ?? 0)}</td>
                      <td className="px-6 py-5">
                        <button onClick={() => openActions(booking)} className={`p-2 rounded-lg ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className={`${darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"} rounded-xl border p-4`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{booking.clientName || booking.quote?.inquiry?.fromName || "Client"}</p>
                    <p className="text-gray-500 text-sm">{booking.eventType || "Event"}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>{booking.status.replace(/_/g, " ")}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Event Date</span><span className={darkMode ? "text-gray-300" : "text-gray-700"}>{formatDate(booking.eventDate)}</span></div>
                  <div className={`flex justify-between pt-2 ${darkMode ? "border-white/10" : "border-gray-200"} border-t`}>
                    <span className="text-gray-500">Total</span>
                    <span className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{formatCurrency(booking.pricingTotal ?? 0)}</span>
                  </div>
                </div>
                <button onClick={() => openActions(booking)} className={`mt-4 w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"}`}>
                  <MoreVertical size={14} /> Actions
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <button onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={pagination.page === 1}
                className={`flex items-center gap-2 ${pagination.page === 1 ? "opacity-50 cursor-not-allowed" : darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"} transition-colors text-sm`}>
                <ChevronLeft size={18} /><span>Previous</span>
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => i + 1).map((pageNum) => (
                  <button key={pageNum} onClick={() => setPagination((p) => ({ ...p, page: pageNum }))}
                    className={`w-9 h-9 rounded-lg font-medium text-sm ${pagination.page === pageNum ? "bg-accent text-white" : darkMode ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"}`}>
                    {pageNum}
                  </button>
                ))}
              </div>
              <button onClick={() => setPagination((p) => ({ ...p, page: Math.min(pagination.pages, p.page + 1) }))} disabled={pagination.page === pagination.pages}
                className={`flex items-center gap-2 ${pagination.page === pagination.pages ? "opacity-50 cursor-not-allowed" : darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"} transition-colors text-sm`}>
                <span>Next</span><ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ViewBookingModal booking={selectedBooking} isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} />

      <BookingActionsModal
        booking={selectedBooking} isOpen={actionsModalOpen} onClose={() => setActionsModalOpen(false)}
        onView={() => setViewModalOpen(true)}
        onMarkComplete={handleMarkComplete}
        onRequestCancel={() => setCancelModalOpen(true)}
        actionLoading={actionLoading} darkMode={darkMode}
      />

      <CancelRequestModal
        booking={selectedBooking} isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)}
        onSend={handleCancelRequest}
      />

      {toast.show && (
        <div className={`fixed top-24 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.message}
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-2"><X size={16} /></button>
        </div>
      )}
    </VendorLayout>
  );
}
