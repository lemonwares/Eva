"use client";

import React, { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      label,
      error,
      helperText,
      fullWidth = true,
      showCount = false,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const charCount = typeof value === "string" ? value.length : 0;

    const baseStyles =
      "block w-full rounded-xl border bg-white px-4 py-3 text-[oklch(0.25_0.02_280)] placeholder-[oklch(0.65_0.02_280)] transition-all duration-200 focus:outline-none focus:ring-2 resize-y min-h-[120px]";

    const textareaStyles = error
      ? `${baseStyles} border-red-300 focus:border-red-500 focus:ring-red-200`
      : `${baseStyles} border-[oklch(0.85_0.01_280)] focus:border-[oklch(0.65_0.25_15)] focus:ring-[oklch(0.65_0.25_15/0.2)]`;

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[oklch(0.35_0.02_280)] mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={textareaStyles}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {(error || helperText) && (
            <p
              className={`text-sm ${
                error ? "text-red-600" : "text-[oklch(0.55_0.02_280)]"
              }`}
            >
              {error || helperText}
            </p>
          )}
          {showCount && maxLength && (
            <p
              className={`text-sm ml-auto ${
                charCount >= maxLength
                  ? "text-red-600"
                  : "text-[oklch(0.55_0.02_280)]"
              }`}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
