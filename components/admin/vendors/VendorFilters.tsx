"use client";

import { Search, Filter, ChevronDown, Store } from "lucide-react";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface VendorFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  categories: Category[];
  showStatusDropdown: boolean;
  setShowStatusDropdown: (show: boolean) => void;
  showCategoryDropdown: boolean;
  setShowCategoryDropdown: (show: boolean) => void;
  onFilterChange: () => void;
}

const statusFilters = ["All", "ACTIVE", "PENDING", "SUSPENDED"];

export default function VendorFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  showStatusDropdown,
  setShowStatusDropdown,
  showCategoryDropdown,
  setShowCategoryDropdown,
  onFilterChange,
}: VendorFiltersProps) {
  const {
    darkMode,
    inputBg,
    inputBorder,
    textPrimary,
    textSecondary,
    cardBg,
    cardBorder,
  } = useAdminTheme();

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowCategoryDropdown(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium transition-colors ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Status:</span> {statusFilter}
            <ChevronDown size={16} />
          </button>
          {showStatusDropdown && (
            <div
              className={`absolute top-full left-0 mt-2 w-40 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-20 py-1`}
            >
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                    onFilterChange();
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    statusFilter === status ? "text-accent" : textSecondary
                  } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowStatusDropdown(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm font-medium transition-colors ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <Store size={16} />
            <span className="hidden sm:inline">Category:</span>{" "}
            {categoryFilter === "All"
              ? "All"
              : categoryFilter.substring(0, 10) +
                (categoryFilter.length > 10 ? "..." : "")}
            <ChevronDown size={16} />
          </button>
          {showCategoryDropdown && (
            <div
              className={`absolute top-full right-0 sm:left-0 mt-2 w-48 ${cardBg} border ${cardBorder} rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto`}
            >
              <button
                onClick={() => {
                  setCategoryFilter("All");
                  setShowCategoryDropdown(false);
                  onFilterChange();
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  categoryFilter === "All" ? "text-accent" : textSecondary
                } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setCategoryFilter(category.name);
                    setShowCategoryDropdown(false);
                    onFilterChange();
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    categoryFilter === category.name
                      ? "text-accent"
                      : textSecondary
                  } ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
