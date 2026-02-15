"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {
  Search,
  Grid,
  List,
  Loader2,
  SlidersHorizontal,
  Hash,
  Link2,
} from "lucide-react";
import SearchResultSkeleton from "@/components/ui/SearchResultSkeleton";
import TagInput from "@/components/ui/TagInput";
import SearchModeToggle from "@/components/ui/SearchModeToggle";
import EnhancedSearchInput from "@/components/ui/EnhancedSearchInput";
import SearchResultCard from "@/components/ui/SearchResultCard";
import SearchFilters from "@/components/ui/SearchFilters";
import { useGeolocation } from "@/hooks/useGeolocation";
import LocationPrompt from "@/components/ui/LocationPrompt";
import { logger } from "@/lib/logger";

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
  distance?: number | null;
  isWithinRadius?: boolean;
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

interface SearchFiltersState {
  query: string;
  category: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  sortBy: string;
  tags: string[];
  slug: string;
  searchType: "text" | "tags" | "slug" | "all";
  lat: string;
  lng: string;
  radius: string;
  ceremony: string;
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<{
    [id: string]: boolean;
  }>({});

  // Enhanced search state
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [filters, setFilters] = useState<SearchFiltersState>({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
    sortBy: searchParams.get("sortBy") || "relevance",
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    slug: searchParams.get("slug") || "",
    searchType: (searchParams.get("searchType") as any) || "all",
    lat: searchParams.get("lat") || "",
    lng: searchParams.get("lng") || "",
    radius: searchParams.get("radius") || "5",
    ceremony: searchParams.get("ceremony") || "",
  });

  // Geolocation
  const {
    lat: geoLat,
    lng: geoLng,
    error: geoError,
    loading: geoLoading,
    getLocation,
    checkPermission,
    permissionStatus,
  } = useGeolocation();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    // If permission is already granted, just get the location automatically
    // OR if permission is 'prompt', trigger it immediately to show the browser dialog
    // as requested: "ensure the use location from the browser always comes up when navigated"
    if (
      (permissionStatus === "granted" || permissionStatus === "prompt") &&
      !filters.lat &&
      !filters.lng
    ) {
      getLocation();
    }
  }, [permissionStatus, filters.lat, filters.lng, getLocation]);

  useEffect(() => {
    // Show prompt if no location is set and permission is not granted
    if (
      !filters.lat &&
      !filters.lng &&
      !filters.city &&
      (permissionStatus === "prompt" || permissionStatus === null)
    ) {
      setShowLocationPrompt(true);
    } else {
      setShowLocationPrompt(false);
    }
  }, [filters.lat, filters.lng, filters.city, permissionStatus]);

  useEffect(() => {
    if (geoLat && geoLng) {
      setFilters((prev) => ({
        ...prev,
        lat: geoLat.toString(),
        lng: geoLng.toString(),
      }));
      setShowLocationPrompt(false);
    }
  }, [geoLat, geoLng]);

  useEffect(() => {
    if (geoError && filters.lat === "loading") {
      setFilters((prev) => ({ ...prev, lat: "", lng: "" }));
      // Optional: show a toast or error message
    }
  }, [geoError, filters.lat]);

  useEffect(() => {
    if (filters.lat === "loading") {
      getLocation();
    }
  }, [filters.lat, getLocation]);

  // Handle city vs geolocation conflict
  useEffect(() => {
    if (filters.city && filters.lat && filters.lat !== "loading") {
      setFilters((prev) => ({ ...prev, lat: "", lng: "" }));
    }
  }, [filters.city]);

  useEffect(() => {
    if (filters.lat && filters.lat !== "loading" && filters.city) {
      setFilters((prev) => ({ ...prev, city: "" }));
    }
  }, [filters.lat]);

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
          setCities(Array.isArray(cityData) ? cityData : cityData.cities || []);
        }
      } catch (error) {
        logger.error("Error fetching filter options:", error);
      }
    }

    fetchFilterOptions();
  }, []);

  // Fetch favorites on mount
  useEffect(() => {
    async function fetchFavorites() {
      if (status !== "authenticated") {
        return;
      }

      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          const ids = (data.favorites || []).map((f: any) => f.provider.id);
          setFavoriteIds(new Set(ids));
        }
      } catch (err) {
        logger.error("Error fetching favorites:", err);
      }
    }
    fetchFavorites();
  }, [status]);

  // Fetch available tags for autocomplete
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/tags?type=popular&limit=100");
        if (res.ok) {
          const data = await res.json();
          setAvailableTags(data.tags || []);
        }
      } catch (err) {
        logger.error("Error fetching tags:", err);
      }
    }
    fetchTags();
  }, []);

  // Search providers
  const searchProviders = useCallback(
    async (resetPage = false) => {
      setLoading(true);
      const currentPage = resetPage ? 1 : page;

      try {
        const params = new URLSearchParams();

        if (filters.query) params.set("q", filters.query);
        if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
        if (filters.slug) params.set("slug", filters.slug);
        if (filters.searchType !== "all")
          params.set("searchType", filters.searchType);
        if (filters.category) params.set("category", filters.category);
        if (filters.city) params.set("city", filters.city);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (filters.minRating) params.set("rating", filters.minRating);
        if (filters.sortBy) params.set("sortBy", filters.sortBy);
        if (filters.lat) params.set("lat", filters.lat);
        if (filters.lng) params.set("lng", filters.lng);
        if (filters.radius) params.set("radius", filters.radius);
        if (filters.ceremony) params.set("cultureTags", filters.ceremony);
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
          setTotalResults(data.meta?.total || data.total || 0);
          setHasMore(data.meta?.hasMore || data.hasMore || false);
          if (resetPage) setPage(1);
        }
      } catch (error) {
        logger.error("Error searching providers:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, page],
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
    filters.tags,
    filters.slug,
    filters.searchType,
  ]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
    if (filters.slug) params.set("slug", filters.slug);
    if (filters.searchType !== "all")
      params.set("searchType", filters.searchType);
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.minRating) params.set("rating", filters.minRating);
    if (filters.sortBy !== "relevance") params.set("sortBy", filters.sortBy);
    if (filters.lat) params.set("lat", filters.lat);
    if (filters.lng) params.set("lng", filters.lng);
    if (filters.radius !== "5") params.set("radius", filters.radius);

    const newUrl = params.toString() ? `/search?${params}` : "/search";
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      tags: [],
      slug: "",
      searchType: "all",
      lat: "",
      lng: "",
      radius: "5",
      ceremony: "",
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.city ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating ||
    filters.tags.length > 0 ||
    filters.slug ||
    filters.lat ||
    filters.lng ||
    filters.radius !== "5";

  const loadMore = () => {
    setPage((prev) => prev + 1);
    searchProviders(false);
  };

  // Toggle favorite handler
  const handleToggleFavorite = async (providerId: string) => {
    setFavoriteLoading((prev) => ({ ...prev, [providerId]: true }));

    try {
      if (!favoriteIds.has(providerId)) {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerId }),
        });
        if (res.ok) {
          setFavoriteIds((prev) => new Set(prev).add(providerId));
        }
      } else {
        const res = await fetch(`/api/favorites/${providerId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setFavoriteIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(providerId);
            return newSet;
          });
        }
      }
    } catch (error) {
      logger.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [providerId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <LocationPrompt
        isOpen={showLocationPrompt}
        onAllow={() => {
          getLocation();
        }}
        onDecline={() => {
          setShowLocationPrompt(false);
        }}
      />

      <main className="pt-20 pb-16">
        {/* Hero banner */}
        <section className="px-4 pt-8 pb-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl text-foreground">
              Find your vendor
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Search controls */}
          <div className="mb-8">
            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="space-y-4 mb-4">
              {/* Search Mode Toggle */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <SearchModeToggle
                  value={filters.searchType}
                  onChange={(mode) =>
                    setFilters((prev) => ({ ...prev, searchType: mode }))
                  }
                  className="shrink-0"
                />
                <div className="text-xs text-muted-foreground">
                  {filters.searchType === "all" && "Search across all fields"}
                  {filters.searchType === "text" &&
                    "Search names & descriptions"}
                  {filters.searchType === "tags" && "Search by category tags"}
                  {filters.searchType === "slug" && "Direct vendor lookup"}
                </div>
              </div>

              <div className="flex gap-3">
                {/* Main Search Input */}
                {filters.searchType === "tags" ? (
                  <TagInput
                    value={filters.tags}
                    onChange={(tags) =>
                      setFilters((prev) => ({ ...prev, tags }))
                    }
                    suggestions={availableTags}
                    placeholder="Add tags: wedding, photography, indian..."
                    className="flex-1"
                  />
                ) : filters.searchType === "slug" ? (
                  <EnhancedSearchInput
                    value={filters.slug}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, slug: value }))
                    }
                    searchType={filters.searchType}
                    onSubmit={() => handleSearch()}
                    loading={loading}
                    className="flex-1"
                  />
                ) : (
                  <EnhancedSearchInput
                    value={filters.query}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, query: value }))
                    }
                    searchType={filters.searchType}
                    onSubmit={() => handleSearch()}
                    loading={loading}
                    className="flex-1"
                  />
                )}

                <button
                  type="submit"
                  className="px-4 sm:px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 transition shrink-0"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 sm:px-4 py-3 border border-border rounded-xl flex items-center gap-2 hover:bg-muted transition md:hidden shrink-0"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Active Search Indicators */}
              {(filters.tags.length > 0 ||
                filters.slug ||
                (filters.query && filters.searchType !== "all")) && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Active search:</span>

                  {filters.searchType === "tags" && filters.tags.length > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full">
                      <Hash className="w-3 h-3" />
                      <span>
                        {filters.tags.length} tag
                        {filters.tags.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {filters.searchType === "slug" && filters.slug && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      <Link2 className="w-3 h-3" />
                      <span>Slug: {filters.slug}</span>
                    </div>
                  )}

                  {filters.searchType === "text" && filters.query && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      <Search className="w-3 h-3" />
                      <span>Text: "{filters.query}"</span>
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Results count and view toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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

                {/* Search type indicator */}
                {!loading && providers.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    via{" "}
                    {filters.searchType === "all"
                      ? "combined"
                      : filters.searchType}{" "}
                    search
                  </span>
                )}
              </div>
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
            {/* Filters Sidebar */}
            <SearchFilters
              filters={filters}
              categories={categories}
              cities={cities}
              setFilters={setFilters}
              clearFilters={clearFilters}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              hasActiveFilters={!!hasActiveFilters}
              className="hidden md:block"
            />

            {/* Results */}
            <div className="flex-1">
              {loading && providers.length === 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SearchResultSkeleton key={i} viewMode={viewMode} />
                  ))}
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
                      <SearchResultCard
                        key={provider.id}
                        provider={provider}
                        viewMode="grid"
                        isFavorite={favoriteIds.has(provider.id)}
                        onToggleFavorite={() =>
                          handleToggleFavorite(provider.id)
                        }
                        favoriteLoading={favoriteLoading[provider.id] || false}
                        searchType={filters.searchType}
                        showFavoriteButton={status === "authenticated"}
                      />
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
                      <SearchResultCard
                        key={provider.id}
                        provider={provider}
                        viewMode="list"
                        isFavorite={favoriteIds.has(provider.id)}
                        onToggleFavorite={() =>
                          handleToggleFavorite(provider.id)
                        }
                        favoriteLoading={favoriteLoading[provider.id] || false}
                        searchType={filters.searchType}
                        showFavoriteButton={status === "authenticated"}
                      />
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
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SearchResultSkeleton key={i} viewMode="grid" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
