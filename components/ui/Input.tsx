"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseInputStyles =
      "block w-full rounded-xl border bg-white px-4 py-3 text-[oklch(0.25_0.02_280)] placeholder-[oklch(0.65_0.02_280)] transition-all duration-200 focus:outline-none focus:ring-2";

    const inputStyles = error
      ? `${baseInputStyles} border-red-300 focus:border-red-500 focus:ring-red-200`
      : `${baseInputStyles} border-[oklch(0.85_0.01_280)] focus:border-[oklch(0.65_0.25_15)] focus:ring-[oklch(0.65_0.25_15/0.2)]`;

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[oklch(0.35_0.02_280)] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[oklch(0.55_0.02_280)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`${inputStyles} ${leftIcon ? "pl-11" : ""} ${
              rightIcon ? "pr-11" : ""
            }`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-[oklch(0.55_0.02_280)]">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

export { Input };
