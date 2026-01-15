"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

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
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "My Bookings",
    href: "/dashboard/bookings",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    name: "Inquiries",
    href: "/dashboard/inquiries",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
  {
    name: "Quotes",
    href: "/dashboard/quotes",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    name: "Favorites",
    href: "/dashboard/favorites",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    name: "Reviews",
    href: "/dashboard/reviews",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
];

export default function DashboardSidebar({
  session,
  darkMode,
  sidebarOpen,
  setSidebarOpen,
  themeClasses,
}: DashboardSidebarProps) {
  const pathname = usePathname();

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
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-r`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-inherit">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <span className={`font-bold text-lg ${themeClasses.textPrimary}`}>
            EVA
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className={`lg:hidden p-2 rounded-lg ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
        >
          <svg
            className={`w-5 h-5 ${themeClasses.textSecondary}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-rose-500 text-white"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={item.icon}
                />
              </svg>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            } flex items-center justify-center`}
          >
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt=""
                className="w-full h-full rounded-full object-cover"
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
          onClick={() => signOut({ callbackUrl: "/", redirect: true })}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full ${
            darkMode ? "text-gray-400" : "text-gray-600"
          } hover:bg-red-500/10 hover:text-red-400 transition-colors`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
