"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  description?: string;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "left",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 min-w-[200px] py-2 bg-white rounded-xl shadow-lg border border-[oklch(0.92_0.01_280)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement<{ onClick?: (e: React.MouseEvent) => void }>(
                child
              )
            ) {
              return React.cloneElement(child, {
                onClick: (e: React.MouseEvent) => {
                  child.props.onClick?.(e);
                  setIsOpen(false);
                },
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}

export interface DropdownItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
}

export function DropdownItem({
  children,
  icon,
  onClick,
  disabled = false,
  destructive = false,
  className = "",
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "text-[oklch(0.35_0.02_280)] hover:bg-[oklch(0.95_0.01_280)]"
      } ${className}`}
    >
      {icon && <span className="w-4 h-4 shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 border-t border-[oklch(0.92_0.01_280)]" />;
}

export interface DropdownLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownLabel({
  children,
  className = "",
}: DropdownLabelProps) {
  return (
    <div
      className={`px-4 py-1.5 text-xs font-semibold text-[oklch(0.55_0.02_280)] uppercase tracking-wider ${className}`}
    >
      {children}
    </div>
  );
}

// Select dropdown with search
export interface SearchSelectProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  disabled = false,
  className = "",
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[oklch(0.85_0.01_280)] rounded-xl text-left transition-colors hover:border-[oklch(0.65_0.25_15)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.65_0.25_15/0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span
          className={
            selectedOption
              ? "text-[oklch(0.25_0.02_280)]"
              : "text-[oklch(0.65_0.02_280)]"
          }
        >
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[oklch(0.55_0.02_280)] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-[oklch(0.92_0.01_280)] overflow-hidden">
          <div className="p-2">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[oklch(0.97_0.01_280)] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[oklch(0.65_0.25_15/0.2)]"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[oklch(0.55_0.02_280)] text-center">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  disabled={option.disabled}
                  className="w-full flex items-center justify-between px-4 py-2 text-left text-sm hover:bg-[oklch(0.95_0.01_280)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    {option.icon && <span>{option.icon}</span>}
                    <div>
                      <div className="text-[oklch(0.25_0.02_280)]">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-xs text-[oklch(0.55_0.02_280)]">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-[oklch(0.65_0.25_15)]" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
