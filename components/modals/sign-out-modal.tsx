"use client";

import { LogOut, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { signOut } from "next-auth/react";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; // kept for backwards compat but no longer required
}

export default function SignOutModal({
  isOpen,
  onClose,
  onConfirm,
}: SignOutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset loading state when modal closes
  useEffect(() => {
    if (!isOpen) setIsLoading(false);
  }, [isOpen]);

  // Close on Escape key (disabled while signing out)
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

  // Close on backdrop click (disabled while signing out)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (isLoading) return;
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (onConfirm) {
        onConfirm();
      } else {
        await signOut({ callbackUrl: "/", redirect: true });
      }
    } catch {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Icon */}
        <div className="flex flex-col items-center pt-8 pb-2 px-6">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mb-4">
            {isLoading ? (
              <Loader2 size={24} className="text-red-600 dark:text-red-400 animate-spin" />
            ) : (
              <LogOut size={24} className="text-red-600 dark:text-red-400" />
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isLoading ? "Signing out..." : "Sign Out"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            {isLoading
              ? "Please wait while we sign you out."
              : "Are you sure you want to sign out? You'll need to sign in again to access your account."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Signing out...
              </>
            ) : (
              "Sign Out"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
