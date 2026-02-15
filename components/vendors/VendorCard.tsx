"use client";

import Link from "next/link";
import { MapPin, Award, Star } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import FavoriteButton from "@/components/common/FavoriteButton";
import ShareButton from "@/components/common/ShareButton";

interface VendorCardProps {
  vendor: {
    id: string;
    businessName: string;
    address: string | null;
    description?: string | null;
    categories: string[];
    coverImage: string | null;
    photos: string[];
    isVerified: boolean;
    isFeatured: boolean;
    averageRating: number | null;
    reviewCount: number;
    city: string | null;
    priceFrom: number | null;
    _count?: {
      reviews: number;
    };
  };
}

// Default images by category
const categoryImages: Record<string, string> = {
  Venues:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop",
  Photography:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=800&fit=crop",
  Catering:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop",
  "Music & DJs":
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=800&fit=crop",
  Flowers:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop",
  Planning:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop",
  Baking:
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=800&fit=crop",
  Decoration:
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop",
  default:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop",
};

const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max - 3) + "..." : str;

const formatCategories = (cats?: string | string[]) => {
  // Handle both array and string (legacy/API difference)
  const catString = Array.isArray(cats)
    ? cats[0] || ""
    : typeof cats === "string"
      ? cats
      : "";

  const str = (catString ?? "").trim();
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function VendorCard({ vendor }: VendorCardProps) {
  // Determine image source
  const bgImage =
    vendor.coverImage ||
    vendor.photos?.[0] ||
    categoryImages[vendor.categories?.[0]] ||
    categoryImages.default;

  const reviewCount = vendor._count?.reviews ?? vendor.reviewCount ?? 0;

  return (
    <div className="group relative">
      <Link href={`/vendors/${vendor.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-muted/50 shadow-lg transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
            style={{
              backgroundImage: `url(${bgImage})`,
            }}
          />

          {/* Action Buttons - Top Right */}
          <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100">
            <div onClick={(e) => e.preventDefault()}>
              <FavoriteButton
                providerId={vendor.id}
                variant="outline"
                className="bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
              />
            </div>
            <div onClick={(e) => e.preventDefault()}>
              <ShareButton
                url={`${
                  typeof window !== "undefined" ? window.location.origin : ""
                }/vendors/${vendor.id}`}
                title={vendor.businessName}
                description={
                  vendor.description ||
                  `Check out ${vendor.businessName} on EVA`
                }
                variant="outline"
                className="bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
              />
            </div>
          </div>

          {/* Verified Badge */}
          {vendor.isVerified && (
            <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
              <Award className="h-5 w-5 text-accent" />
            </div>
          )}

          {/* Featured Badge */}
          {vendor.isFeatured && (
            <div className="absolute left-3 top-14 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-md">
              Featured
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 p-4 text-background">
            <p className="mb-1 text-xs font-medium text-background/70">
              {formatCategories(vendor.categories) || "Services"}
            </p>
            <h3 className="mb-2 text-lg font-semibold leading-tight">
              {vendor.businessName}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                <span className="text-sm font-medium">
                  {vendor.averageRating && vendor.averageRating > 0
                    ? vendor.averageRating.toFixed(1)
                    : "New"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground ml-1">
                ({reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Card Footer */}
      <div className="mt-3 px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>
              {truncate(
                vendor.address && vendor.city
                  ? `${vendor.address}, ${vendor.city}`
                  : vendor.city || "UK",
                25,
              )}
            </span>
          </div>
          {vendor.priceFrom && (
            <span className="text-sm font-medium text-foreground">
              From {formatCurrency(vendor.priceFrom || 0)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
