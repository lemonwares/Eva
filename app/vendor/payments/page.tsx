"use client";

import { logger } from "@/lib/logger";
import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import { formatCurrency } from "@/lib/formatters";
import {
  Search,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  CalendarDays,
  ChevronDown,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Banknote,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  description: string;
  date: string;
  type: "income" | "fee" | "withdrawal";
  status: "completed" | "pending" | "failed";
  amount: number;
  clientName?: string;
}

interface PaymentStats {
  availableBalance: number;
  pendingAmount: number;
  thisMonth: number;
  totalEarned: number;
  pendingCount: number;
}

interface WithdrawForm {
  amount: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  notes: string;
}

export default function VendorPaymentsPage() {
  const { darkMode } = useVendorTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    availableBalance: 0,
    pendingAmount: 0,
    thisMonth: 0,
    totalEarned: 0,
    pendingCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState<WithdrawForm>({
    amount: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    sortCode: "",
    notes: "",
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  async function fetchPaymentData() {
    setIsLoading(true);
    try {
      const [bookingsRes, payoutsRes] = await Promise.all([
        fetch("/api/bookings?limit=100"),
        fetch("/api/vendor/payouts?limit=100"),
      ]);

      let totalEarned = 0;
      let pendingAmount = 0;
      let pendingCount = 0;
      let thisMonthEarned = 0;
      const txns: Transaction[] = [];

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        const bookings = data.bookings || [];
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        bookings.forEach((booking: any) => {
          const amount = booking.pricingTotal || booking.quote?.totalPrice || 0;
          const eventDate = new Date(booking.eventDate);
          const isCompleted = booking.status === "COMPLETED";
          const isPending = ["PENDING", "CONFIRMED", "DEPOSIT_PAID"].includes(booking.status);

          if (amount > 0) {
            txns.push({
              id: booking.id,
              description: booking.eventType || "Booking",
              date: eventDate.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" }),
              type: "income",
              status: isCompleted ? "completed" : "pending",
              amount,
              clientName: booking.quote?.inquiry?.fromName || booking.clientName,
            });

            if (isCompleted) {
              totalEarned += amount;
              const fee = amount * 0.05;
              txns.push({
                id: `${booking.id}-fee`,
                description: "Platform Fee (5%)",
                date: eventDate.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" }),
                type: "fee",
                status: "completed",
                amount: -fee,
              });
            }

            if (isPending) { pendingAmount += amount; pendingCount++; }
            if (eventDate >= thisMonthStart) thisMonthEarned += amount;
          }
        });
      }

      // Add payout withdrawals to transaction list
      if (payoutsRes.ok) {
        const payoutData = await payoutsRes.json();
        (payoutData.payouts || []).forEach((p: any) => {
          txns.push({
            id: `payout-${p.id}`,
            description: `Withdrawal — ${p.bankName}`,
            date: new Date(p.createdAt).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" }),
            type: "withdrawal",
            status: p.status === "PAID" ? "completed" : p.status === "REJECTED" ? "failed" : "pending",
            amount: -p.amount,
          });
        });
      }

      txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Available = earned after fees minus pending/approved/paid payouts
      const afterFees = totalEarned * 0.95;
      const requestedPayouts = txns
        .filter((t) => t.type === "withdrawal" && t.status !== "failed")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const availableBalance = Math.max(0, afterFees - requestedPayouts);

      setTransactions(txns);
      setStats({ availableBalance, pendingAmount, thisMonth: thisMonthEarned, totalEarned, pendingCount });
    } catch (err) {
      logger.error("Error fetching payment data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleWithdrawSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(withdrawForm.amount);

    if (!amount || amount <= 0) { toast.error("Enter a valid amount"); return; }
    if (amount > stats.availableBalance) {
      toast.error(`Amount exceeds available balance of ${formatCurrency(stats.availableBalance)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vendor/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          bankName: withdrawForm.bankName,
          accountName: withdrawForm.accountName,
          accountNumber: withdrawForm.accountNumber,
          sortCode: withdrawForm.sortCode || undefined,
          notes: withdrawForm.notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed to submit request"); return; }

      toast.success("Withdrawal request submitted! We'll process it within 2–3 business days.");
      setShowWithdrawModal(false);
      setWithdrawForm({ amount: "", bankName: "", accountName: "", accountNumber: "", sortCode: "", notes: "" });
      fetchPaymentData();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const card = `${darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"} rounded-xl border`;
  const text = darkMode ? "text-white" : "text-gray-900";
  const muted = darkMode ? "text-gray-400" : "text-gray-600";
  const inputCls = `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 ${
    darkMode ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
  }`;

  const getTypeStyle = (type: string) =>
    type === "income" ? "text-green-400" : type === "fee" ? "text-red-400" : "text-yellow-400";

  const getTypeIcon = (type: string) =>
    type === "income" ? <ArrowDownLeft size={16} className="text-green-400" /> :
    <ArrowUpRight size={16} className="text-red-400" />;

  const getStatusIcon = (status: string) =>
    status === "completed" ? <CheckCircle size={14} className="text-green-400" /> :
    status === "failed" ? <XCircle size={14} className="text-red-400" /> :
    <Clock size={14} className="text-yellow-400" />;

  return (
    <VendorLayout
      title="Payments"
      actionButton={{
        label: "Withdraw Funds",
        onClick: () => setShowWithdrawModal(true),
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className={`w-8 h-8 animate-spin ${text}`} />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Available Balance", value: stats.availableBalance, icon: DollarSign, color: "green", sub: "Available for withdrawal" },
              { label: "Pending", value: stats.pendingAmount, icon: Clock, color: "yellow", sub: `${stats.pendingCount} pending` },
              { label: "This Month", value: stats.thisMonth, icon: TrendingUp, color: "accent", sub: "Current month earnings" },
              { label: "Total Earned", value: stats.totalEarned, icon: DollarSign, color: "blue", sub: "Lifetime earnings" },
            ].map(({ label, value, icon: Icon, color, sub }) => (
              <div key={label} className={`${card} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <div className={`p-2 rounded-lg bg-${color}-500/20`}>
                    <Icon size={18} className={`text-${color}-400`} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${text}`}>{formatCurrency(value)}</p>
                <p className={`text-sm mt-2 ${color === "accent" ? "text-accent" : `text-${color}-400`}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                  darkMode ? "bg-[#141414] text-white border-white/10" : "bg-white text-gray-900 border-gray-200"
                }`}
              />
            </div>
            <button className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors text-sm ${
              darkMode ? "bg-[#141414] border-white/10 text-white hover:bg-white/10" : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
            }`}>
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

          {/* Transactions Table */}
          <div className={`${card} overflow-hidden`}>
            <div className={`px-6 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
              <h3 className={`${text} font-semibold`}>Transaction History</h3>
            </div>
            {filteredTransactions.length === 0 ? (
              <div className={`p-8 text-center ${muted}`}>No transactions found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`text-gray-500 text-xs uppercase tracking-wider border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
                      {["Description", "Date", "Type", "Status", "Amount"].map((h, i) => (
                        <th key={h} className={`px-6 py-4 font-medium ${i === 4 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className={`border-b transition-colors ${darkMode ? "border-white/10 hover:bg-white/5" : "border-gray-200 hover:bg-gray-50"}`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${darkMode ? "bg-white/5" : "bg-gray-100"}`}>{getTypeIcon(tx.type)}</div>
                            <div>
                              <span className={`font-medium ${text}`}>{tx.description}</span>
                              {tx.clientName && <p className="text-gray-500 text-sm">{tx.clientName}</p>}
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-5 ${muted}`}>{tx.date}</td>
                        <td className="px-6 py-5"><span className={`capitalize font-medium ${getTypeStyle(tx.type)}`}>{tx.type}</span></td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tx.status)}
                            <span className={`capitalize ${muted}`}>{tx.status}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-5 text-right font-medium ${getTypeStyle(tx.type)}`}>
                          {tx.amount < 0 ? "-" : ""}{formatCurrency(Math.abs(tx.amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`${darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"} border rounded-2xl w-full max-w-md shadow-2xl`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Banknote size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className={`font-semibold ${text}`}>Withdraw Funds</h2>
                  <p className="text-xs text-gray-500">Available: {formatCurrency(stats.availableBalance)}</p>
                </div>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className={`p-2 rounded-lg ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                <X size={18} className={muted} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${text}`}>Amount (£) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={stats.availableBalance}
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  placeholder={`Max: ${formatCurrency(stats.availableBalance)}`}
                  required
                  className={inputCls}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${text}`}>Bank Name *</label>
                <input
                  type="text"
                  value={withdrawForm.bankName}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                  placeholder="e.g. Barclays, HSBC, Lloyds"
                  required
                  className={inputCls}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${text}`}>Account Name *</label>
                <input
                  type="text"
                  value={withdrawForm.accountName}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountName: e.target.value })}
                  placeholder="Name on the bank account"
                  required
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${text}`}>Account Number *</label>
                  <input
                    type="text"
                    value={withdrawForm.accountNumber}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                    placeholder="12345678"
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${text}`}>Sort Code</label>
                  <input
                    type="text"
                    value={withdrawForm.sortCode}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, sortCode: e.target.value })}
                    placeholder="00-00-00"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${text}`}>Notes (optional)</label>
                <textarea
                  value={withdrawForm.notes}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, notes: e.target.value })}
                  placeholder="Any additional information..."
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className={`p-3 rounded-lg text-xs ${darkMode ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                ℹ️ Withdrawals are processed within 2–3 business days. You'll be notified once your request is approved.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-xl border font-medium text-sm transition-colors ${
                    darkMode ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || stats.availableBalance <= 0}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Submitting...</> : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VendorLayout>
  );
}
