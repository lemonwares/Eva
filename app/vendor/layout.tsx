"use client";

import { VendorThemeProvider } from "@/components/vendor/VendorThemeContext";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorThemeProvider>{children}</VendorThemeProvider>;
}
