"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Heart, Loader2, Hash, Award } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface SearchResultCardProps {
  provider: {
    id: string;
    businessName: string;
    description: string | null;
    coverImage: string | null;
    city: string | null;
    averageRating: number | null;
    reviewCount: number;
    priceFrom: number | null;
    isVerified: boolean;
    isFeatured: boolean;
    categories: string[];
    // Enhanced fields
    tags?: string[];
    slug?: string;
    matchReason?: string;
    distance?: number | null;
    isWithinRadius?: boolean;
  };
  viewMode: "grid" | "list";
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteLoading: boolean;
  searchType?: string;
  showFavoriteButton?: boolean; // New prop to control favorite button visibility
}

export default function SearchResultCard({
  provider,
  viewMode,
  isFavorite,
  onToggleFavorite,
  favoriteLoading,
  searchType,
  showFavoriteButton = true, // Default to true for backward compatibility
}: SearchResultCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite();
  };

  if (viewMode === "grid") {
    return (
      <Link
        href={`/vendors/${provider.id}`}
        className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all"
      >
        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden">
          {provider.coverImage ? (
            <Image
              src={provider.coverImage}
              alt={provider.businessName}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-accent to-teal-600 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {provider.businessName.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {provider.isFeatured && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-400 text-yellow-900 rounded-full">
                Featured
              </span>
            )}
            {provider.isVerified && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {/* Search match indicator */}
          {searchType && searchType !== "all" && (
            <div className="absolute top-3 right-12 px-2 py-1 text-xs font-medium bg-accent/90 text-accent-foreground rounded-full">
              {searchType === "tags" && (
                <Hash className="w-3 h-3 inline mr-1" />
              )}
              {searchType}
            </div>
          )}

          {/* Favorite button */}
          {showFavoriteButton && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              disabled={favoriteLoading}
            >
              {favoriteLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
              ) : (
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
            {provider.businessName}
          </h3>

          {(provider.city || provider.distance !== undefined) && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {provider.city}
                {provider.distance !== null &&
                  provider.distance !== undefined && (
                    <span className="ml-1">• {provider.distance} miles</span>
                  )}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star
                className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow"
                fill="currentColor"
              />
              <span className="text-base font-bold text-foreground">
                {provider.averageRating && provider.averageRating > 0
                  ? provider.averageRating.toFixed(1)
                  : "New"}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                ({provider.reviewCount} reviews)
              </span>
            </div>

            {provider.priceFrom && (
              <span className="text-sm font-medium text-foreground">
                From {formatCurrency(provider.priceFrom || 0)}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // List view
  return (
    <Link
      href={`/vendors/${provider.id}`}
      className="group flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="relative w-32 sm:w-48 aspect-square rounded-lg overflow-hidden shrink-0">
        {provider.coverImage ? (
          <Image
            src={provider.coverImage}
            alt={provider.businessName}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-accent to-teal-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {provider.businessName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
              {provider.businessName}
            </h3>
            {(provider.city || provider.distance !== undefined) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {provider.city}
                  {provider.distance !== null &&
                    provider.distance !== undefined && (
                      <span className="ml-1">• {provider.distance} miles</span>
                    )}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 shrink-0">
              <Star
                className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow"
                fill="currentColor"
              />
              <span className="text-base font-bold text-foreground">
                {provider.averageRating && provider.averageRating > 0
                  ? provider.averageRating.toFixed(1)
                  : "New"}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                ({provider.reviewCount} reviews)
              </span>
            </div>

            {/* Favorite button */}
            {showFavoriteButton && (
              <button
                onClick={handleFavoriteClick}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                disabled={favoriteLoading}
              >
                {favoriteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                ) : (
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                )}
              </button>
            )}
          </div>
        </div>

        {provider.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {provider.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {provider.isFeatured && (
              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                Featured
              </span>
            )}
            {provider.isVerified && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" />
                Verified
              </span>
            )}
            {searchType && searchType !== "all" && (
              <span className="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full flex items-center gap-1">
                {searchType === "tags" && <Hash className="w-3 h-3" />}
                {searchType} match
              </span>
            )}
          </div>

          {provider.priceFrom && (
            <span className="text-sm font-medium text-foreground">
              From {formatCurrency(provider.priceFrom || 0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
