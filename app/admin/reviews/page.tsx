"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminTheme } from "@/components/admin/AdminThemeContext";
import { Search, Star, CheckCircle, XCircle, Flag } from "lucide-react";
import { useState } from "react";

const reviews = [
  {
    id: "1",
    author: "Evelyn Reed",
    avatar: "ER",
    avatarBg: "from-pink-400 to-rose-500",
    vendorName: "The Grand Ballroom",
    rating: 5,
    excerpt: "This was the most magical place for our w...",
    fullReview:
      "This was the most magical place for our wedding. The staff at The Grand Ballroom were incredibly attentive, the food was exquisite, and the venue is breathtaking. Every detail was handled with care, making our special day completely stress-free. Our guests are still raving about it. I cannot recommend them highly enough! Truly a 5-star experience from start to finish.",
    date: "2 days ago",
    status: "Pending",
  },
  {
    id: "2",
    author: "Marcus Finch",
    avatar: "MF",
    avatarBg: "from-blue-400 to-indigo-500",
    vendorName: "Pixel Perfect Studios",
    rating: 1,
    excerpt: "The photographer was unprofessional and ...",
    fullReview:
      "The photographer was unprofessional and arrived late to our event. The quality of the photos was subpar and many were blurry or poorly lit.",
    date: "4 days ago",
    status: "Pending",
  },
  {
    id: "3",
    author: "Chloe Bennett",
    avatar: "CB",
    avatarBg: "from-green-400 to-emerald-500",
    vendorName: "Blooming Creations",
    rating: 5,
    excerpt: "Absolutely stunning floral arrangements!",
    fullReview:
      "Absolutely stunning floral arrangements! They exceeded all our expectations.",
    date: "5 days ago",
    status: "Pending",
  },
];

const tabs = ["Pending", "Approved", "Rejected"];

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
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedReview, setSelectedReview] = useState(reviews[0]);
  const [moderatorNotes, setModeratorNotes] = useState("");

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
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} ${inputBorder} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-accent text-white"
                      : `${textSecondary} ${
                          darkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                        }`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="flex-1 overflow-y-auto">
            {reviews.map((review) => (
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
                    className={`w-12 h-12 rounded-full bg-linear-to-br ${review.avatarBg} flex items-center justify-center text-white font-semibold text-sm shrink-0`}
                  >
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium ${textPrimary}`}>
                          {review.author}
                        </p>
                        <p className={`text-sm ${textMuted} truncate`}>
                          {review.excerpt}
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
                            for {review.vendorName}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-xs ${textMuted}`}>{review.date}</p>
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-500 text-white mt-1">
                          {review.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Review Detail */}
        {selectedReview && (
          <div
            className={`flex-1 ${cardBg} border ${cardBorder} rounded-xl flex flex-col overflow-hidden`}
          >
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${textPrimary}`}>
                    {selectedReview.author}
                  </h3>
                  <p className={textSecondary}>
                    Review for{" "}
                    <span className={`font-medium ${textPrimary}`}>
                      {selectedReview.vendorName}
                    </span>
                  </p>
                </div>
                <p className={`text-sm ${textMuted}`}>{selectedReview.date}</p>
              </div>

              {/* Rating */}
              <div className="mb-6">{renderStars(selectedReview.rating)}</div>

              {/* Review Content */}
              <p className={`${textSecondary} leading-relaxed mb-8`}>
                {selectedReview.fullReview}
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
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors">
                <CheckCircle size={18} />
                Approve
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                  darkMode ? "border-white/10" : "border-gray-200"
                } ${textPrimary} font-semibold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors`}
              >
                <XCircle size={18} />
                Reject
              </button>
              <button
                className={`p-3 rounded-lg border ${
                  darkMode ? "border-white/10" : "border-gray-200"
                } ${textMuted} hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-colors`}
              >
                <Flag size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
