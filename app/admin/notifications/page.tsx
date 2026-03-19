"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { logger } from "@/lib/logger";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  RefreshCw,
  Eye,
  X,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string; // info | success | warning | error
  isRead: boolean;
  metadata: any;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

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
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "20");
      if (filter === "unread") params.append("unreadOnly", "true");

      const res = await fetch(`/api/notifications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setPagination(data.pagination || null);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      logger.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      logger.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      logger.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (selectedNotification?.id === id) setSelectedNotification(null);
    } catch (err) {
      logger.error("Failed to delete notification:", err);
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "success": return { bg: "bg-green-500/10", text: "text-green-500", icon: CheckCircle };
      case "warning": return { bg: "bg-amber-500/10", text: "text-amber-500", icon: AlertTriangle };
      case "error": return { bg: "bg-red-500/10", text: "text-red-500", icon: XCircle };
      default: return { bg: "bg-blue-500/10", text: "text-blue-500", icon: Info };
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const formatTimeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <AdminLayout title="Notifications" showSearch={false}>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Unread", count: unreadCount, color: "amber", Icon: Bell },
          { label: "Total", count: pagination?.total || 0, color: "blue", Icon: Bell },
        ].map(({ label, count, color, Icon }) => (
          <div key={label} className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 flex items-center justify-center`}>
                <Icon size={20} className={`text-${color}-500`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${textPrimary}`}>{count}</p>
                <p className={`text-sm ${textMuted}`}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex rounded-lg border ${inputBorder} overflow-hidden`}>
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-accent text-white" : `${textSecondary} ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm font-medium transition-colors`}
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
        <button
          onClick={fetchNotifications}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${inputBg} ${inputBorder} ${textSecondary} text-sm font-medium transition-colors`}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-12 text-center`}>
          <Bell className={`w-12 h-12 mx-auto mb-4 ${textMuted}`} />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No notifications</h3>
          <p className={textMuted}>{filter === "unread" ? "You're all caught up!" : "Nothing here yet."}</p>
        </div>
      ) : (
        <>
          <div className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}>
            <div className={`divide-y ${darkMode ? "divide-white/5" : "divide-gray-100"}`}>
              {notifications.map((n) => {
                const style = getTypeStyle(n.type);
                const TypeIcon = style.icon;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 p-4 transition-colors ${
                      !n.isRead ? (darkMode ? "bg-white/5" : "bg-blue-50/50") : ""
                    } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                  >
                    {/* Unread dot */}
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? "bg-transparent" : "bg-accent"}`} />

                    {/* Type icon */}
                    <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center ${style.bg}`}>
                      <TypeIcon size={16} className={style.text} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${textPrimary}`}>{n.title}</p>
                      <p className={`text-sm mt-0.5 line-clamp-2 ${textSecondary}`}>{n.message}</p>
                      <p className={`text-xs mt-1 ${textMuted}`}>{formatTimeAgo(n.createdAt)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setSelectedNotification(n)}
                        className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
                        title="View"
                      >
                        <Eye size={15} className={textMuted} />
                      </button>
                      {!n.isRead && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
                          title="Mark as read"
                        >
                          <CheckCircle size={15} className="text-green-500" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 size={15} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className={`flex items-center justify-between px-6 py-4 border-t ${darkMode ? "border-white/10" : "border-gray-200"}`}>
                <p className={`text-sm ${textMuted}`}>
                  {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className={`p-2 rounded transition-colors disabled:opacity-50 ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                    <ChevronLeft size={18} className={textMuted} />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 rounded text-sm transition-colors ${currentPage === p ? "bg-accent text-white" : `${textSecondary} ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))} disabled={currentPage === pagination.pages}
                    className={`p-2 rounded transition-colors disabled:opacity-50 ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                    <ChevronRight size={18} className={textMuted} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`${cardBg} border ${cardBorder} rounded-xl w-full max-w-lg shadow-2xl`}>
            <div className={`flex items-center justify-between p-5 border-b ${cardBorder}`}>
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Notification Details</h3>
              <button onClick={() => setSelectedNotification(null)} className={`p-2 rounded-lg ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                <X size={18} className={textMuted} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const style = getTypeStyle(selectedNotification.type);
                  const Icon = style.icon;
                  return (
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.bg}`}>
                      <Icon size={20} className={style.text} />
                    </div>
                  );
                })()}
                <div>
                  <p className={`font-semibold ${textPrimary}`}>{selectedNotification.title}</p>
                  <p className={`text-xs ${textMuted}`}>{formatDate(selectedNotification.createdAt)}</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                <p className={`text-sm whitespace-pre-wrap ${textSecondary}`}>{selectedNotification.message}</p>
              </div>
              {selectedNotification.metadata && (
                <div>
                  <p className={`text-xs font-medium ${textMuted} mb-1`}>Metadata</p>
                  <pre className={`text-xs p-3 rounded-lg ${darkMode ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-600"} overflow-auto`}>
                    {JSON.stringify(selectedNotification.metadata, null, 2)}
                  </pre>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                {!selectedNotification.isRead && (
                  <button onClick={() => { markAsRead(selectedNotification.id); setSelectedNotification({ ...selectedNotification, isRead: true }); }}
                    className="flex-1 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={15} /> Mark as Read
                  </button>
                )}
                <button onClick={() => deleteNotification(selectedNotification.id)}
                  className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
