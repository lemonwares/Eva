// Fetch user favorites on mount

"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Filter,
  X,
  ChevronDown,
  Grid,
  List,
  Loader2,
  SlidersHorizontal,
  Heart,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface Provider {
  id: string;
  businessName: string;
  description: string | null;
  coverImage: string | null;
  city: string | null;
  state?: string | null;
  averageRating: number | null;
  reviewCount: number;
  priceFrom: number | null;
  isVerified: boolean;
  isFeatured: boolean;
  categories: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface City {
  id: string;
  name: string;
  slug: string;
}

interface SearchFilters {
  query: string;
  category: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  sortBy: string;
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Favorites state: Set of provider IDs
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  // Loading state for favorite actions (providerId -> boolean)
  const [favoriteLoading, setFavoriteLoading] = useState<{
    [id: string]: boolean;
  }>({});

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
    sortBy: searchParams.get("sortBy") || "relevance",
  });

  // Fetch categories and cities for filters
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const [catRes, cityRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/cities"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || catData || []);
        }

        if (cityRes.ok) {
          const cityData = await cityRes.json();
          // API returns array of city objects directly
          setCities(Array.isArray(cityData) ? cityData : cityData.cities || []);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    }

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          const ids = (data.favorites || []).map((f: any) => f.provider.id);
          setFavoriteIds(new Set(ids));
        }
      } catch (err) {
        // Ignore errors (user may be unauthenticated)
      }
    }
    fetchFavorites();
  }, []);

  // Search providers
  const searchProviders = useCallback(
    async (resetPage = false) => {
      setLoading(true);
      const currentPage = resetPage ? 1 : page;

      try {
        const params = new URLSearchParams();
        if (filters.query) params.set("q", filters.query);
        if (filters.category) params.set("category", filters.category);
        if (filters.city) params.set("city", filters.city);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (filters.minRating) params.set("rating", filters.minRating);
        if (filters.sortBy) params.set("sortBy", filters.sortBy);
        params.set("page", currentPage.toString());
        params.set("limit", "12");

        const response = await fetch(`/api/search?${params}`);
        if (response.ok) {
          const data = await response.json();
          if (resetPage) {
            setProviders(data.providers || []);
          } else {
            setProviders((prev) => [...prev, ...(data.providers || [])]);
          }
          setTotalResults(data.total || 0);
          setHasMore(data.hasMore || false);
          if (resetPage) setPage(1);
        }
      } catch (error) {
        console.error("Error searching providers:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, page]
  );

  useEffect(() => {
    searchProviders(true);
  }, [
    filters.category,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.sortBy,
  ]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.minRating) params.set("rating", filters.minRating);
    if (filters.sortBy !== "relevance") params.set("sortBy", filters.sortBy);

    const newUrl = params.toString() ? `/search?${params}` : "/search";
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProviders(true);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sortBy: "relevance",
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.city ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating;

  const loadMore = () => {
    setPage((prev) => prev + 1);
    searchProviders(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Find Your Perfect Vendor
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vendors, services, or locations..."
                  value={filters.query}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, query: e.target.value }))
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-border rounded-xl flex items-center gap-2 hover:bg-muted transition md:hidden"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </form>

            {/* Results count and view toggle */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {loading ? (
                  "Searching..."
                ) : providers.length > 0 ? (
                  <>
                    <span className="font-semibold text-foreground">
                      {providers.length}
                    </span>{" "}
                    vendors found
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-foreground">0</span>{" "}
                    vendors found
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                {/* Sort dropdown */}
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>

                {/* View toggle */}
                <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-accent text-accent-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-accent text-accent-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            {/* Sidebar stays hidden on mobile; we use the modal for mobile filters. */}
            <aside className="hidden md:block w-72 shrink-0">
              <div className="sticky top-28 p-4 border border-border rounded-xl bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-accent hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="">All Locations</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                    />
                  </div>
                </div>

                {/* Minimum Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Minimum Rating
                  </label>
                  <div className="flex gap-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            minRating:
                              prev.minRating === rating.toString()
                                ? ""
                                : rating.toString(),
                          }))
                        }
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm ${
                          filters.minRating === rating.toString()
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {rating}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {loading && providers.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : providers.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No vendors found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providers.map((provider) => (
                      <Link
                        key={provider.id}
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
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center">
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
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>

                          {/* Favorite button */}
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              setFavoriteLoading((prev) => ({
                                ...prev,
                                [provider.id]: true,
                              }));
                              if (!favoriteIds.has(provider.id)) {
                                // Add to favorites
                                try {
                                  const res = await fetch("/api/favorites", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      providerId: provider.id,
                                    }),
                                  });
                                  if (res.ok) {
                                    setFavoriteIds((prev) =>
                                      new Set(prev).add(provider.id)
                                    );
                                  }
                                } catch {}
                              } else {
                                // Remove from favorites
                                try {
                                  const res = await fetch(
                                    `/api/favorites/${provider.id}`,
                                    {
                                      method: "DELETE",
                                    }
                                  );
                                  if (res.ok) {
                                    setFavoriteIds((prev) => {
                                      const newSet = new Set(prev);
                                      newSet.delete(provider.id);
                                      return newSet;
                                    });
                                  }
                                } catch {}
                              }
                              setFavoriteLoading((prev) => ({
                                ...prev,
                                [provider.id]: false,
                              }));
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition"
                            aria-label={
                              favoriteIds.has(provider.id)
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                            disabled={favoriteLoading[provider.id]}
                          >
                            {favoriteLoading[provider.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin text-accent" />
                            ) : (
                              <Heart
                                className={`w-4 h-4 ${
                                  favoriteIds.has(provider.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-600"
                                }`}
                              />
                            )}
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                            {provider.businessName}
                          </h3>

                          {provider.city && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{provider.city}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star
                                className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow"
                                fill="currentColor"
                              />
                              <span className="text-base font-bold text-foreground">
                                {provider.averageRating &&
                                provider.averageRating > 0
                                  ? provider.averageRating.toFixed(1)
                                  : "New"}
                              </span>
                              <span className="text-xs text-muted-foreground ml-1">
                                ({provider.reviewCount} reviews)
                              </span>
                            </div>

                            {provider.priceFrom && (
                              <span className="text-sm font-medium text-foreground">
                                From {formatCurrency(provider?.priceFrom || 0)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="text-center mt-8">
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 border border-border rounded-xl font-medium hover:bg-muted transition disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                          "Load More"
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    {providers.map((provider) => (
                      <Link
                        key={provider.id}
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
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                              <span className="text-2xl font-bold text-white">
                                {provider.businessName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            {/* Favorite button (list view) */}
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                setFavoriteLoading((prev) => ({
                                  ...prev,
                                  [provider.id]: true,
                                }));
                                if (!favoriteIds.has(provider.id)) {
                                  // Add to favorites
                                  try {
                                    const res = await fetch("/api/favorites", {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        providerId: provider.id,
                                      }),
                                    });
                                    if (res.ok) {
                                      setFavoriteIds((prev) =>
                                        new Set(prev).add(provider.id)
                                      );
                                    }
                                  } catch {}
                                } else {
                                  // Remove from favorites
                                  try {
                                    const res = await fetch(
                                      `/api/favorites/${provider.id}`,
                                      {
                                        method: "DELETE",
                                      }
                                    );
                                    if (res.ok) {
                                      setFavoriteIds((prev) => {
                                        const newSet = new Set(prev);
                                        newSet.delete(provider.id);
                                        return newSet;
                                      });
                                    }
                                  } catch {}
                                }
                                setFavoriteLoading((prev) => ({
                                  ...prev,
                                  [provider.id]: false,
                                }));
                              }}
                              className="ml-auto p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition"
                              aria-label={
                                favoriteIds.has(provider.id)
                                  ? "Remove from favorites"
                                  : "Add to favorites"
                              }
                              disabled={favoriteLoading[provider.id]}
                            >
                              {favoriteLoading[provider.id] ? (
                                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                              ) : (
                                <Heart
                                  className={`w-4 h-4 ${
                                    favoriteIds.has(provider.id)
                                      ? "fill-red-500 text-red-500"
                                      : "text-gray-600"
                                  }`}
                                />
                              )}
                            </button>
                            <div>
                              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                                {provider.businessName}
                              </h3>
                              {provider.city && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{provider.city}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <Star
                                className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow"
                                fill="currentColor"
                              />
                              <span className="text-base font-bold text-foreground">
                                {provider.averageRating &&
                                provider.averageRating > 0
                                  ? provider.averageRating.toFixed(1)
                                  : "New"}
                              </span>
                              <span className="text-xs text-muted-foreground ml-1">
                                ({provider.reviewCount} reviews)
                              </span>
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
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>

                            {provider.priceFrom && (
                              <span className="text-sm font-medium text-foreground">
                                From {formatCurrency(provider?.priceFrom || 0)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="text-center mt-8">
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 border border-border rounded-xl font-medium hover:bg-muted transition disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                          "Load More"
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-background rounded-t-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-foreground">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile filter content - same as sidebar */}
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <select
                  value={filters.city}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">All Locations</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Minimum Rating
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          minRating:
                            prev.minRating === rating.toString()
                              ? ""
                              : rating.toString(),
                        }))
                      }
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm ${
                        filters.minRating === rating.toString()
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border"
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply button */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 border border-border rounded-xl font-medium"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-accent text-accent-foreground rounded-xl font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
