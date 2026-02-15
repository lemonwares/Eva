"use client";

import {
  LayoutDashboard,
  Store,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  X,
  ChevronLeft,
  Tag,
  MapPin,
  Database,
  MessageSquare,
  FileText,
  Bell,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAdminTheme } from "./AdminThemeContext";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import SignOutModal from "@/components/modals/sign-out-modal";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Store, label: "Vendors", href: "/admin/vendors" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Calendar, label: "Bookings", href: "/admin/bookings" },
  { icon: FileText, label: "Quotes", href: "/admin/quotes" },
  { icon: MessageSquare, label: "Reviews", href: "/admin/reviews" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

const contentNavItems = [
  { icon: Tag, label: "Categories", href: "/admin/categories" },
  { icon: MapPin, label: "Cities", href: "/admin/cities" },
  { icon: Tag, label: "Tags", href: "/admin/tags" },
];

const systemNavItems = [
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: ClipboardList, label: "Audit Logs", href: "/admin/audit-logs" },
  { icon: Database, label: "Data Management", href: "/admin/data" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useAdminTheme();
  const { data: session } = useSession();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const adminName = session?.user?.name || "Admin User";
  const adminEmail = session?.user?.email || "admin@evalocal.com";
  const adminInitial = adminName?.charAt(0).toUpperCase() || "A";

  const [adminImage, setAdminImage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch fresh avatar from database (session JWT may be stale)
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setAdminImage(data.user?.avatar || null);
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  const NavItem = ({ item }: { item: (typeof mainNavItems)[0] }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          active
            ? "bg-accent/15 text-accent font-semibold"
            : darkMode
              ? "text-gray-400 hover:bg-white/5 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        } ${isCollapsed ? "justify-center" : ""}`}
        title={isCollapsed ? item.label : undefined}
      >
        <item.icon size={20} />
        {!isCollapsed && (
          <span className="font-medium text-sm">{item.label}</span>
        )}
      </Link>
    );
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
        className={`fixed lg:static inset-y-0 left-0 z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } h-screen shrink-0 ${
          darkMode ? "bg-[#0f0f0f] border-white/10" : "bg-white border-gray-200"
        } border-r flex flex-col transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & Admin Info */}
        <div
          className={`p-4 border-b ${
            darkMode ? "border-white/10" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 ${
                isCollapsed ? "justify-center w-full" : ""
              }`}
            >
              <div className="shrink-0">
                <Image
                  src={
                    darkMode
                      ? "/images/brand/eva-logo-dark.png"
                      : "/images/brand/eva-logo-light.png"
                  }
                  alt="EVA Local"
                  width={isCollapsed ? 36 : 120}
                  height={isCollapsed ? 36 : 36}
                  className="object-contain"
                  priority
                />
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

        {/* Collapse Toggle - Desktop Only */}
        <button
          onClick={onToggleCollapse}
          className={`hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full items-center justify-center ${
            darkMode
              ? "bg-[#1a1a1a] border-white/10"
              : "bg-white border-gray-200"
          } border shadow-sm z-10`}
        >
          <ChevronLeft
            size={14}
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p
                className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Main
              </p>
            )}
            {mainNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          {/* Content Management */}
          <div className="mt-6 space-y-1">
            {!isCollapsed && (
              <p
                className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Content
              </p>
            )}
            {contentNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          {/* System */}
          <div className="mt-6 space-y-1">
            {!isCollapsed && (
              <p
                className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                System
              </p>
            )}
            {systemNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div
          className={`p-4 border-t ${
            darkMode ? "border-white/10" : "border-gray-200"
          } space-y-3`}
        >
          {/* Admin Profile */}
          {!isCollapsed && (
            <div
              className={`flex items-center gap-3 p-2 rounded-lg ${
                darkMode ? "bg-white/5" : "bg-gray-50"
              }`}
            >
              {adminImage ? (
                <Image
                  src={adminImage}
                  alt={adminName}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {adminInitial}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-sm truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                  title={adminName}
                >
                  {adminName}
                </p>
                <p
                  className="text-gray-500 text-xs truncate"
                  title={adminEmail}
                >
                  {adminEmail}
                </p>
              </div>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            } px-2`}
          >
            {!isCollapsed && (
              <div
                className={`flex items-center gap-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                <span className="font-medium text-xs">
                  {darkMode ? "Dark" : "Light"}
                </span>
              </div>
            )}
            <button
              onClick={toggleDarkMode}
              className={`${
                isCollapsed ? "" : ""
              } w-10 h-5 rounded-full transition-colors relative ${
                darkMode ? "bg-accent" : "bg-gray-300"
              }`}
              title={
                isCollapsed
                  ? darkMode
                    ? "Dark Mode"
                    : "Light Mode"
                  : undefined
              }
            >
              <div
                className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform shadow-sm ${
                  darkMode ? "translate-x-[22px]" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => setShowSignOutModal(true)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } hover:bg-red-500/10 hover:text-red-400 transition-colors w-full ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut size={18} />
            {!isCollapsed && (
              <span className="font-medium text-sm">Log Out</span>
            )}
          </button>
        </div>

        <SignOutModal
          isOpen={showSignOutModal}
          onClose={() => setShowSignOutModal(false)}
          onConfirm={() => {
            setShowSignOutModal(false);
            signOut({ callbackUrl: "/", redirect: true });
          }}
        />
      </aside>
    </>
  );
}
