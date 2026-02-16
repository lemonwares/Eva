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
        className="group relative flex flex-col h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1"
      >
        {/* Featured Overlay */}
        {provider.isFeatured && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 z-20" />
        )}

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {provider.coverImage ? (
            <Image
              src={provider.coverImage}
              alt={provider.businessName}
              fill
              unoptimized
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center">
              <span className="text-4xl font-bold text-accent/20">
                {provider.businessName.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <div className="flex flex-col gap-1.5">
              {provider.isVerified && (
                <span className="w-fit flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#1a5f4d] shadow-sm rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100/50">
                  <Award className="w-3 h-3 fill-green-600/20" />
                  Verified
                </span>
              )}
              {provider.isFeatured && (
                <span className="w-fit px-2.5 py-1 bg-yellow-400 text-yellow-950 shadow-sm rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>

            {showFavoriteButton && (
              <button
                onClick={handleFavoriteClick}
                className={`p-2.5 rounded-full transition-all duration-300 shadow-md ${
                  isFavorite 
                    ? "bg-red-50 text-red-500 hover:bg-red-100" 
                    : "bg-white/90 backdrop-blur-md text-slate-600 hover:bg-white"
                }`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                disabled={favoriteLoading}
              >
                {favoriteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                )}
              </button>
            )}
          </div>

          {/* Bottom Info on Image */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
             {provider.categories && provider.categories.length > 0 && (
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.15em]">
                {provider.categories[0]}
              </span>
             )}
          </div>
        </div>

        {/* Details Container */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-accent transition-colors line-clamp-1">
              {provider.businessName}
            </h3>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-foreground">
                {provider.averageRating && provider.averageRating > 0
                  ? provider.averageRating.toFixed(1)
                  : "New"}
              </span>
            </div>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span className="text-xs text-muted-foreground font-medium">
              {provider.reviewCount} {provider.reviewCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
            {(provider.city || provider.distance !== undefined) && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span className="truncate max-w-[120px]">
                  {provider.city || "UK"}
                </span>
                {provider.distance !== null && provider.distance !== undefined && (
                   <span className="text-accent">• {provider.distance.toFixed(1)}m</span>
                )}
              </div>
            )}

            {provider.priceFrom && (
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">From</span>
                <span className="text-sm font-black text-foreground">
                  {formatCurrency(provider.priceFrom)}
                </span>
              </div>
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
