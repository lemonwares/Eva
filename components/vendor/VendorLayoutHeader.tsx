"use client";

import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useVendorTheme } from "./VendorThemeContext";

interface VendorLayoutHeaderProps {
  title: string;
  onMenuClick: () => void;
  actionButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  showSearch?: boolean;
}

export default function VendorLayoutHeader({
  title,
  onMenuClick,
  actionButton,
  showSearch = false,
}: VendorLayoutHeaderProps) {
  const { darkMode } = useVendorTheme();

  return (
    <header
      className={`sticky top-0 z-30 border-b px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-300 ${
        darkMode
          ? "bg-[#0f0f0f] border-white/10"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-white/10 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Menu size={24} />
          </button>
          <h1
            className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="hidden sm:block relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent/50 w-48 text-sm transition-colors ${
                  darkMode
                    ? "bg-white/5 text-white border-white/10"
                    : "bg-gray-50 text-gray-900 border-gray-200"
                }`}
              />
            </div>
          )}

          <button
            className={`p-2.5 rounded-lg relative transition-colors ${
              darkMode
                ? "hover:bg-white/10 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          </button>

          {actionButton && (
            <>
              {actionButton.href ? (
                <Link
                  href={actionButton.href}
                  className="hidden sm:inline-flex bg-accent text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors text-sm"
                >
                  {actionButton.label}
                </Link>
              ) : (
                <button
                  onClick={actionButton.onClick}
                  className="hidden sm:inline-flex bg-accent text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors text-sm"
                >
                  {actionButton.label}
                </button>
              )}
            </>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-accent/80 to-pink-500 border-2 border-accent/30" />
        </div>
      </div>
    </header>
  );
}
