"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "delete" | "remove" | "warning";
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  variant = "delete",
}: ConfirmDeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isLoading, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (
      !isLoading &&
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const iconMap = {
    delete: <Trash2 size={24} className="text-red-600 dark:text-red-400" />,
    remove: <Trash2 size={24} className="text-red-600 dark:text-red-400" />,
    warning: (
      <AlertTriangle size={24} className="text-amber-600 dark:text-amber-400" />
    ),
  };

  const buttonColorMap = {
    delete: "bg-red-600 hover:bg-red-700",
    remove: "bg-red-600 hover:bg-red-700",
    warning: "bg-amber-600 hover:bg-amber-700",
  };

  const iconBgMap = {
    delete: "bg-red-100 dark:bg-red-500/15",
    remove: "bg-red-100 dark:bg-red-500/15",
    warning: "bg-amber-100 dark:bg-amber-500/15",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Icon + Content */}
        <div className="flex flex-col items-center pt-8 pb-2 px-6">
          <div
            className={`w-14 h-14 rounded-full ${iconBgMap[variant]} flex items-center justify-center mb-4`}
          >
            {iconMap[variant]}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl ${buttonColorMap[variant]} text-white transition-colors disabled:opacity-50`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
