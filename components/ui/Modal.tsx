"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  className = "",
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`relative w-full mx-4 bg-white rounded-2xl shadow-xl ${sizes[size]} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-[oklch(0.92_0.01_280)]">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-[oklch(0.25_0.02_280)]"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-[oklch(0.55_0.02_280)]">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 -m-2 ml-4 rounded-lg hover:bg-[oklch(0.95_0.01_280)] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-[oklch(0.55_0.02_280)]" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[oklch(0.92_0.01_280)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Confirmation dialog
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-[oklch(0.45_0.02_280)]">{message}</p>
    </Modal>
  );
}

// Alert dialog
export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  variant?: "info" | "success" | "warning" | "error";
}

export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "OK",
  variant = "info",
}: AlertDialogProps) {
  const iconColors = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  const bgColors = {
    info: "bg-blue-100",
    success: "bg-green-100",
    warning: "bg-yellow-100",
    error: "bg-red-100",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      footer={
        <Button onClick={onClose} fullWidth>
          {buttonText}
        </Button>
      }
    >
      <div className="text-center">
        <div
          className={`w-12 h-12 rounded-full ${bgColors[variant]} mx-auto mb-4 flex items-center justify-center`}
        >
          <div className={`w-6 h-6 ${iconColors[variant]}`}>
            {variant === "success" ? "✓" : variant === "error" ? "✕" : "!"}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-[oklch(0.25_0.02_280)] mb-2">
          {title}
        </h3>
        <p className="text-[oklch(0.55_0.02_280)]">{message}</p>
      </div>
    </Modal>
  );
}
