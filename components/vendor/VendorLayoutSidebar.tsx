"use client";

import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Calendar,
  CalendarDays,
  CreditCard,
  BarChart3,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVendorTheme } from "./VendorThemeContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/vendor" },
  { icon: MessageSquare, label: "Inquiries", href: "/vendor/inquiries" },
  { icon: FileText, label: "Quotes", href: "/vendor/quotes" },
  { icon: Calendar, label: "Bookings", href: "/vendor/bookings" },
  { icon: CalendarDays, label: "Calendar", href: "/vendor/calendar" },
  { icon: CreditCard, label: "Payments", href: "/vendor/payments" },
  { icon: BarChart3, label: "Analytics", href: "/vendor/analytics" },
  { icon: User, label: "Profile", href: "/vendor/profile" },
  { icon: Settings, label: "Settings", href: "/vendor/settings" },
];

interface VendorLayoutSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName?: string;
  vendorType?: string;
}

export default function VendorLayoutSidebar({
  isOpen,
  onClose,
  vendorName = "EVA Vendor",
  vendorType = "Vendor Portal",
}: VendorLayoutSidebarProps) {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useVendorTheme();

  const isActive = (href: string) => {
    if (href === "/vendor") {
      return pathname === "/vendor";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen shrink-0 ${
          darkMode ? "bg-[#0f0f0f] border-white/10" : "bg-white border-gray-200"
        } border-r flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & Vendor Info */}
        <div
          className={`p-5 border-b ${
            darkMode ? "border-white/10" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-0 lg:mb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent to-pink-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <p
                  className={`font-bold text-sm ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {vendorName}
                </p>
                <p className="text-gray-500 text-xs">{vendorType}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`lg:hidden p-2 rounded-lg ${
                darkMode
                  ? "hover:bg-white/10 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-accent/15 text-accent"
                      : darkMode
                      ? "text-gray-400 hover:bg-white/5 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div
          className={`p-4 border-t ${
            darkMode ? "border-white/10" : "border-gray-200"
          } space-y-3`}
        >
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-2">
            <div
              className={`flex items-center gap-3 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              <span className="font-medium text-sm">
                {darkMode ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                darkMode ? "bg-accent" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Logout */}
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } hover:bg-red-500/10 hover:text-red-400 transition-colors w-full`}
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
