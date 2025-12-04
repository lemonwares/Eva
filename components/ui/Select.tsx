"use client";

import React, { forwardRef, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      label,
      error,
      helperText,
      options,
      placeholder,
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles =
      "block w-full rounded-xl border bg-white px-4 py-3 text-[oklch(0.25_0.02_280)] transition-all duration-200 focus:outline-none focus:ring-2 appearance-none cursor-pointer";

    const selectStyles = error
      ? `${baseStyles} border-red-300 focus:border-red-500 focus:ring-red-200`
      : `${baseStyles} border-[oklch(0.85_0.01_280)] focus:border-[oklch(0.65_0.25_15)] focus:ring-[oklch(0.65_0.25_15/0.2)]`;

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[oklch(0.35_0.02_280)] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select ref={ref} id={selectId} className={selectStyles} {...props}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[oklch(0.55_0.02_280)]">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        {(error || helperText) && (
          <p
            className={`mt-1.5 text-sm ${
              error ? "text-red-600" : "text-[oklch(0.55_0.02_280)]"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
