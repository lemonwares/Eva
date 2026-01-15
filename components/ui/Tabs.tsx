"use client";

import React, { createContext, useContext, useState } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;

  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export function TabsList({
  children,
  className = "",
  variant = "default",
}: TabsListProps) {
  const variants = {
    default: "flex gap-1 p-1 bg-[oklch(0.95_0.01_280)] rounded-xl",
    pills: "flex gap-2",
    underline: "flex gap-6 border-b border-[oklch(0.92_0.01_280)]",
  };

  return (
    <div className={`${variants[variant]} ${className}`} role="tablist">
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className = "",
  variant = "default",
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  const baseStyles =
    "font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: `px-4 py-2 rounded-lg text-sm ${
      isActive
        ? "bg-white text-[oklch(0.25_0.02_280)] shadow-sm"
        : "text-[oklch(0.55_0.02_280)] hover:text-[oklch(0.35_0.02_280)]"
    }`,
    pills: `px-4 py-2 rounded-full text-sm ${
      isActive
        ? "bg-[oklch(0.65_0.25_15)] text-white"
        : "text-[oklch(0.55_0.02_280)] hover:bg-[oklch(0.95_0.01_280)]"
    }`,
    underline: `pb-3 text-sm border-b-2 -mb-px ${
      isActive
        ? "border-[oklch(0.65_0.25_15)] text-[oklch(0.65_0.25_15)]"
        : "border-transparent text-[oklch(0.55_0.02_280)] hover:text-[oklch(0.35_0.02_280)]"
    }`,
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className = "",
}: TabsContentProps) {
  const { activeTab } = useTabs();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div role="tabpanel" className={`mt-4 ${className}`}>
      {children}
    </div>
  );
}
