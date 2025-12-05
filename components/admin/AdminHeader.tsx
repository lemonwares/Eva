"use client";

import { Menu, Search, Bell, User } from "lucide-react";
import { useAdminTheme } from "./AdminThemeContext";
import Link from "next/link";
import { useState, useEffect } from "react";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
  actionButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
    variant?: "primary" | "secondary";
  };
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export default function AdminHeader({
  title,
  onMenuClick,
  actionButton,
  showSearch = true,
  searchPlaceholder = "Search vendors, users, booking...",
}: AdminHeaderProps) {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textMuted,
    inputBg,
    inputBorder,
  } = useAdminTheme();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/notifications?limit=1");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error("Error fetching notification count:", err);
      }
    };

    fetchUnreadCount();
    // Refresh every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4 border-b ${
        darkMode
          ? "bg-[#0a0a0a]/95 border-white/10"
          : "bg-gray-50/95 border-gray-200"
      } backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Menu & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className={`lg:hidden p-2 rounded-lg ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <Menu size={22} className={textPrimary} />
          </button>
          <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
            {title}
          </h1>
        </div>

        {/* Center: Search (Desktop) */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
                size={18}
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${inputBg} ${inputBorder} ${textPrimary}`}
              />
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Link
            href="/admin/notifications"
            className={`relative p-2.5 rounded-lg ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <Bell
              size={20}
              className={darkMode ? "text-gray-400" : "text-gray-600"}
            />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Profile (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div className="hidden lg:block">
              <p className={`font-medium text-sm ${textPrimary}`}>Admin User</p>
              <p className="text-gray-500 text-xs">Administrator</p>
            </div>
          </div>

          {/* Action Button */}
          {actionButton &&
            (actionButton.href ? (
              <Link
                href={actionButton.href}
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  actionButton.variant === "secondary"
                    ? `${cardBg} ${cardBorder} border ${textPrimary} ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-50"
                      }`
                    : "bg-accent text-white hover:bg-accent/90"
                }`}
              >
                {actionButton.icon}
                {actionButton.label}
              </Link>
            ) : (
              <button
                onClick={actionButton.onClick}
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  actionButton.variant === "secondary"
                    ? `${cardBg} ${cardBorder} border ${textPrimary} ${
                        darkMode ? "hover:bg-white/10" : "hover:bg-gray-50"
                      }`
                    : "bg-accent text-white hover:bg-accent/90"
                }`}
              >
                {actionButton.icon}
                {actionButton.label}
              </button>
            ))}
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
              size={18}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${inputBg} ${inputBorder} ${textPrimary}`}
            />
          </div>
        </div>
      )}
    </header>
  );
}
