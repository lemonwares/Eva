"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import SignOutModal from "@/components/modals/sign-out-modal";
import {
  Home,
  CalendarDays,
  MessageSquare,
  FileText,
  Heart,
  Star,
  Settings,
  X,
  LogOut,
} from "lucide-react";

interface DashboardSidebarProps {
  session: Session;
  darkMode: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  themeClasses: {
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
  { name: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { name: "Reviews", href: "/dashboard/reviews", icon: Star },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar({
  session,
  darkMode,
  sidebarOpen,
  setSidebarOpen,
  themeClasses,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [freshAvatar, setFreshAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setFreshAvatar(data.user?.avatar || null);
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  const userImage = freshAvatar || session.user?.image;

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        darkMode ? "bg-[#0f0f0f] border-white/10" : "bg-white border-gray-200"
      } border-r`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-inherit">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <span className={`font-bold text-lg ${themeClasses.textPrimary}`}>
            EVA
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className={`lg:hidden p-2 rounded-lg ${
            darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
          }`}
        >
          <X className={`w-5 h-5 ${themeClasses.textSecondary}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-accent/15 text-accent font-semibold border-l-3 border-accent"
                  : darkMode
                    ? "text-gray-300 hover:bg-white/10 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          darkMode ? "border-white/10" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-full ${
              darkMode ? "bg-white/10" : "bg-gray-200"
            } flex items-center justify-center`}
          >
            {userImage ? (
              <Image
                src={userImage}
                alt=""
                width={40}
                height={40}
                className="w-full h-full rounded-full object-cover"
                unoptimized
              />
            ) : (
              <span className={`font-medium ${themeClasses.textSecondary}`}>
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium truncate ${themeClasses.textPrimary}`}
            >
              {session.user?.name || "User"}
            </p>
            <p className={`text-xs truncate ${themeClasses.textMuted}`}>
              {session.user?.email}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setIsSignOutModalOpen(true)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full ${
            darkMode ? "text-gray-400" : "text-gray-600"
          } hover:bg-red-500/10 hover:text-red-400 transition-colors`}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => {
          setIsSignOutModalOpen(false);
          signOut({ callbackUrl: "/", redirect: true });
        }}
      />
    </aside>
  );
}
