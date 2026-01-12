"use client";

import { Search } from "lucide-react";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Search categories...",
}: SearchBarProps) {
  const { darkMode, inputBorder, inputBg } = useAdminTheme();

  return (
    <div className="relative flex-1 max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2 border ${inputBorder} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${inputBg}`}
      />
    </div>
  );
}
