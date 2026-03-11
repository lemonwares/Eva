"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import ImageUpload, { MultiImageUpload } from "@/components/ui/ImageUpload";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceData) => Promise<void>;
  initialData?: ServiceData;
  darkMode: boolean;
  categories?: string[];
}

export interface ServiceData {
  headline: string;
  longDescription: string;
  minPrice: number | null;
  maxPrice: number | null;
  timeEstimate?: string;
  maxGuests?: number | null;
  category?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
  price: number;
}

export default function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  darkMode,
  categories = [],
}: ServiceModalProps) {
  const [formData, setFormData] = useState<ServiceData>(
    initialData || {
      headline: "",
      longDescription: "",
      minPrice: null,
      maxPrice: null,
      timeEstimate: "",
      maxGuests: null,
      category: "",
      coverImageUrl: "",
      galleryUrls: [],
      price: 0,
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
        price: 0,
        coverImageUrl: "",
        galleryUrls: [],
        timeEstimate: "",
        maxGuests: null,
        category: "",
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
          price: 0,
          coverImageUrl: "",
          galleryUrls: [],
          timeEstimate: "",
          maxGuests: null,
          category: "",
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
                className={`sticky top-0 flex items-center justify-between p-6 border-b  ${
                  darkMode
                    ? "border-white/10 bg-black text-white"
                    : "border-gray-200 bg-white text-gray-900"
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
                    Category
                  </label>
                  <select
                    value={formData.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                      darkMode
                        ? "bg-white/5 border-white/10 text-white focus:border-accent focus:ring-1 focus:ring-accent/30"
                        : "bg-white border-gray-300 text-gray-900 focus:border-accent focus:ring-1 focus:ring-accent/30"
                    } focus:outline-none`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a category (optional)</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                  <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Assign this service to a specific category for better organization
                  </p>
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Time Estimate
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={formData.timeEstimate}
                    onChange={(e) =>
                      setFormData({ ...formData, timeEstimate: e.target.value })
                    }
                    placeholder="e.g. 2 hours"
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Maximum Guests
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={formData.maxGuests || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxGuests: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="e.g. 100"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (£)
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    placeholder="e.g. £100"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cover Image
                  </label>
                  <ImageUpload
                    value={formData.coverImageUrl}
                    onChange={(url) =>
                      setFormData({ ...formData, coverImageUrl: url })
                    }
                  />
                </div>

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
