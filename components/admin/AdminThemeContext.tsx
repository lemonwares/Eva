"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  // Theme-aware class helpers
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
  divider: string;
  hoverBg: string;
  tableBg: string;
  tableHeaderBg: string;
  tableRowHover: string;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(
  undefined
);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false); // Light mode by default

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const themeClasses: AdminThemeContextType = {
    darkMode,
    toggleDarkMode,
    pageBg: darkMode ? "bg-[#0a0a0a]" : "bg-gray-50",
    cardBg: darkMode ? "bg-[#141414]" : "bg-white",
    cardBorder: darkMode ? "border-white/10" : "border-gray-200",
    cardHoverBorder: darkMode
      ? "hover:border-accent/30"
      : "hover:border-accent/50",
    textPrimary: darkMode ? "text-white" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-400" : "text-gray-600",
    textMuted: darkMode ? "text-gray-500" : "text-gray-500",
    inputBg: darkMode ? "bg-white/5" : "bg-gray-50",
    inputBorder: darkMode ? "border-white/10" : "border-gray-200",
    divider: darkMode ? "divide-white/10" : "divide-gray-200",
    hoverBg: darkMode ? "hover:bg-white/5" : "hover:bg-gray-50",
    tableBg: darkMode ? "bg-[#141414]" : "bg-white",
    tableHeaderBg: darkMode ? "bg-white/5" : "bg-gray-50",
    tableRowHover: darkMode ? "hover:bg-white/5" : "hover:bg-gray-50",
  };

  return (
    <AdminThemeContext.Provider value={themeClasses}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
}
