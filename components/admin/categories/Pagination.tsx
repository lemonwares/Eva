"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const { darkMode, textSecondary, textMuted } = useAdminTheme();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t ${
        darkMode ? "border-white/10" : "border-gray-200"
      }`}
    >
      <p className={`text-sm ${textSecondary}`}>
        Showing{" "}
        <span className="font-medium">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded ${
            darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
          } transition-colors disabled:opacity-50`}
        >
          <ChevronLeft size={18} className={textMuted} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              const distance = Math.abs(page - currentPage);
              return (
                distance === 0 ||
                distance === 1 ||
                page === 1 ||
                page === totalPages
              );
            })
            .map((page, idx, arr) => {
              const prev = arr[idx - 1];
              return (
                <div key={page} className="flex items-center gap-1">
                  {prev && page - prev > 1 && (
                    <span className={`px-2 ${textMuted}`}>...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`min-w-9 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-accent text-white"
                        : darkMode
                        ? `${textSecondary} hover:bg-white/10`
                        : `${textSecondary} hover:bg-gray-100`
                    }`}
                  >
                    {page}
                  </button>
                </div>
              );
            })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded ${
            darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
          } transition-colors disabled:opacity-50`}
        >
          <ChevronRight size={18} className={textMuted} />
        </button>
      </div>
    </div>
  );
}
