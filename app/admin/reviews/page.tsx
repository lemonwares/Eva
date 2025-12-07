"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import {
  Search,
  Star,
  CheckCircle,
  XCircle,
  Flag,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Review {
  id: string;
  rating: number;
  content: string;
  isApproved: boolean;
  isFlagged: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  provider: {
    id: string;
    businessName: string;
  };
}

interface StatusCounts {
  approved: number;
  pending: number;
  flagged: number;
}

const tabs = ["Pending", "Approved", "Flagged"];

export default function AdminReviewsPage() {
  const {
    darkMode,
    cardBg,
    cardBorder,
    textPrimary,
    textSecondary,
    textMuted,
    inputBg,
    inputBorder,
  } = useAdminTheme();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [approving, setApproving] = useState(false);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = activeTab.toLowerCase();
      const res = await fetch(`/api/admin/reviews?status=${status}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setStatusCounts(data.statusCounts || null);
        if (data.reviews?.length > 0 && !selectedReview) {
          setSelectedReview(data.reviews[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedReview]);

  useEffect(() => {
    fetchReviews();
  }, [activeTab]); // Only re-fetch when tab changes

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const getAvatarColors = (name: string | null) => {
    const colors = [
      "from-pink-400 to-rose-500",
      "from-blue-400 to-indigo-500",
      "from-green-400 to-emerald-500",
      "from-purple-400 to-violet-500",
      "from-amber-400 to-orange-500",
    ];
    const initials = getInitials(name);
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStatusBadge = (review: Review) => {
    if (review.isFlagged) return { text: "Flagged", color: "bg-red-500" };
    if (review.isApproved) return { text: "Approved", color: "bg-green-500" };
    return { text: "Pending", color: "bg-amber-500" };
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={
              star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-400"
            }
          />
        ))}
      </div>
    );
  };

  // Filter reviews by search query
  const filteredReviews = searchQuery
    ? reviews.filter(
        (r) =>
          r.author.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.author.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.provider.businessName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          r.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reviews;

  return (
    <AdminLayout title="Reviews" showSearch={false}>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
        {/* Left Panel - Reviews List */}
        <div
          className={`w-full lg:w-[400px] shrink-0 ${cardBg} border ${cardBorder} rounded-xl flex flex-col overflow-hidden`}
        >
          <div className="p-4 border-b border-inherit">
            <h2 className={`text-lg font-bold ${textPrimary} mb-4`}>
              Reviews Moderation
              {statusCounts && (
                <span className={`ml-2 text-sm font-normal ${textMuted}`}>
                  ({statusCounts.pending} pending)
                </span>
              )}
            </h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
                size={18}
              />
              <input
                type="text"
                placeholder="Search by user, vendor, or review..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedReview(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-accent text-white"
                      : `${textSecondary} ${
                          darkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                        }`
                  }`}
                >
                  {tab}
                  {statusCounts && (
                    <span className="ml-1 opacity-70">
                      (
                      {tab === "Pending"
                        ? statusCounts.pending
                        : tab === "Approved"
                        ? statusCounts.approved
                        : statusCounts.flagged}
                      )
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className={`text-center py-10 ${textMuted}`}>
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p>No {activeTab.toLowerCase()} reviews</p>
              </div>
            ) : (
              filteredReviews.map((review) => {
                const status = getStatusBadge(review);
                return (
                  <button
                    key={review.id}
                    onClick={() => setSelectedReview(review)}
                    className={`w-full text-left p-4 border-b transition-colors ${
                      selectedReview?.id === review.id
                        ? darkMode
                          ? "bg-accent/10 border-accent/20"
                          : "bg-accent/5 border-accent/20"
                        : darkMode
                        ? "border-white/5 hover:bg-white/5"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-12 h-12 rounded-full bg-linear-to-br ${getAvatarColors(
                          review.author.name
                        )} flex items-center justify-center text-white font-semibold text-sm shrink-0`}
                      >
                        {getInitials(review.author.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`font-medium ${textPrimary}`}>
                              {review.author.name || "Anonymous"}
                            </p>
                            <p className={`text-sm ${textMuted} truncate`}>
                              {truncateText(
                                typeof review.content === "string"
                                  ? review.content
                                  : ""
                              )}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={12}
                                  className={
                                    star <= review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-400"
                                  }
                                />
                              ))}
                              <span className={`text-xs ${textMuted} ml-1`}>
                                for {review.provider.businessName}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`text-xs ${textMuted}`}>
                              {formatDate(review.createdAt)}
                            </p>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium text-white mt-1 ${status.color}`}
                            >
                              {status.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel - Review Detail */}
        {selectedReview ? (
          <div
            className={`flex-1 ${cardBg} border ${cardBorder} rounded-xl flex flex-col overflow-hidden`}
          >
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${textPrimary}`}>
                    {selectedReview.author.name || "Anonymous"}
                  </h3>
                  <p className={textSecondary}>
                    Review for{" "}
                    <span className={`font-medium ${textPrimary}`}>
                      {selectedReview.provider.businessName}
                    </span>
                  </p>
                  <p className={`text-sm ${textMuted}`}>
                    {selectedReview.author.email}
                  </p>
                </div>
                <p className={`text-sm ${textMuted}`}>
                  {formatDate(selectedReview.createdAt)}
                </p>
              </div>

              {/* Rating */}
              <div className="mb-6">{renderStars(selectedReview.rating)}</div>

              {/* Review Content */}
              <p className={`${textSecondary} leading-relaxed mb-8`}>
                {selectedReview.content}
              </p>

              {/* Moderator Notes */}
              <div>
                <label
                  className={`text-sm font-medium ${textPrimary} mb-2 block`}
                >
                  Moderator Notes (Internal)
                </label>
                <textarea
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  placeholder="Add internal notes about this review..."
                  className={`w-full h-32 px-4 py-3 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none`}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`p-4 border-t ${
                darkMode ? "border-white/10" : "border-gray-200"
              } flex gap-3`}
            >
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
                disabled={
                  (selectedReview.isApproved && !selectedReview.isFlagged) ||
                  approving
                }
                onClick={async () => {
                  setApproving(true);
                  try {
                    const res = await fetch(
                      `/api/reviews/${selectedReview.id}/moderate`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          action: "APPROVE",
                          reason: moderatorNotes,
                        }),
                      }
                    );
                    if (res.ok) {
                      setSelectedReview({
                        ...selectedReview,
                        isApproved: true,
                        isFlagged: false,
                      });
                      fetchReviews();
                      setModeratorNotes("");
                    }
                  } catch (err) {
                    console.error("Error approving review:", err);
                  } finally {
                    setApproving(false);
                  }
                }}
              >
                {approving ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Approve
                  </>
                )}
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                  darkMode ? "border-white/10" : "border-gray-200"
                } ${textPrimary} font-semibold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors`}
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `/api/reviews/${selectedReview.id}/moderate`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          action: "reject",
                          notes: moderatorNotes,
                        }),
                      }
                    );
                    if (res.ok) {
                      setSelectedReview(null);
                      fetchReviews();
                      setModeratorNotes("");
                    }
                  } catch (err) {
                    console.error("Error rejecting review:", err);
                  }
                }}
              >
                <XCircle size={18} />
                Reject
              </button>
              <button
                className={`p-3 rounded-lg border ${
                  darkMode ? "border-white/10" : "border-gray-200"
                } ${textMuted} hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-colors`}
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `/api/reviews/${selectedReview.id}/moderate`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          action: "flag",
                          notes: moderatorNotes,
                        }),
                      }
                    );
                    if (res.ok) {
                      setSelectedReview({ ...selectedReview, isFlagged: true });
                      fetchReviews();
                      setModeratorNotes("");
                    }
                  } catch (err) {
                    console.error("Error flagging review:", err);
                  }
                }}
              >
                <Flag size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`flex-1 ${cardBg} border ${cardBorder} rounded-xl flex items-center justify-center`}
          >
            <div className={`text-center ${textMuted}`}>
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a review to view details</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
