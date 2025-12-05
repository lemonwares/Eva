"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import {
  DashboardThemeContext,
  DashboardThemeContextType,
} from "@/components/dashboard/DashboardThemeContext";

// Re-export the hook for convenience
export { useDashboardTheme } from "@/components/dashboard/DashboardThemeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("dashboard-theme", !darkMode ? "dark" : "light");
  };

  const themeClasses: DashboardThemeContextType = {
    darkMode,
    toggleDarkMode,
    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    cardBorder: darkMode ? "border-gray-700" : "border-gray-200",
    textPrimary: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
    textMuted: darkMode ? "text-gray-400" : "text-gray-500",
    inputBg: darkMode ? "bg-gray-700" : "bg-gray-50",
    inputBorder: darkMode ? "border-gray-600" : "border-gray-300",
  };

  if (status === "loading") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardThemeContext.Provider value={themeClasses}>
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <DashboardSidebar
          session={session}
          darkMode={darkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          themeClasses={{
            textPrimary: themeClasses.textPrimary,
            textSecondary: themeClasses.textSecondary,
            textMuted: themeClasses.textMuted,
          }}
        />

        {/* Main content */}
        <div className="lg:ml-64">
          {/* Top header */}
          <header
            className={`sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b ${
              darkMode
                ? "bg-gray-800/95 border-gray-700"
                : "bg-white/95 border-gray-200"
            } backdrop-blur`}
          >
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <svg
                className={`w-6 h-6 ${themeClasses.textSecondary}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex-1 lg:flex-none" />

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Browse vendors link */}
              <Link
                href="/vendors"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Browse Vendors
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </DashboardThemeContext.Provider>
  );
}
