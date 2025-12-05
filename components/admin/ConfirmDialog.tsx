"use client";

import { useAdminTheme } from "./AdminThemeContext";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false,
}: ConfirmDialogProps) {
  const { darkMode, textSecondary } = useAdminTheme();

  const icons = {
    danger: <XCircle size={48} className="text-red-500" />,
    warning: <AlertTriangle size={48} className="text-amber-500" />,
    info: <Info size={48} className="text-blue-500" />,
    success: <CheckCircle size={48} className="text-green-500" />,
  };

  const buttonColors = {
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-amber-500 hover:bg-amber-600",
    info: "bg-blue-500 hover:bg-blue-600",
    success: "bg-green-500 hover:bg-green-600",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className="flex justify-center mb-4">{icons[type]}</div>
        <p className={`${textSecondary} mb-6`}>{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${buttonColors[type]} disabled:opacity-50`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
