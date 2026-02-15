"use client";

import VendorLayout from "@/components/vendor/VendorLayout";
import { useVendorTheme } from "@/components/vendor/VendorThemeContext";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import {
  Star,
  MessageSquare,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  Clock,
  Flag,
  User,
  Mail,
  Image as ImageIcon,
  Loader2,
  X,
  BadgeCheck,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/formatters";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  authorEmail: string;
  authorImage: string | null;
  photos: string[];
  isApproved: boolean;
  isVerifiedBooking: boolean;
  isFlagged: boolean;
  providerReply: string | null;
  providerRepliedAt: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Stats {
  totalReviews: number;
  averageRating: number;
  pendingCount: number;
  approvedCount: number;
  respondedCount: number;
}

export default function VendorReviewsPage() {
  const { darkMode } = useVendorTheme();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  // Reply modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");

  // Photo modal
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sort: sortBy,
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (ratingFilter) {
        params.append("rating", ratingFilter);
      }

      const res = await fetch(`/api/vendor/reviews?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }

      setReviews(data.reviews);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, ratingFilter, sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const openReplyModal = (review: Review) => {
    setSelectedReview(review);
    setReplyContent(review.providerReply || "");
    setReplyError("");
    setReplyModalOpen(true);
  };

  const submitReply = async () => {
    if (!selectedReview || !replyContent.trim()) return;

    try {
      setReplying(true);
      setReplyError("");

      const isUpdate = !!selectedReview.providerReply;
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(`/api/reviews/${selectedReview.id}/respond`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit reply");
      }

      // Update local state
      setReviews((prev) =>
        prev.map((r) =>
          r.id === selectedReview.id
            ? {
                ...r,
                providerReply: replyContent,
                providerRepliedAt: new Date().toISOString(),
              }
            : r,
        ),
      );

      setReplyModalOpen(false);
      setSelectedReview(null);
      setReplyContent("");
    } catch (err: any) {
      setReplyError(err.message);
    } finally {
      setReplying(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : darkMode
                  ? "text-gray-600"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (review: Review) => {
    if (review.isFlagged) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 flex items-center gap-1">
          <Flag className="w-3 h-3" /> Flagged
        </span>
      );
    }
    if (!review.isApproved) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    }
    if (review.providerReply) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Responded
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
        <MessageSquare className="w-3 h-3" /> Awaiting Response
      </span>
    );
  };

  // Theme styles
  const bgPrimary = darkMode ? "bg-[#0a0a0a]" : "bg-gray-50";
  const cardBg = darkMode ? "bg-[#111111]" : "bg-white";
  const cardBorder = darkMode ? "border-white/10" : "border-gray-200";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-600";
  const textMuted = darkMode ? "text-gray-500" : "text-gray-400";
  const inputBg = darkMode ? "bg-[#1a1a1a]" : "bg-white";
  const inputBorder = darkMode ? "border-white/10" : "border-gray-300";

  return (
    <VendorLayout title="Reviews">
      <div className={`min-h-screen ${bgPrimary} p-4 md:p-6`}>
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${textPrimary}`}>Reviews</h1>
          <p className={textSecondary}>
            Manage and respond to customer reviews
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className={textSecondary}>Average Rating</span>
              </div>
              <div className={`text-2xl font-bold ${textPrimary}`}>
                {stats.averageRating.toFixed(1)}
              </div>
            </div>

            <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className={textSecondary}>Total Reviews</span>
              </div>
              <div className={`text-2xl font-bold ${textPrimary}`}>
                {stats.totalReviews}
              </div>
            </div>

            <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className={textSecondary}>Pending</span>
              </div>
              <div className={`text-2xl font-bold ${textPrimary}`}>
                {stats.pendingCount}
              </div>
            </div>

            <div className={`${cardBg} border ${cardBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className={textSecondary}>Responded</span>
              </div>
              <div className={`text-2xl font-bold ${textPrimary}`}>
                {stats.respondedCount}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`${cardBg} border ${cardBorder} rounded-xl p-4 mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label
                className={`block text-sm font-medium ${textSecondary} mb-1`}
              >
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent`}
              >
                <option value="all">All Reviews</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Awaiting Response</option>
                <option value="responded">Responded</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="flex-1">
              <label
                className={`block text-sm font-medium ${textSecondary} mb-1`}
              >
                Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setPage(1);
                }}
                className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent`}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex-1">
              <label
                className={`block text-sm font-medium ${textSecondary} mb-1`}
              >
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating-high">Highest Rating</option>
                <option value="rating-low">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl p-8 text-center`}
          >
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchReviews}
              className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              Try Again
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl p-12 text-center`}
          >
            <MessageSquare className={`w-16 h-16 mx-auto ${textMuted}`} />
            <p className={`mt-4 text-lg font-medium ${textPrimary}`}>
              No reviews found
            </p>
            <p className={`mt-1 ${textMuted}`}>
              {statusFilter !== "all"
                ? "Try adjusting your filters"
                : "You haven't received any reviews yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`${cardBg} border ${cardBorder} rounded-xl overflow-hidden`}
              >
                <div className="p-6">
                  {/* Review Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-full ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        } shrink-0 overflow-hidden flex items-center justify-center`}
                      >
                        {review.authorImage ? (
                          <Image
                            src={review.authorImage}
                            alt=""
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <User className={`w-6 h-6 ${textMuted}`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${textPrimary}`}>
                            {review.authorName}
                          </span>
                          {review.isVerifiedBooking && (
                            <span
                              className="flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full"
                              title="Verified Booking"
                            >
                              <BadgeCheck className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className={`text-sm ${textMuted}`}>
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(review)}
                    </div>
                  </div>

                  {/* Review Content */}
                  {review.title && (
                    <h3 className={`font-semibold mb-2 ${textPrimary}`}>
                      {review.title}
                    </h3>
                  )}
                  <p className={textSecondary}>{review.body}</p>

                  {/* Review Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {review.photos.map((photo, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedPhoto(photo);
                            setPhotoModalOpen(true);
                          }}
                          className="shrink-0"
                        >
                          <Image
                            src={photo}
                            alt={`Review photo ${idx + 1}`}
                            width={80}
                            height={80}
                            className="object-cover rounded-lg hover:opacity-80 transition-opacity"
                            unoptimized
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Provider Reply */}
                  {review.providerReply && (
                    <div
                      className={`mt-4 p-4 rounded-lg ${
                        darkMode ? "bg-[#1a1a1a]" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-accent" />
                        <span className={`font-medium ${textPrimary}`}>
                          Your Response
                        </span>
                        <span className={`text-sm ${textMuted}`}>
                          {review.providerRepliedAt &&
                            formatDate(review.providerRepliedAt)}
                        </span>
                      </div>
                      <p className={textSecondary}>{review.providerReply}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {review.isApproved && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => openReplyModal(review)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          review.providerReply
                            ? `${
                                darkMode ? "bg-gray-800" : "bg-gray-100"
                              } ${textSecondary} hover:${
                                darkMode ? "bg-gray-700" : "bg-gray-200"
                              }`
                            : "bg-accent text-white hover:bg-accent/90"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        {review.providerReply ? "Edit Response" : "Respond"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className={textSecondary}>
              Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className={`p-2 rounded-lg ${cardBg} border ${cardBorder} ${
                  page <= 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-accent/10"
                } ${textPrimary}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className={`p-2 rounded-lg ${cardBg} border ${cardBorder} ${
                  page >= pagination.pages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-accent/10"
                } ${textPrimary}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        <Modal isOpen={replyModalOpen} onClose={() => setReplyModalOpen(false)}>
          <div
            className={`${cardBg} rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${textPrimary}`}>
                {selectedReview?.providerReply
                  ? "Edit Response"
                  : "Respond to Review"}
              </h2>
              <button
                onClick={() => setReplyModalOpen(false)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedReview && (
              <>
                {/* Original Review */}
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    darkMode ? "bg-[#1a1a1a]" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-medium ${textPrimary}`}>
                      {selectedReview.authorName}
                    </span>
                    {renderStars(selectedReview.rating)}
                  </div>
                  {selectedReview.title && (
                    <p className={`font-medium mb-1 ${textPrimary}`}>
                      {selectedReview.title}
                    </p>
                  )}
                  <p className={`text-sm ${textSecondary}`}>
                    {selectedReview.body}
                  </p>
                </div>

                {/* Reply Input */}
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium ${textSecondary} mb-2`}
                  >
                    Your Response
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a professional response to this review..."
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent resize-none`}
                  />
                  <p className={`text-sm ${textMuted} mt-1`}>
                    {replyContent.length}/2000 characters (min 10)
                  </p>
                </div>

                {replyError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {replyError}
                  </div>
                )}

                {/* Tips */}
                <div
                  className={`p-3 rounded-lg mb-4 ${
                    darkMode ? "bg-blue-900/20" : "bg-blue-50"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      darkMode ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    <strong>Tip:</strong> Thank the reviewer, address any
                    concerns professionally, and invite them back for future
                    events.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setReplyModalOpen(false)}
                    className={`flex-1 px-4 py-3 rounded-lg border ${cardBorder} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-800`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReply}
                    disabled={replying || replyContent.length < 10}
                    className={`flex-1 px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {replying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Response
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>

        {/* Photo Modal */}
        <Modal isOpen={photoModalOpen} onClose={() => setPhotoModalOpen(false)}>
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setPhotoModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={selectedPhoto}
              alt="Review photo"
              width={1200}
              height={800}
              className="w-full max-h-[80vh] object-contain rounded-lg"
              unoptimized
            />
          </div>
        </Modal>
      </div>
    </VendorLayout>
  );
}
