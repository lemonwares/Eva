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
} from "lucide-react";

const transactions = [
  {
    description: "Wedding - Olivia Chen",
    date: "Oct 26, 2024",
    type: "income",
    status: "completed",
    amount: "$4,500.00",
  },
  {
    description: "Platform Fee",
    date: "Oct 26, 2024",
    type: "fee",
    status: "completed",
    amount: "-$225.00",
  },
  {
    description: "Corporate Gala - Benjamin Carter",
    date: "Nov 5, 2024",
    type: "income",
    status: "pending",
    amount: "$3,200.00",
  },
  {
    description: "Withdrawal to Bank ****4521",
    date: "Nov 1, 2024",
    type: "withdrawal",
    status: "completed",
    amount: "-$3,500.00",
  },
  {
    description: "Birthday Party - Sophia Rodriguez",
    date: "Nov 12, 2024",
    type: "income",
    status: "pending",
    amount: "$1,800.00",
  },
];

export default function VendorPaymentsPage() {
  const { darkMode } = useVendorTheme();

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
      actionButton={{ label: "Withdraw Funds", onClick: () => {} }}
    >
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
            $12,450.00
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
            $5,000.00
          </p>
          <p className="text-yellow-400 text-sm flex items-center gap-1 mt-2">
            <Clock size={14} />3 pending transactions
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
            $18,750.00
          </p>
          <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
            <TrendingUp size={14} />
            +15% from last month
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
            $156,320.00
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
          darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`text-gray-500 text-xs uppercase tracking-wider ${
                  darkMode ? "border-white/10" : "border-gray-200"
                } border-b`}
              >
                <th className="text-left px-6 py-4 font-medium">Description</th>
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Type</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-right px-6 py-4 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr
                  key={idx}
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
                      <span
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {tx.description}
                      </span>
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
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        {transactions.map((tx, idx) => (
          <div
            key={idx}
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
                  <p className="text-gray-500 text-xs">{tx.date}</p>
                </div>
              </div>
              <span className={`font-bold ${getTypeStyle(tx.type)}`}>
                {tx.amount}
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
        ))}
      </div>

      {/* Bank Account Section */}
      <div
        className={`mt-6 ${
          darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"
        } rounded-xl border p-5`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } font-semibold mb-1`}
            >
              Connected Bank Account
            </h3>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              Chase Bank •••• 4521
            </p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "border-white/10 text-white hover:bg-white/10"
                : "border-gray-200 text-gray-900 hover:bg-gray-50"
            } transition-colors text-sm`}
          >
            Manage Account
          </button>
        </div>
      </div>
    </VendorLayout>
  );
}
