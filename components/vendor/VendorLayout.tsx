"use client";

import { useState, ReactNode } from "react";
import VendorLayoutSidebar from "./VendorLayoutSidebar";
import VendorLayoutHeader from "./VendorLayoutHeader";
import { useVendorTheme } from "./VendorThemeContext";

interface VendorLayoutProps {
  children: ReactNode;
  title: string;
  actionButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  showSearch?: boolean;
  vendorName?: string;
  vendorType?: string;
}

export default function VendorLayout({
  children,
  title,
  actionButton,
  showSearch = false,
  vendorName,
  vendorType,
}: VendorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useVendorTheme();

  return (
    <div
      className={`h-screen font-sans flex overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <VendorLayoutSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        vendorName={vendorName}
        vendorType={vendorType}
      />

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <VendorLayoutHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          actionButton={actionButton}
          showSearch={showSearch}
        />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
