"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}: PaginationProps) {
  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  const generatePagination = () => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 3 + siblingCount * 2);
      return [...leftRange, "...", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - 2 - siblingCount * 2, totalPages);
      return [1, "...", ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, "...", ...middleRange, "...", totalPages];
  };

  const pages = generatePagination();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-[oklch(0.95_0.01_280)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5 text-[oklch(0.45_0.02_280)]" />
      </button>

      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="px-3 py-2 text-[oklch(0.55_0.02_280)]"
            >
              <MoreHorizontal className="w-5 h-5" />
            </span>
          );
        }

        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`min-w-10 h-10 px-3 rounded-lg font-medium transition-colors ${
              isActive
                ? "bg-[oklch(0.65_0.25_15)] text-white"
                : "hover:bg-[oklch(0.95_0.01_280)] text-[oklch(0.45_0.02_280)]"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-[oklch(0.95_0.01_280)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5 text-[oklch(0.45_0.02_280)]" />
      </button>
    </nav>
  );
}

// Simple pagination with info text
export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  className = "",
}: SimplePaginationProps) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      <p className="text-sm text-[oklch(0.55_0.02_280)]">
        Showing{" "}
        <span className="font-medium text-[oklch(0.35_0.02_280)]">{start}</span>{" "}
        to{" "}
        <span className="font-medium text-[oklch(0.35_0.02_280)]">{end}</span>{" "}
        of{" "}
        <span className="font-medium text-[oklch(0.35_0.02_280)]">{total}</span>{" "}
        results
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-[oklch(0.85_0.01_280)] hover:bg-[oklch(0.95_0.01_280)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-[oklch(0.85_0.01_280)] hover:bg-[oklch(0.95_0.01_280)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
