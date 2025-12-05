"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { Toast } from "@/components/admin/Toast";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Filter,
  Eye,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Notification {
  id: string;
  type: "EMAIL" | "SMS" | "PUSH";
  recipient: string;
  subject: string | null;
  body: string;
  status: "PENDING" | "SENT" | "FAILED" | "CANCELLED";
  attempts: number;
  maxAttempts: number;
  error: string | null;
  sentAt: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusOptions = ["All", "PENDING", "SENT", "FAILED", "CANCELLED"];
const typeOptions = ["All", "EMAIL", "SMS", "PUSH"];

export default function AdminNotificationsPage() {
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

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "15");

      if (statusFilter !== "All") params.append("status", statusFilter);
      if (typeFilter !== "All") params.append("type", typeFilter);

      const res = await fetch(`/api/notifications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setPagination(data.pagination || null);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, typeFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return {
          bg: "bg-green-500/10",
          text: "text-green-500",
          icon: CheckCircle,
        };
      case "PENDING":
        return { bg: "bg-amber-500/10", text: "text-amber-500", icon: Clock };
      case "FAILED":
        return { bg: "bg-red-500/10", text: "text-red-500", icon: XCircle };
      case "CANCELLED":
        return { bg: "bg-gray-500/10", text: "text-gray-500", icon: XCircle };
      default:
        return { bg: "bg-gray-500/10", text: "text-gray-500", icon: Clock };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMAIL":
        return Mail;
      case "SMS":
        return MessageSquare;
      case "PUSH":
        return Smartphone;
      default:
        return Bell;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout title="Notifications" showSearch={false}>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock size={20} className="text-amber-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {unreadCount}
              </p>
              <p className={`text-sm ${textMuted}`}>Pending</p>
            </div>
          </div>
        </div>
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {notifications.filter((n) => n.status === "SENT").length}
              </p>
              <p className={`text-sm ${textMuted}`}>Sent</p>
            </div>
          </div>
        </div>
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle size={20} className="text-red-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {notifications.filter((n) => n.status === "FAILED").length}
              </p>
              <p className={`text-sm ${textMuted}`}>Failed</p>
            </div>
          </div>
        </div>
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Bell size={20} className="text-blue-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {pagination?.total || 0}
              </p>
              <p className={`text-sm ${textMuted}`}>Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowTypeDropdown(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium`}
          >
            <Filter size={16} />
            Status: {statusFilter}
            <ChevronDown size={16} />
          </button>
          {showStatusDropdown && (
            <div
              className={`absolute top-full left-0 mt-2 w-48 rounded-lg border ${cardBg} ${cardBorder} shadow-lg z-10`}
            >
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm ${
                    statusFilter === status
                      ? "bg-accent text-white"
                      : `${textPrimary} ${
                          darkMode ? "hover:bg-white/10" : "hover:bg-gray-50"
                        }`
                  } first:rounded-t-lg last:rounded-b-lg`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowStatusDropdown(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium`}
          >
            Type: {typeFilter}
            <ChevronDown size={16} />
          </button>
          {showTypeDropdown && (
            <div
              className={`absolute top-full left-0 mt-2 w-40 rounded-lg border ${cardBg} ${cardBorder} shadow-lg z-10`}
            >
              {typeOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setTypeFilter(type);
                    setShowTypeDropdown(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm ${
                    typeFilter === type
                      ? "bg-accent text-white"
                      : `${textPrimary} ${
                          darkMode ? "hover:bg-white/10" : "hover:bg-gray-50"
                        }`
                  } first:rounded-t-lg last:rounded-b-lg`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => fetchNotifications()}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors`}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : notifications.length === 0 ? (
        <div
          className={`${cardBg} border ${cardBorder} rounded-xl p-12 text-center`}
        >
          <Bell className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
            No notifications found
          </h3>
          <p className={textMuted}>
            {statusFilter !== "All" || typeFilter !== "All"
              ? "No notifications match your filter criteria."
              : "No notifications have been sent yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Notifications Table */}
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Type
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Recipient
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Subject
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Status
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Attempts
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Created
                    </th>
                    <th
                      className={`text-left text-xs font-medium uppercase ${textMuted} px-6 py-4`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-white/5" : "divide-gray-100"
                  }`}
                >
                  {notifications.map((notification) => {
                    const TypeIcon = getTypeIcon(notification.type);
                    const statusStyle = getStatusBadge(notification.status);
                    const StatusIcon = statusStyle.icon;
                    return (
                      <tr
                        key={notification.id}
                        className={`${
                          darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <TypeIcon size={16} className="text-accent" />
                            <span className={`text-sm ${textSecondary}`}>
                              {notification.type}
                            </span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${textPrimary}`}>
                          {notification.recipient}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm ${textSecondary} max-w-[200px] truncate`}
                        >
                          {notification.subject || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            <StatusIcon size={12} />
                            {notification.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${textMuted}`}>
                          {notification.attempts}/{notification.maxAttempts}
                        </td>
                        <td className={`px-6 py-4 text-sm ${textMuted}`}>
                          {formatDate(notification.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              setSelectedNotification(notification)
                            }
                            className={`p-2 rounded-lg ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            } transition-colors`}
                          >
                            <Eye size={16} className={textMuted} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <p className={`text-sm ${textMuted}`}>
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronLeft size={18} className={textMuted} />
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded flex items-center justify-center text-sm transition-colors ${
                        currentPage === page
                          ? "bg-accent text-white"
                          : `${textSecondary} ${
                              darkMode
                                ? "hover:bg-white/10"
                                : "hover:bg-gray-100"
                            }`
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(pagination.pages, p + 1))
                    }
                    disabled={currentPage === pagination.pages}
                    className={`p-2 rounded ${
                      darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                    } transition-colors disabled:opacity-50`}
                  >
                    <ChevronRight size={18} className={textMuted} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto`}
          >
            <div
              className={`flex items-center justify-between p-6 border-b ${cardBorder}`}
            >
              <h3 className={`text-lg font-bold ${textPrimary}`}>
                Notification Details
              </h3>
              <button
                onClick={() => setSelectedNotification(null)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
              >
                <X size={20} className={textMuted} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textMuted}`}>Type</p>
                  <p className={`font-medium ${textPrimary}`}>
                    {selectedNotification.type}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      getStatusBadge(selectedNotification.status).bg
                    } ${getStatusBadge(selectedNotification.status).text}`}
                  >
                    {selectedNotification.status}
                  </span>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Recipient</p>
                  <p className={`font-medium ${textPrimary}`}>
                    {selectedNotification.recipient}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Attempts</p>
                  <p className={textSecondary}>
                    {selectedNotification.attempts}/
                    {selectedNotification.maxAttempts}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Created</p>
                  <p className={textSecondary}>
                    {formatDate(selectedNotification.createdAt)}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Sent At</p>
                  <p className={textSecondary}>
                    {selectedNotification.sentAt
                      ? formatDate(selectedNotification.sentAt)
                      : "-"}
                  </p>
                </div>
              </div>

              {selectedNotification.subject && (
                <div>
                  <p className={`text-sm ${textMuted} mb-1`}>Subject</p>
                  <p className={`font-medium ${textPrimary}`}>
                    {selectedNotification.subject}
                  </p>
                </div>
              )}

              <div>
                <p className={`text-sm ${textMuted} mb-1`}>Body</p>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-white/5" : "bg-gray-50"
                  } ${textSecondary} text-sm whitespace-pre-wrap`}
                >
                  {selectedNotification.body}
                </div>
              </div>

              {selectedNotification.error && (
                <div>
                  <p className={`text-sm ${textMuted} mb-1`}>Error</p>
                  <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-sm">
                    {selectedNotification.error}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </AdminLayout>
  );
}
