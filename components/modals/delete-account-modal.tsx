"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isDeleting: boolean;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteAccountModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Password verification function
  const verifyPassword = async (password: string) => {
    if (!password.trim()) {
      setIsPasswordValid(false);
      return;
    }

    setIsVerifyingPassword(true);
    try {
      const res = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsPasswordValid(data.isValid);
      } else {
        setIsPasswordValid(false);
      }
    } catch (error) {
      setIsPasswordValid(false);
    } finally {
      setIsVerifyingPassword(false);
    }
  };
  // Debounced password verification
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (deletePassword) {
        verifyPassword(deletePassword);
      } else {
        setIsPasswordValid(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [deletePassword]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (deleteConfirmText === "DELETE" && deletePassword.trim() && isPasswordValid) {
      onConfirm(deletePassword);
    }
  };

  // Check if delete button should be enabled
  const isDeleteReady = deleteConfirmText === "DELETE" && deletePassword.trim() && isPasswordValid && !isVerifyingPassword;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDeleteConfirmText("");
      setDeletePassword("");
      setIsPasswordValid(false);
      setIsVerifyingPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Icon */}
        <div className="flex flex-col items-center pt-8 pb-2 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center mb-4">
            <Trash2 size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg text-gray-900 dark:text-white mb-2">
            Delete Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 items-center leading-relaxed">
            This action is irreversible. All of your data will be permanently removed and cannot be recovered.
          </p>
        </div>
        {/* Form */}
        <div className="px-6 pb-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
              Enter your password
            </label>
            <div className="relative">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your current password"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                  deletePassword && !isVerifyingPassword
                    ? isPasswordValid
                      ? "border-green-500 dark:border-green-400"
                      : "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition-all`}
              />
              {isVerifyingPassword && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {deletePassword && !isVerifyingPassword && (
              <p className={`text-xs mt-2 ${
                isPasswordValid 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-red-600 dark:text-red-400"
              }`}>
                {isPasswordValid ? "Password verified" : "Incorrect password"}
              </p>
            )}
          </div>
          {/* Actions */}
          <motion.div 
            className="flex gap-3 pt-6"
            layout
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.button
              onClick={onClose}
              disabled={isDeleting}
              layout
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDeleteReady ? 'flex-1' : 'w-full'
              }`}
            >
              Cancel
            </motion.button>
            
            <AnimatePresence mode="wait">
              {isDeleteReady && (
                <motion.button
                  initial={{ 
                    opacity: 0, 
                    scale: 0.95,
                    x: 20,
                    flex: 0
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: 0,
                    flex: 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.95,
                    x: 20,
                    flex: 0
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.4 },
                    x: { duration: 0.5 },
                    flex: { duration: 0.5 }
                  }}
                  onClick={handleSubmit}
                  disabled={isDeleting}
                  className="px-4 py-2.5 text-sm font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <AnimatePresence mode="wait">
                    {isDeleting ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </motion.div>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Delete Account
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>,
    document.body
  );
}