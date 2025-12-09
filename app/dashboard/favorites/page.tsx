"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDashboardTheme } from "../layout";

interface Favorite {
  id: string;
  createdAt: string;
  provider: {
    id: string;
    businessName: string;
    description?: string;
    coverImage?: string;
    city?: string;
    state?: string;
    priceMin?: number;
    priceMax?: number;
    avgRating?: number;
    reviewCount?: number;
    verified: boolean;
    categories: { name: string }[];
  };
}

export default function FavoritesPage() {
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

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/favorites");
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeFavorite = async (favoriteId: string) => {
    try {
      setRemovingId(favoriteId);
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) return "Contact for pricing";
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    return min
      ? `From $${min.toLocaleString()}`
      : `Up to $${max?.toLocaleString()}`;
  };

  const filteredFavorites = Array.isArray(favorites)
    ? favorites.filter(
        (fav) =>
          fav.provider.businessName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          fav.provider.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fav.provider.categories.some((c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : [];

  const inputClass = `px-4 py-3 rounded-lg ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-rose-500`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>My Favorites</h1>
          <p className={textSecondary}>
            {favorites.length} saved vendor{favorites.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 ${inputClass}`}
          />
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredFavorites.length === 0 ? (
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className={`mt-4 text-lg font-medium ${textPrimary}`}>
            {searchTerm ? "No matching favorites" : "No favorites yet"}
          </p>
          <p className={`mt-1 ${textMuted}`}>
            {searchTerm
              ? "Try a different search term"
              : "Save vendors you love to find them easily later"}
          </p>
          {!searchTerm && (
            <Link
              href="/vendors"
              className="inline-block mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Browse Vendors
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => (
            <div
              key={favorite.id}
              className={`${cardBg} ${cardBorder} border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {favorite.provider.coverImage ? (
                  <img
                    src={favorite.provider.coverImage}
                    alt={favorite.provider.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`w-16 h-16 ${textMuted}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Verified Badge */}
                {favorite.provider.verified && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFavorite(favorite.id);
                  }}
                  disabled={removingId === favorite.id}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  {removingId === favorite.id ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <Link
                    href={`/vendors/${favorite.provider.id}`}
                    className={`font-semibold text-lg ${textPrimary} hover:text-rose-500`}
                  >
                    {favorite.provider.businessName}
                  </Link>
                  {(favorite.provider.city || favorite.provider.state) && (
                    <p className={`text-sm ${textMuted}`}>
                      {[favorite.provider.city, favorite.provider.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>

                {/* Categories */}
                {Array.isArray(favorite.provider.categories) && favorite.provider.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {favorite.provider.categories.slice(0, 3).map((cat, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cat.name}
                      </span>
                    ))}
                    {favorite.provider.categories.length > 3 && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        +{favorite.provider.categories.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Rating */}
                {favorite.provider.avgRating !== undefined && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-5 h-5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className={`font-medium ${textPrimary}`}>
                      {favorite.provider.avgRating.toFixed(1)}
                    </span>
                    {favorite.provider.reviewCount !== undefined && (
                      <span className={`text-sm ${textMuted}`}>
                        ({favorite.provider.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <p className={`font-medium ${textPrimary}`}>
                  {formatPrice(
                    favorite.provider.priceMin,
                    favorite.provider.priceMax
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className={`p-4 border-t ${cardBorder} flex gap-2`}>
                <Link
                  href={`/vendors/${favorite.provider.id}`}
                  className={`flex-1 py-2 text-center text-sm font-medium rounded-lg border ${cardBorder} ${textPrimary} hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  View Profile
                </Link>
                <Link
                  href={`/vendors/${favorite.provider.id}?inquiry=true`}
                  className="flex-1 py-2 text-center text-sm font-medium rounded-lg bg-rose-500 text-white hover:bg-rose-600"
                >
                  Send Inquiry
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
