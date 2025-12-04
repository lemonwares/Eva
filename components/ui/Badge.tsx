"use client";

import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline";
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "full";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  rounded = "full",
  className = "",
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium";

  const variants = {
    default: "bg-[oklch(0.92_0.01_280)] text-[oklch(0.35_0.02_280)]",
    primary: "bg-[oklch(0.92_0.08_15)] text-[oklch(0.45_0.2_15)]",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    outline:
      "bg-transparent border border-[oklch(0.75_0.01_280)] text-[oklch(0.45_0.02_280)]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const roundedStyles = {
    sm: "rounded",
    md: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${roundedStyles[rounded]} ${className}`}
    >
      {children}
    </span>
  );
}

// Status badge with predefined colors
export type StatusType =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "active"
  | "inactive"
  | "approved"
  | "rejected"
  | "draft";

const statusVariants: Record<StatusType, BadgeProps["variant"]> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "danger",
  active: "success",
  inactive: "default",
  approved: "success",
  rejected: "danger",
  draft: "default",
};

export interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as StatusType;
  const variant = statusVariants[normalizedStatus] || "default";

  return (
    <Badge variant={variant} size="sm" className={className}>
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </Badge>
  );
}
