"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Award,
  Star,
  Filter,
  ChevronDown,
  Loader2,
  ArrowLeft,
  X,
  Heart,
  Share2,
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { formatCurrency } from "@/lib/formatters";
import FavoriteButton from "@/components/common/FavoriteButton";
import ShareButton from "@/components/common/ShareButton";
import VendorCard from "@/components/vendors/VendorCard";
import { logger } from "@/lib/logger";

interface Provider {
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
  _count: {
    reviews: number;
  };
}



export default function VendorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </div>
      }
    >
      <VendorsPageContent />
    </Suspense>
  );
}

function VendorsPageContent() {
  const searchParams = useSearchParams();
  const [vendors, setVendors] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [locationQuery, setLocationQuery] = useState(
    searchParams.get("location") || ""
  );
  const [ceremonyType, setCeremonyType] = useState(
    searchParams.get("ceremony") || ""
  );
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  // Update state when URL params change
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setLocationQuery(searchParams.get("location") || "");
    setCeremonyType(searchParams.get("ceremony") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchVendors();
  }, [
    pagination.page,
    selectedCategory,
    verifiedOnly,
    searchQuery,
    locationQuery,
    ceremonyType,
  ]);

  async function fetchVendors() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        published: "true",
      });

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      if (verifiedOnly) {
        params.append("verified", "true");
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (locationQuery) {
        params.append("location", locationQuery);
      }
      if (ceremonyType) {
        params.append("ceremony", ceremonyType);
      }

      const response = await fetch(`/api/providers?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch vendors");

      const data = await response.json();
      setVendors(data.providers || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (err) {
      logger.error("Error fetching vendors:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    verifiedOnly ||
    locationQuery ||
    ceremonyType;

  const categories = [
    "Venues",
    "Photography",
    "Catering",
    "Music & DJs",
    "Flowers",
    "Planning",
    "Baking",
    "Decorators",
    "Makeup",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-foreground via-foreground/95 to-foreground/90 px-4 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-background/70 transition hover:text-background mb-6"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Back to Home</span>
          </Link>

          <h1 className="mb-4 bg-linear-to-r from-background via-background to-background/80 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Find Your Perfect Vendor
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-background/70">
            Browse our curated collection of verified vendors across different
            categories. Find the perfect match for your event.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vendors by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-background py-4 pl-12 pr-4 text-foreground shadow-lg ring-1 ring-black/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-full bg-background/20 px-6 py-4 text-background backdrop-blur-sm transition hover:bg-background/30"
            >
              <Filter size={18} />
              Filters
              <ChevronDown
                size={16}
                className={`transition ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 rounded-2xl bg-background/10 p-6 backdrop-blur-sm">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="mb-2 block text-sm text-background/70">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-background px-4 py-2">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="h-4 w-4 text-accent"
                    />
                    <span className="text-foreground">Verified Only</span>
                  </label>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setLocationQuery("");
                      setCeremonyType("");
                      setVerifiedOnly(false);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-background/20 px-4 py-2 text-background transition hover:bg-background/30"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Vendors Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${pagination.total} vendors found`}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && vendors.length === 0 && (
            <div className="py-20 text-center">
              <p className="mb-4 text-xl text-muted-foreground">
                No vendors found
              </p>
              <p className="mb-6 text-muted-foreground">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setLocationQuery("");
                  setCeremonyType("");
                  setVerifiedOnly(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-accent-foreground transition hover:opacity-90"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Vendors Grid */}
          {!isLoading && vendors.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && pagination.pages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="rounded-lg border border-border px-4 py-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.pages}
                className="rounded-lg border border-border px-4 py-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
