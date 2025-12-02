"use client";

import { useState, ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAdminTheme } from "./AdminThemeContext";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
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

export default function AdminLayout({
  children,
  title,
  actionButton,
  showSearch = true,
  searchPlaceholder,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { darkMode, pageBg, textPrimary } = useAdminTheme();

  return (
    <div
      className={`h-screen font-sans flex overflow-hidden transition-colors duration-300 ${pageBg} ${textPrimary}`}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <AdminHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          actionButton={actionButton}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
        />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
