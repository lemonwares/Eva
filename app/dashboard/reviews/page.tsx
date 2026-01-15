"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDashboardTheme } from "../layout";

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
      console.error("Error fetching reviews:", error);
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
      content: review.content,
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
      console.error("Error saving review:", error);
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
      console.error("Error deleting review:", error);
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
      PENDING: "bg-amber-100 text-amber-700",
      APPROVED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
      FLAGGED: "bg-orange-100 text-orange-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onChange?: (r: number) => void
  ) => {
    return (
      <div className="flex gap-1">
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
            <svg
              className={`w-5 h-5 ${
                star <= rating ? "text-amber-400" : textMuted
              }`}
              fill={star <= rating ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const inputClass = `w-full px-4 py-3 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;

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
          <div className="animate-spin w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full"></div>
          <p className={`mt-4 text-sm ${textMuted}`}>Loading your reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div
          className={`${cardBg} ${cardBorder} border rounded-xl p-12 text-center`}
        >
          <svg
            className={`w-16 h-16 mx-auto ${textMuted}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <p className={`mt-4 text-lg font-medium ${textPrimary}`}>
            No reviews yet
          </p>
          <p className={`mt-1 ${textMuted}`}>
            After your events, share your experience with vendors
          </p>
          <Link
            href="/dashboard/bookings"
            className="inline-block mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            View Bookings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`${cardBg} ${cardBorder} border rounded-xl overflow-hidden`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      } shrink-0 overflow-hidden`}
                    >
                      {review.provider.coverImage ? (
                        <img
                          src={review.provider.coverImage}
                          alt=""
                          className="w-full h-full object-cover"
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
                        className={`font-semibold ${textPrimary} hover:text-rose-500`}
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
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        review.status
                      )}`}
                    >
                      {review.status}
                    </span>
                    <button
                      onClick={() => openEditModal(review)}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                      title="Edit review"
                    >
                      <svg
                        className={`w-4 h-4 ${textMuted}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(review)}
                      className={`p-2 rounded-lg hover:bg-red-50 text-red-500`}
                      title="Delete review"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
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
                  <div className={`mt-4 text-sm ${textMuted}`}>
                    Event date: {formatDate(review.booking.eventDate)}
                  </div>
                )}

                {/* Vendor Response */}
                {review.vendorResponse && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-medium ${textPrimary}`}>
                        Vendor Response
                      </span>
                      {review.vendorResponseDate && (
                        <span className={`text-sm ${textMuted}`}>
                          • {formatDate(review.vendorResponseDate)}
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
          <div className={`${cardBg} rounded-xl w-full max-w-lg`}>
            <div
              className={`p-6 border-b ${cardBorder} flex items-center justify-between`}
            >
              <h2 className={`text-xl font-bold ${textPrimary}`}>
                Edit Review
              </h2>
              <button
                onClick={() => setEditingReview(null)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${textMuted}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Vendor Info */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } overflow-hidden`}
                >
                  {editingReview.provider.coverImage ? (
                    <img
                      src={editingReview.provider.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
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
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= editForm.rating ? "text-amber-400" : textMuted
                        }`}
                        fill={star <= editForm.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
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
                className={`flex-1 py-3 px-4 rounded-lg border ${cardBorder} ${textPrimary} font-medium ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Cancel
              </button>
              <button
                onClick={saveReview}
                disabled={!editForm.content.trim() || saving}
                className="flex-1 py-3 px-4 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-xl w-full max-w-md`}>
            <div className={`p-6 border-b ${cardBorder}`}>
              <h2 className={`text-xl font-bold ${textPrimary}`}>
                Delete Review?
              </h2>
            </div>

            <div className="p-6">
              <p className={textSecondary}>
                Are you sure you want to delete your review for{" "}
                <span className="font-semibold">
                  {reviewToDelete?.provider.businessName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className={`p-6 border-t ${cardBorder} flex gap-3`}>
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setReviewToDelete(null);
                }}
                disabled={deleting}
                className={`flex-1 py-3 px-4 rounded-lg border ${cardBorder} ${textPrimary} font-medium ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Cancel
              </button>
              <button
                onClick={deleteReview}
                disabled={deleting}
                className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </span>
                ) : (
                  "Delete Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <p className="font-medium">{toast.message}</p>
            <button
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
              className="ml-4 hover:bg-white/20 rounded p-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
