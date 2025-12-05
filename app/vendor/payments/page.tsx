"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
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
  CreditCard,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  async function fetchPaymentData() {
    setIsLoading(true);
    try {
      // Fetch bookings to calculate payment data
      const res = await fetch("/api/bookings?limit=100");
      if (res.ok) {
        const data = await res.json();
        const bookings = data.bookings || [];

        // Transform bookings into transactions
        const txns: Transaction[] = [];
        let totalEarned = 0;
        let pendingAmount = 0;
        let pendingCount = 0;
        let thisMonthEarned = 0;

        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        bookings.forEach((booking: any) => {
          const amount = booking.totalAmount || booking.quote?.totalPrice || 0;
          const eventDate = new Date(booking.eventDate);
          const isCompleted = booking.status === "COMPLETED";
          const isPending = ["PENDING", "CONFIRMED", "DEPOSIT_PAID"].includes(
            booking.status
          );

          if (amount > 0) {
            txns.push({
              id: booking.id,
              description: booking.eventType || "Booking",
              date: eventDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              type: "income",
              status: isCompleted ? "completed" : "pending",
              amount: amount,
              clientName:
                booking.quote?.inquiry?.fromName || booking.clientName,
            });

            if (isCompleted) {
              totalEarned += amount;

              // Platform fee (5%)
              const fee = amount * 0.05;
              txns.push({
                id: `${booking.id}-fee`,
                description: "Platform Fee",
                date: eventDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                type: "fee",
                status: "completed",
                amount: -fee,
              });
            }

            if (isPending) {
              pendingAmount += amount;
              pendingCount++;
            }

            if (eventDate >= thisMonthStart) {
              thisMonthEarned += amount;
            }
          }
        });

        // Sort by date (most recent first)
        txns.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(txns);
        setStats({
          availableBalance: totalEarned * 0.95, // After platform fees
          pendingAmount,
          thisMonth: thisMonthEarned,
          totalEarned,
          pendingCount,
        });
      }
    } catch (err) {
      console.error("Error fetching payment data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleWithdraw() {
    if (stats.availableBalance <= 0) return;

    setIsWithdrawing(true);
    try {
      // This would integrate with Stripe Connect for payouts
      // For now, show a message
      alert(
        "Stripe Connect payout integration. Available balance: $" +
          formatCurrency(stats.availableBalance)
      );
    } catch (err) {
      console.error("Withdrawal error:", err);
    } finally {
      setIsWithdrawing(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-400";
      case "fee":
        return "text-red-400";
      case "withdrawal":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowDownLeft size={16} className="text-green-400" />;
      case "fee":
      case "withdrawal":
        return <ArrowUpRight size={16} className="text-red-400" />;
      default:
        return <DollarSign size={16} className="text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={14} className="text-green-400" />;
      case "pending":
        return <Clock size={14} className="text-yellow-400" />;
      case "failed":
        return <XCircle size={14} className="text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <VendorLayout
      title="Payments"
      actionButton={{
        label: isWithdrawing ? "Processing..." : "Withdraw Funds",
        onClick: handleWithdraw,
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2
            className={`w-8 h-8 animate-spin ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">Available Balance</span>
                <div className="p-2 rounded-lg bg-green-500/20">
                  <DollarSign size={18} className="text-green-400" />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ${formatCurrency(stats.availableBalance)}
              </p>
              <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
                <TrendingUp size={14} />
                Available for withdrawal
              </p>
            </div>

            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">Pending</span>
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Clock size={18} className="text-yellow-400" />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ${formatCurrency(stats.pendingAmount)}
              </p>
              <p className="text-yellow-400 text-sm flex items-center gap-1 mt-2">
                <Clock size={14} />
                {stats.pendingCount} pending transaction
                {stats.pendingCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">This Month</span>
                <div className="p-2 rounded-lg bg-accent/20">
                  <TrendingUp size={18} className="text-accent" />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ${formatCurrency(stats.thisMonth)}
              </p>
              <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
                <CalendarDays size={14} />
                Current month earnings
              </p>
            </div>

            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">Total Earned</span>
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <DollarSign size={18} className="text-blue-400" />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ${formatCurrency(stats.totalEarned)}
              </p>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm mt-2`}
              >
                Lifetime earnings
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search transactions..."
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
              <button
                className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                  darkMode
                    ? "bg-[#141414] border-white/10 text-white hover:bg-white/10"
                    : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                } border transition-colors text-sm whitespace-nowrap`}
              >
                <CalendarDays size={18} />
                <span>Date Range</span>
                <ChevronDown size={16} />
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                  darkMode
                    ? "bg-[#141414] border-white/10 text-white hover:bg-white/10"
                    : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                } border transition-colors text-sm whitespace-nowrap`}
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Transactions Table - Desktop */}
          <div
            className={`hidden md:block ${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border overflow-hidden`}
          >
            <div
              className={`px-6 py-4 ${
                darkMode ? "border-white/10" : "border-gray-200"
              } border-b`}
            >
              <h3
                className={`${
                  darkMode ? "text-white" : "text-gray-900"
                } font-semibold`}
              >
                Transaction History
              </h3>
            </div>
            {filteredTransactions.length === 0 ? (
              <div
                className={`p-8 text-center ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No transactions found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`text-gray-500 text-xs uppercase tracking-wider ${
                        darkMode ? "border-white/10" : "border-gray-200"
                      } border-b`}
                    >
                      <th className="text-left px-6 py-4 font-medium">
                        Description
                      </th>
                      <th className="text-left px-6 py-4 font-medium">Date</th>
                      <th className="text-left px-6 py-4 font-medium">Type</th>
                      <th className="text-left px-6 py-4 font-medium">
                        Status
                      </th>
                      <th className="text-right px-6 py-4 font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className={`${
                          darkMode
                            ? "border-white/10 hover:bg-white/5"
                            : "border-gray-200 hover:bg-gray-50"
                        } border-b transition-colors`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                darkMode ? "bg-white/5" : "bg-gray-100"
                              }`}
                            >
                              {getTypeIcon(tx.type)}
                            </div>
                            <div>
                              <span
                                className={`font-medium ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {tx.description}
                              </span>
                              {tx.clientName && (
                                <p className="text-gray-500 text-sm">
                                  {tx.clientName}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-5 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {tx.date}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`capitalize font-medium ${getTypeStyle(
                              tx.type
                            )}`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tx.status)}
                            <span
                              className={`capitalize ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-5 text-right font-medium ${getTypeStyle(
                            tx.type
                          )}`}
                        >
                          {tx.amount < 0 ? "-" : ""}${formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Transactions - Mobile */}
          <div className="md:hidden space-y-4">
            <h3
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } font-semibold px-1`}
            >
              Transaction History
            </h3>
            {filteredTransactions.length === 0 ? (
              <div
                className={`p-8 text-center rounded-xl border ${
                  darkMode
                    ? "bg-[#141414] border-white/10 text-gray-400"
                    : "bg-white border-gray-200 text-gray-600"
                }`}
              >
                No transactions found
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`${
                    darkMode
                      ? "bg-[#141414] border-white/10"
                      : "bg-white border-gray-200"
                  } rounded-xl border p-4`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          darkMode ? "bg-white/5" : "bg-gray-100"
                        }`}
                      >
                        {getTypeIcon(tx.type)}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          } text-sm`}
                        >
                          {tx.description}
                        </p>
                        {tx.clientName && (
                          <p className="text-gray-500 text-xs">
                            {tx.clientName}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${getTypeStyle(tx.type)}`}>
                      {tx.amount < 0 ? "-" : ""}${formatCurrency(tx.amount)}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between pt-3 ${
                      darkMode ? "border-white/10" : "border-gray-200"
                    } border-t`}
                  >
                    <span
                      className={`capitalize text-sm font-medium ${getTypeStyle(
                        tx.type
                      )}`}
                    >
                      {tx.type}
                    </span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <span
                        className={`capitalize ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } text-sm`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stripe Connect Section */}
          <div
            className={`mt-6 ${
              darkMode
                ? "bg-[#141414] border-white/10"
                : "bg-white border-gray-200"
            } rounded-xl border p-5`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-[#635BFF]/20">
                  <CreditCard size={24} className="text-[#635BFF]" />
                </div>
                <div>
                  <h3
                    className={`${
                      darkMode ? "text-white" : "text-gray-900"
                    } font-semibold mb-1`}
                  >
                    Stripe Connect
                  </h3>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Secure payments powered by Stripe
                  </p>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg bg-[#635BFF] text-white hover:bg-[#635BFF]/80 transition-colors text-sm flex items-center gap-2`}
              >
                <CreditCard size={16} />
                Connect Stripe Account
              </button>
            </div>
          </div>
        </>
      )}
    </VendorLayout>
  );
}
