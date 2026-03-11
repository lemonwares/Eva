"use client";

import { useState, useEffect } from "react";
import { X, Bell, Trash2, Check, CheckCheck } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  darkMode = false,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "50",
        ...(filter === "unread" && { unreadOnly: "true" }),
      });
      
      const res = await fetch(`/api/notifications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-500";
      case "warning": return "text-yellow-500";
      case "error": return "text-red-500";
      default: return "text-blue-500";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[80vh] rounded-xl border shadow-xl ${
        darkMode 
          ? "bg-[#1a1a1a] border-white/10" 
          : "bg-white border-gray-200"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? "border-white/10" : "border-gray-200"
        }`}>
          <div className="flex items-center gap-3">
            <Bell size={24} className={darkMode ? "text-white" : "text-gray-900"} />
            <h2 className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs bg-accent text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-accent text-white"
                    : darkMode
                      ? "text-gray-300 hover:bg-white/5"
                      : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === "unread"
                    ? "bg-accent text-white"
                    : darkMode
                      ? "text-gray-300 hover:bg-white/5"
                      : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Unread
              </button>
            </div>
            
            {/* Mark All Read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-white/10 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
                title="Mark all as read"
              >
                <CheckCheck size={18} />
              </button>
            )}
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? "hover:bg-white/10 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className={`mx-auto mb-4 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {filter === "unread" ? "No unread notifications" : "No notifications"}
              </h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                {filter === "unread" 
                  ? "You're all caught up!" 
                  : "You'll see notifications here when you have them."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-white/10">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                  } ${!notification.isRead ? (darkMode ? "bg-white/5" : "bg-blue-50") : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Read Status Indicator */}
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.isRead ? "bg-transparent" : "bg-accent"
                    }`} />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}>
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <span className={`w-1 h-1 rounded-full ${
                              darkMode ? "bg-gray-600" : "bg-gray-300"
                            }`} />
                            <span className={`text-xs font-medium ${getTypeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className={`p-1.5 rounded transition-colors ${
                                darkMode
                                  ? "hover:bg-white/10 text-gray-400 hover:text-white"
                                  : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                              }`}
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className={`p-1.5 rounded transition-colors ${
                              darkMode
                                ? "hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                                : "hover:bg-red-50 text-gray-500 hover:text-red-600"
                            }`}
                            title="Delete notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}