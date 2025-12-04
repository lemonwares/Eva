"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

export interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  showValue = false,
  className = "",
}: RatingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(value);
        const partial = !filled && i < value;

        return (
          <span key={i} className="relative">
            <Star
              className={`${sizes[size]} ${
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-[oklch(0.85_0.01_280)]"
              }`}
            />
            {partial && (
              <Star
                className={`${sizes[size]} fill-yellow-400 text-yellow-400 absolute inset-0`}
                style={{ clipPath: `inset(0 ${100 - (value % 1) * 100}% 0 0)` }}
              />
            )}
          </span>
        );
      })}
      {showValue && (
        <span
          className={`ml-1.5 font-medium text-[oklch(0.45_0.02_280)] ${textSizes[size]}`}
        >
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function RatingInput({
  value,
  onChange,
  max = 5,
  size = "md",
  disabled = false,
  className = "",
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const displayValue = hoverValue || value;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= displayValue;

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => !disabled && setHoverValue(starValue)}
            onMouseLeave={() => !disabled && setHoverValue(0)}
            className={`transition-transform ${
              disabled ? "cursor-not-allowed opacity-50" : "hover:scale-110"
            }`}
          >
            <Star
              className={`${sizes[size]} transition-colors ${
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-[oklch(0.85_0.01_280)] hover:text-yellow-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

// Review summary component
export interface RatingSummaryProps {
  average: number;
  total: number;
  distribution?: Record<number, number>;
  className?: string;
}

export function RatingSummary({
  average,
  total,
  distribution,
  className = "",
}: RatingSummaryProps) {
  const maxCount = distribution ? Math.max(...Object.values(distribution)) : 0;

  return (
    <div className={`flex flex-col sm:flex-row gap-6 ${className}`}>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold text-[oklch(0.25_0.02_280)]">
          {average.toFixed(1)}
        </span>
        <Rating value={average} size="md" className="mt-2" />
        <span className="text-sm text-[oklch(0.55_0.02_280)] mt-1">
          {total} {total === 1 ? "review" : "reviews"}
        </span>
      </div>

      {distribution && (
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-[oklch(0.55_0.02_280)] w-8">
                  {star} ★
                </span>
                <div className="flex-1 h-2 bg-[oklch(0.92_0.01_280)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-[oklch(0.55_0.02_280)] w-10 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
