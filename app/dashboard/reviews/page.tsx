"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDashboardTheme } from "../layout";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import {
  Star,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  CalendarDays,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { logger } from "@/lib/logger";

interface Review {
  id: string;
  rating: number;
  title?: string;
  content: string;
  status: string;
  vendorResponse?: string;
  vendorResponseDate?: string;
  createdAt: string;
  updatedAt: string;
  provider: {
    id: string;
    businessName: string;
    coverImage?: string;
  };
  booking?: {
    id: string;
    eventDate: string;
  };
}

export default function ReviewsPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useDashboardTheme();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    title: "",
    content: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reviews?mine=true");
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      logger.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      title: review.title || "",
      content: review.content || "",
    });
  };

  const saveReview = async () => {
    if (!editingReview) return;
    if (!editForm.content.trim()) {
      setToast({
        show: true,
        message: "Please write a review before saving.",
        type: "error",
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/reviews/${editingReview.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        fetchReviews();
        setEditingReview(null);
        setToast({
          show: true,
          message: "Review updated successfully!",
          type: "success",
        });
      } else {
        const data = await response.json().catch(() => ({}));
        setToast({
          show: true,
          message: data.message || "Failed to save review. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      logger.error("Error saving review:", error);
      setToast({
        show: true,
        message: "An error occurred while saving the review.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (review: Review) => {
    setReviewToDelete(review);
    setDeleteConfirmOpen(true);
  };

  const deleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/reviews/${reviewToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
        setToast({
          show: true,
          message: "Review deleted successfully!",
          type: "success",
        });
        setDeleteConfirmOpen(false);
        setReviewToDelete(null);
      } else {
        setToast({
          show: true,
          message: "Failed to delete review. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      logger.error("Error deleting review:", error);
      setToast({
        show: true,
        message: "An error occurred while deleting the review.",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
      APPROVED:
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      FLAGGED:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onChange?: (r: number) => void,
    size: "sm" | "lg" = "sm",
  ) => {
    const sizeClass = size === "lg" ? "w-8 h-8" : "w-5 h-5";
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            className={`${
              interactive ? "cursor-pointer hover:scale-110" : ""
            } transition-transform`}
          >
            <Star
              className={`${sizeClass} ${
                star <= rating ? "text-amber-400 fill-amber-400" : textMuted
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const inputClass = `w-full px-4 py-3 rounded-xl ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent/50`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${textPrimary}`}>My Reviews</h1>
        <p className={textSecondary}>Reviews you&apos;ve written for vendors</p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className={`mt-4 text-sm ${textMuted}`}>Loading your reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div
          className={`${cardBg} ${cardBorder} border rounded-2xl p-12 text-center`}
        >
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              darkMode ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            <Star className={`h-8 w-8 ${textMuted}`} />
          </div>
          <p className={`text-lg font-medium ${textPrimary}`}>No reviews yet</p>
          <p className={`mt-1 ${textMuted}`}>
            After your events, share your experience with vendors
          </p>
          <Link
            href="/dashboard/bookings"
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-medium"
          >
            View Bookings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`${cardBg} ${cardBorder} border rounded-2xl overflow-hidden`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${
                        darkMode ? "bg-white/5" : "bg-gray-100"
                      } shrink-0 overflow-hidden`}
                    >
                      {review.provider.coverImage ? (
                        <Image
                          src={review.provider.coverImage}
                          alt=""
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={`font-medium ${textMuted}`}>
                            {review.provider.businessName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/vendors/${review.provider.id}`}
                        className={`font-semibold ${textPrimary} hover:text-accent transition-colors`}
                      >
                        {review.provider.businessName}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className={`text-sm ${textMuted}`}>
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        review.status,
                      )}`}
                    >
                      {review.status}
                    </span>
                    <button
                      onClick={() => openEditModal(review)}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                      } transition-colors`}
                      title="Edit review"
                    >
                      <Pencil className={`w-4 h-4 ${textMuted}`} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(review)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mt-4">
                  {review.title && (
                    <h3 className={`font-medium ${textPrimary} mb-2`}>
                      {review.title}
                    </h3>
                  )}
                  <p className={textSecondary}>{review.content}</p>
                </div>

                {/* Event Info */}
                {review.booking?.eventDate && (
                  <div
                    className={`mt-4 flex items-center gap-1.5 text-sm ${textMuted}`}
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    Event date: {formatDate(review.booking.eventDate)}
                  </div>
                )}

                {/* Vendor Response */}
                {review.vendorResponse && (
                  <div
                    className={`mt-4 p-4 rounded-xl ${
                      darkMode ? "bg-white/3" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-accent" />
                      <span className={`font-medium ${textPrimary}`}>
                        Vendor Response
                      </span>
                      {review.vendorResponseDate && (
                        <span className={`text-sm ${textMuted}`}>
                          &middot; {formatDate(review.vendorResponseDate)}
                        </span>
                      )}
                    </div>
                    <p className={textSecondary}>{review.vendorResponse}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-2xl w-full max-w-lg shadow-2xl`}>
            <div
              className={`p-6 border-b ${cardBorder} flex items-center justify-between`}
            >
              <h2 className={`text-xl font-bold ${textPrimary}`}>
                Edit Review
              </h2>
              <button
                onClick={() => setEditingReview(null)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <X className={`w-5 h-5 ${textMuted}`} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Vendor Info */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${
                    darkMode ? "bg-white/5" : "bg-gray-100"
                  } overflow-hidden`}
                >
                  {editingReview.provider.coverImage ? (
                    <Image
                      src={editingReview.provider.coverImage}
                      alt=""
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className={`font-medium ${textMuted}`}>
                        {editingReview.provider.businessName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <span className={`font-medium ${textPrimary}`}>
                  {editingReview.provider.businessName}
                </span>
              </div>

              {/* Rating */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Rating
                </label>
                {renderStars(
                  editForm.rating,
                  true,
                  (r) => setEditForm({ ...editForm, rating: r }),
                  "lg",
                )}
              </div>

              {/* Title */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="Summarize your experience"
                  className={inputClass}
                />
              </div>

              {/* Content */}
              <div>
                <label
                  className={`block text-sm font-medium ${textSecondary} mb-2`}
                >
                  Your Review
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm({ ...editForm, content: e.target.value })
                  }
                  placeholder="Share your experience with this vendor..."
                  rows={5}
                  className={inputClass}
                />
              </div>
            </div>

            <div className={`p-6 border-t ${cardBorder} flex gap-3`}>
              <button
                onClick={() => setEditingReview(null)}
                disabled={saving}
                className={`flex-1 py-3 px-4 rounded-xl border ${cardBorder} ${textPrimary} font-medium ${
                  darkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={saveReview}
                disabled={!editForm.content?.trim() || saving}
                className="flex-1 py-3 px-4 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setReviewToDelete(null);
        }}
        onConfirm={deleteReview}
        title="Delete Review"
        message={`Are you sure you want to delete your review for ${reviewToDelete?.provider.businessName || "this vendor"}? This action cannot be undone.`}
        confirmText="Delete Review"
        isLoading={deleting}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <p className="font-medium">{toast.message}</p>
            <button
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
              className="ml-4 hover:bg-white/20 rounded p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
