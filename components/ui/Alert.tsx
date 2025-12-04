"use client";

import React from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const icons: Record<AlertVariant, React.ReactNode> = {
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
};

const variants: Record<AlertVariant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  error: "bg-red-50 border-red-200 text-red-800",
};

const iconColors: Record<AlertVariant, string> = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
};

export function Alert({
  children,
  variant = "info",
  title,
  dismissible = false,
  onDismiss,
  className = "",
  icon,
}: AlertProps) {
  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border ${variants[variant]} ${className}`}
      role="alert"
    >
      <div className={`shrink-0 ${iconColors[variant]}`}>
        {icon || icons[variant]}
      </div>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Toast notification component
export interface ToastProps {
  message: string;
  variant?: AlertVariant;
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  variant = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${variants[variant]}`}
    >
      <div className={iconColors[variant]}>{icons[variant]}</div>
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto p-1 rounded hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Empty state component
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
    >
      {icon && <div className="mb-4 text-[oklch(0.75_0.01_280)]">{icon}</div>}
      <h3 className="text-lg font-semibold text-[oklch(0.35_0.02_280)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-[oklch(0.55_0.02_280)] max-w-md mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

// Error state component
export interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred. Please try again.",
  retry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
    >
      <div className="mb-4 p-4 bg-red-100 rounded-full">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-[oklch(0.35_0.02_280)] mb-2">
        {title}
      </h3>
      <p className="text-[oklch(0.55_0.02_280)] max-w-md mb-6">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-[oklch(0.65_0.25_15)] text-white rounded-xl hover:bg-[oklch(0.55_0.25_15)] transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
