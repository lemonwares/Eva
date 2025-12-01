"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface VendorThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  // Theme-aware class helpers
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
}

const VendorThemeContext = createContext<VendorThemeContextType | undefined>(
  undefined
);

export function VendorThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false); // Light mode by default

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const themeClasses: VendorThemeContextType = {
    darkMode,
    toggleDarkMode,
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
  };

  return (
    <VendorThemeContext.Provider value={themeClasses}>
      {children}
    </VendorThemeContext.Provider>
  );
}

export function useVendorTheme() {
  const context = useContext(VendorThemeContext);
  if (!context) {
    throw new Error("useVendorTheme must be used within VendorThemeProvider");
  }
  return context;
}
