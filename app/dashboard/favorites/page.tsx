"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDashboardTheme } from "../layout";
import ConfirmDeleteModal from "@/components/modals/confirm-delete-modal";
import {
  Search,
  Heart,
  ImageIcon,
  BadgeCheck,
  Star,
  MapPin,
  Loader2,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { logger } from "@/lib/logger";

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
      logger.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const [favoriteToRemove, setFavoriteToRemove] = useState<string | null>(null);

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
      logger.error("Error removing favorite:", error);
    } finally {
      setRemovingId(null);
      setFavoriteToRemove(null);
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
            c.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      )
    : [];

  const inputClass = `px-4 py-3 rounded-xl ${inputBg} border ${inputBorder} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-accent/50`;

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
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${textMuted}`}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className={`mt-4 text-sm ${textMuted}`}>
            Loading your favorites...
          </p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div
          className={`${cardBg} ${cardBorder} border rounded-2xl p-12 text-center`}
        >
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              darkMode ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            <Heart className={`h-8 w-8 ${textMuted}`} />
          </div>
          <p className={`text-lg font-medium ${textPrimary}`}>
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
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-medium"
            >
              Browse Vendors
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => (
            <div
              key={favorite.id}
              className={`${cardBg} ${cardBorder} border rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.01]`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {favorite.provider.coverImage ? (
                  <Image
                    src={favorite.provider.coverImage}
                    alt={favorite.provider.businessName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      darkMode ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <ImageIcon className={`w-16 h-16 ${textMuted}`} />
                  </div>
                )}

                {/* Verified Badge */}
                {favorite.provider.verified && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-sm">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFavoriteToRemove(favorite.id);
                  }}
                  disabled={removingId === favorite.id}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-accent hover:bg-accent hover:text-white transition-colors disabled:opacity-50 shadow-sm"
                >
                  {removingId === favorite.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Heart className="w-5 h-5 fill-current" />
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <Link
                    href={`/vendors/${favorite.provider.id}`}
                    className={`font-semibold text-lg ${textPrimary} hover:text-accent transition-colors`}
                  >
                    {favorite.provider.businessName}
                  </Link>
                  {(favorite.provider.city || favorite.provider.state) && (
                    <p
                      className={`text-sm ${textMuted} flex items-center gap-1 mt-0.5`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {[favorite.provider.city, favorite.provider.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>

                {/* Categories */}
                {Array.isArray(favorite.provider.categories) &&
                  favorite.provider.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {favorite.provider.categories
                        .slice(0, 3)
                        .map((cat, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${
                              darkMode
                                ? "bg-white/5 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {cat.name}
                          </span>
                        ))}
                      {favorite.provider.categories.length > 3 && (
                        <span
                          className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${
                            darkMode
                              ? "bg-white/5 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          +{favorite.provider.categories.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                {/* Rating & Price Row */}
                <div className="flex items-center justify-between">
                  {favorite.provider.avgRating !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                      <span className={`font-medium ${textPrimary}`}>
                        {favorite.provider.avgRating.toFixed(1)}
                      </span>
                      {favorite.provider.reviewCount !== undefined && (
                        <span className={`text-sm ${textMuted}`}>
                          ({favorite.provider.reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                  <p
                    className={`text-sm font-medium ${textSecondary} flex items-center gap-1`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    {formatPrice(
                      favorite.provider.priceMin,
                      favorite.provider.priceMax,
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className={`p-4 border-t ${cardBorder} flex gap-2`}>
                <Link
                  href={`/vendors/${favorite.provider.id}`}
                  className={`flex-1 py-2.5 text-center text-sm font-medium rounded-xl border ${cardBorder} ${textPrimary} ${
                    darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  View Profile
                </Link>
                <Link
                  href={`/vendors/${favorite.provider.id}?inquiry=true`}
                  className="flex-1 py-2.5 text-center text-sm font-medium rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors"
                >
                  Send Inquiry
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={!!favoriteToRemove}
        onClose={() => setFavoriteToRemove(null)}
        onConfirm={() => favoriteToRemove && removeFavorite(favoriteToRemove)}
        title="Remove Favorite"
        message="Are you sure you want to remove this vendor from your favorites?"
        confirmText="Remove"
        variant="remove"
        isLoading={!!removingId}
      />
    </div>
  );
}
