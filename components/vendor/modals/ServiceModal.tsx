"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceData) => Promise<void>;
  initialData?: ServiceData;
  darkMode: boolean;
}

export interface ServiceData {
  headline: string;
  longDescription: string;
  minPrice: number | null;
  maxPrice: number | null;
}

export default function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  darkMode,
}: ServiceModalProps) {
  const [formData, setFormData] = useState<ServiceData>(
    initialData || {
      headline: "",
      longDescription: "",
      minPrice: null,
      maxPrice: null,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.headline.trim()) {
      setError("Service name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        headline: "",
        longDescription: "",
        minPrice: null,
        maxPrice: null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(
        initialData || {
          headline: "",
          longDescription: "",
          minPrice: null,
          maxPrice: null,
        }
      );
      setError(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
          >
            <div
              className={`${
                darkMode
                  ? "bg-[#1a1a1a] border-white/10"
                  : "bg-white border-gray-200"
              } rounded-2xl border w-full max-w-md max-h-[90vh] overflow-y-auto`}
            >
              {/* Header */}
              <div
                className={`sticky top-0 flex items-center justify-between p-6 border-b ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <h2
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {initialData ? "Edit Service" : "Add New Service"}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className={`p-1 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-white/10 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) =>
                      setFormData({ ...formData, headline: e.target.value })
                    }
                    placeholder="e.g., Wedding Photography Package"
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      darkMode
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent/30"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/30"
                    } focus:outline-none`}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Description
                  </label>
                  <textarea
                    value={formData.longDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longDescription: e.target.value,
                      })
                    }
                    placeholder="Describe this service in detail..."
                    rows={4}
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      darkMode
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent/30"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/30"
                    } focus:outline-none resize-none`}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Min Price (£)
                    </label>
                    <input
                      type="number"
                      value={formData.minPrice ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minPrice: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      placeholder="0"
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                        darkMode
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent/30"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/30"
                      } focus:outline-none`}
                      disabled={isSubmitting}
                      min="0"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Max Price (£)
                    </label>
                    <input
                      type="number"
                      value={formData.maxPrice ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxPrice: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      placeholder="0"
                      className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                        darkMode
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent/30"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/30"
                      } focus:outline-none`}
                      disabled={isSubmitting}
                      min="0"
                    />
                  </div>
                </div>

                {formData.minPrice !== null && (
                  <div
                    className={`p-3 rounded-lg ${
                      darkMode
                        ? "bg-white/5 border-white/10"
                        : "bg-gray-50 border-gray-200"
                    } border text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Price:{" "}
                    <span className="font-semibold text-accent">
                      {formatCurrency(formData.minPrice)}
                      {formData.maxPrice
                        ? ` - ${formatCurrency(formData.maxPrice)}`
                        : "+"}
                    </span>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {initialData ? "Update Service" : "Add Service"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
