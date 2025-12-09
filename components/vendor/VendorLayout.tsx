"use client";

import { useEffect, useState, ReactNode } from "react";
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
  const [providerName, setProviderName] = useState<string | undefined>(
    vendorName
  );
  const [providerType, setProviderType] = useState<string | undefined>(
    vendorType
  );
  const { darkMode } = useVendorTheme();

  // Fetch provider details if not explicitly provided via props
  useEffect(() => {
    if (vendorName && vendorType) return;

    let isMounted = true;

    const loadProvider = async () => {
      try {
        const res = await fetch("/api/vendor/profile");
        if (!res.ok) return;

        const data = await res.json();
        const provider = data?.provider;
        if (!provider) return;

        if (isMounted) {
          setProviderName(vendorName ?? provider.businessName);
          setProviderType(
            vendorType ?? provider.categories?.[0] ?? "Vendor Portal"
          );
        }
      } catch (error) {
        console.error("Failed to load provider details for sidebar:", error);
      }
    };

    loadProvider();

    return () => {
      isMounted = false;
    };
  }, [vendorName, vendorType]);

  const displayVendorName = providerName ?? "EVA Vendor";
  const displayVendorType = providerType ?? "Vendor Portal";

  return (
    <div
      className={`h-screen font-sans flex overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <VendorLayoutSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        vendorName={displayVendorName}
        vendorType={displayVendorType}
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
