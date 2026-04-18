"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "sonner";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Banknote,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  X,
} from "lucide-react";

interface Payout {
  id: string;
  amount: number;
  currency: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode?: string;
  notes?: string;
  status: string;
  rejectedReason?: string;
  processedAt?: string;
  createdAt: string;
  provider: { id: string; businessName: string; city?: string };
}

const STATUS_OPTIONS = ["all", "PENDING", "APPROVED", "PROCESSING", "PAID", "REJECTED", "CANCELLED"];

const statusStyle: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  PAID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CANCELLED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const statusIcon: Record<string, React.ReactNode> = {
  PENDING: <Clock size={14} />,
  APPROVED: <CheckCircle size={14} />,
  PROCESSING: <Loader2 size={14} className="animate-spin" />,
  PAID: <CheckCircle size={14} />,
  REJECTED: <XCircle size={14} />,
  CANCELLED: <XCircle size={14} />,
};

export default function AdminPayoutsPage() {
  const { darkMode, cardBg, cardBorder, textPrimary, textSecondary, textMuted, inputBg, inputBorder } = useAdminTheme();

  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const fetchPayouts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });
      const res = await fetch(`/api/admin/payouts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPayouts(data.payouts || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(Math.max(1, data.pagination?.totalPages || 1));
      }
    } catch {
      toast.error("Failed to load payouts");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, debouncedSearch]);

  useEffect(() => { fetchPayouts(); }, [fetchPayouts]);

  async function updateStatus(id: string, status: string, rejectedReason?: string) {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/payouts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectedReason }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed to update"); return; }
      toast.success(data.message);
      setSelectedPayout(null);
      setRejectReason("");
      setShowRejectInput(false);
      fetchPayouts();
    } catch {
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  }

  const inputCls = `w-full px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`;

  return (
    <AdminLayout title="Payouts">
      <div className="space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Requests", value: total, color: "text-accent" },
            { label: "Pending", value: payouts.filter(p => p.status === "PENDING").length, color: "text-yellow-500" },
            { label: "Paid", value: payouts.filter(p => p.status === "PAID").length, color: "text-green-500" },
            { label: "Total Paid Out", value: formatCurrency(payouts.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0)), color: "text-blue-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className={textMuted}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search by vendor, bank, account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className={`appearance-none px-4 py-2.5 pr-8 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 min-w-[160px]`}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>
              ))}
            </select>
            <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 ${textMuted} pointer-events-none`} />
          </div>
        </div>

        {/* Table */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}>
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className={`w-8 h-8 animate-spin ${textMuted}`} />
            </div>
          ) : payouts.length === 0 ? (
            <div className="p-12 text-center">
              <Banknote className={`w-12 h-12 mx-auto mb-3 ${textMuted}`} />
              <p className={`${textPrimary} font-medium`}>No payout requests found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? "bg-white/5" : "bg-gray-50"}>
                    <tr>
                      {["Vendor", "Bank Details", "Amount", "Status", "Requested", "Actions"].map((h, i) => (
                        <th key={h} className={`px-6 py-4 text-left text-xs font-medium ${textMuted} uppercase tracking-wider ${i === 5 ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? "divide-white/5" : "divide-gray-100"}`}>
                    {payouts.map((payout) => (
                      <tr key={payout.id} className={`${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
                        <td className="px-6 py-4">
                          <p className={`font-medium text-sm ${textPrimary}`}>{payout.provider.businessName}</p>
                          {payout.provider.city && <p className={`text-xs ${textMuted}`}>{payout.provider.city}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-sm ${textPrimary}`}>{payout.bankName}</p>
                          <p className={`text-xs ${textMuted}`}>{payout.accountName} · {payout.accountNumber}</p>
                          {payout.sortCode && <p className={`text-xs ${textMuted}`}>Sort: {payout.sortCode}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <p className={`font-semibold ${textPrimary}`}>{formatCurrency(payout.amount)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[payout.status] || ""}`}>
                            {statusIcon[payout.status]}
                            {payout.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${textMuted}`}>
                          {new Date(payout.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedPayout(payout)}
                            className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t ${darkMode ? "border-white/10" : "border-gray-200"}`}>
                <p className={`text-sm ${textMuted}`}>
                  Showing page {currentPage} of {totalPages} ({total} requests)
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"} transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <ChevronLeft size={18} className={textMuted} />
                  </button>
                  {Array.from({ length: Math.max(1, Math.min(5, totalPages)) }, (_, i) => {
                    const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                    return (
                      <button
                        key={page}
                        onClick={() => totalPages > 1 && setCurrentPage(page)}
                        disabled={totalPages <= 1}
                        className={`w-9 h-9 rounded flex items-center justify-center text-sm transition-colors ${
                          currentPage === page ? "bg-accent text-white" : `${textSecondary} ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"} disabled:opacity-30`
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages <= 1}
                    className={`p-2 rounded ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"} transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <ChevronRight size={18} className={textMuted} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Manage Payout Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`${cardBg} border ${cardBorder} rounded-2xl w-full max-w-md shadow-2xl`}>
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
              <h2 className={`font-semibold ${textPrimary}`}>Manage Payout Request</h2>
              <button onClick={() => { setSelectedPayout(null); setShowRejectInput(false); setRejectReason(""); }}
                className={`p-2 rounded-lg ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                <X size={18} className={textMuted} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Details */}
              <div className={`p-4 rounded-xl ${darkMode ? "bg-white/5" : "bg-gray-50"} space-y-2 text-sm`}>
                <div className="flex justify-between"><span className={textMuted}>Vendor</span><span className={`font-medium ${textPrimary}`}>{selectedPayout.provider.businessName}</span></div>
                <div className="flex justify-between"><span className={textMuted}>Amount</span><span className={`font-bold text-accent`}>{formatCurrency(selectedPayout.amount)}</span></div>
                <div className="flex justify-between"><span className={textMuted}>Bank</span><span className={textPrimary}>{selectedPayout.bankName}</span></div>
                <div className="flex justify-between"><span className={textMuted}>Account Name</span><span className={textPrimary}>{selectedPayout.accountName}</span></div>
                <div className="flex justify-between"><span className={textMuted}>Account No.</span><span className={textPrimary}>{selectedPayout.accountNumber}</span></div>
                {selectedPayout.sortCode && <div className="flex justify-between"><span className={textMuted}>Sort Code</span><span className={textPrimary}>{selectedPayout.sortCode}</span></div>}
                {selectedPayout.notes && <div className="flex justify-between"><span className={textMuted}>Notes</span><span className={textPrimary}>{selectedPayout.notes}</span></div>}
                <div className="flex justify-between"><span className={textMuted}>Status</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[selectedPayout.status]}`}>
                    {statusIcon[selectedPayout.status]}{selectedPayout.status}
                  </span>
                </div>
              </div>

              {/* Reject reason input */}
              {showRejectInput && (
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${textPrimary}`}>Reason for rejection *</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Explain why this request is being rejected..."
                    className={`${inputCls} resize-none`}
                  />
                </div>
              )}

              {/* Actions */}
              {selectedPayout.status === "PENDING" && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(selectedPayout.id, "APPROVED")} disabled={actionLoading}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve
                  </button>
                  {!showRejectInput ? (
                    <button onClick={() => setShowRejectInput(true)}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                      <XCircle size={14} /> Reject
                    </button>
                  ) : (
                    <button onClick={() => { if (!rejectReason.trim()) { toast.error("Please provide a reason"); return; } updateStatus(selectedPayout.id, "REJECTED", rejectReason); }}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Confirm Reject
                    </button>
                  )}
                </div>
              )}
              {selectedPayout.status === "APPROVED" && (
                <button onClick={() => updateStatus(selectedPayout.id, "PROCESSING")} disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : null} Mark as Processing
                </button>
              )}
              {selectedPayout.status === "PROCESSING" && (
                <button onClick={() => updateStatus(selectedPayout.id, "PAID")} disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Mark as Paid
                </button>
              )}
              {["PAID", "REJECTED", "CANCELLED"].includes(selectedPayout.status) && (
                <p className={`text-center text-sm ${textMuted}`}>This request has been finalised.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
