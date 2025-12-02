"use client";

import { AdminThemeProvider } from "@/components/admin/AdminThemeContext";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminThemeProvider>{children}</AdminThemeProvider>;
}
