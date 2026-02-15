"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Sun, Moon, Search } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import {
  DashboardThemeContext,
  DashboardThemeContextType,
} from "@/components/dashboard/DashboardThemeContext";

export default function DashboardShell({
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
    cardBg: darkMode ? "bg-[#141414]" : "bg-white",
    cardBorder: darkMode ? "border-white/10" : "border-gray-200",
    textPrimary: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
    textMuted: darkMode ? "text-gray-400" : "text-gray-500",
    inputBg: darkMode ? "bg-white/5" : "bg-gray-50",
    inputBorder: darkMode ? "border-white/10" : "border-gray-300",
    pageBg: darkMode ? "bg-[#0a0a0a]" : "bg-[#faf9f7]",
    hoverBg: darkMode ? "hover:bg-white/10" : "hover:bg-gray-100",
    divider: darkMode ? "border-white/10" : "border-gray-200",
  };

  if (status === "loading") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#0a0a0a]" : "bg-[#faf9f7]"
        }`}
      >
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardThemeContext.Provider value={themeClasses}>
      <div
        className={`dashboard-scope min-h-screen ${darkMode ? "bg-[#0a0a0a]" : "bg-[#faf9f7]"}`}
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
                ? "bg-[#141414]/95 border-white/10"
                : "bg-white/95 border-gray-200"
            } backdrop-blur`}
          >
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${
                darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
              }`}
            >
              <Menu className={`w-6 h-6 ${themeClasses.textSecondary}`} />
            </button>

            <div className="flex-1 lg:flex-none" />

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Browse vendors link */}
              <Link
                href="/vendors"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Search className="w-4 h-4" />
                Browse Vendors
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 lg:p-6 pb-20 lg:pb-6">{children}</main>
        </div>

        {/* Mobile bottom navigation */}
        <MobileBottomNav darkMode={darkMode} />
      </div>
    </DashboardThemeContext.Provider>
  );
}
