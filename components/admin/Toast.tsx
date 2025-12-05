"use client";

import { useAdminTheme } from "./AdminThemeContext";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  const { darkMode } = useAdminTheme();

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertTriangle size={20} className="text-amber-500" />,
  };

  const bgColors = {
    success: darkMode
      ? "bg-green-500/10 border-green-500/30"
      : "bg-green-50 border-green-200",
    error: darkMode
      ? "bg-red-500/10 border-red-500/30"
      : "bg-red-50 border-red-200",
    info: darkMode
      ? "bg-blue-500/10 border-blue-500/30"
      : "bg-blue-50 border-blue-200",
    warning: darkMode
      ? "bg-amber-500/10 border-amber-500/30"
      : "bg-amber-50 border-amber-200",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right duration-300 ${
        bgColors[type]
      } ${darkMode ? "text-white" : "text-gray-900"}`}
    >
      {icons[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className={`p-1 rounded ${
          darkMode ? "hover:bg-white/10" : "hover:bg-gray-200"
        }`}
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Toast Container for multiple toasts
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
}
