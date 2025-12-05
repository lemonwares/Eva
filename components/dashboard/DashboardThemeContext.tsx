"use client";

import { createContext, useContext } from "react";

export interface DashboardThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
}

export const DashboardThemeContext = createContext<
  DashboardThemeContextType | undefined
>(undefined);

export function useDashboardTheme() {
  const context = useContext(DashboardThemeContext);
  if (!context) {
    throw new Error(
      "useDashboardTheme must be used within DashboardThemeProvider"
    );
  }
  return context;
}
