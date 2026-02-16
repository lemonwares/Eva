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
  Filter,
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
        {/* Search Header Section */}
        <section className="relative px-4 pt-10 pb-10 sm:px-6 lg:px-8 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Find your perfect vendor
                </h1>
                <p className="text-muted-foreground mt-2 max-w-lg">
                  Discover top-rated professionals for your special occasion across our curated network.
                </p>
              </div>
              
              <SearchModeToggle
                value={filters.searchType}
                onChange={(mode) =>
                  setFilters((prev) => ({ ...prev, searchType: mode }))
                }
                className="shrink-0"
              />
            </div>

            {/* Enhanced Search Input Area */}
            <div className="bg-card/50 backdrop-blur-md border border-border p-3 sm:p-4 rounded-3xl shadow-xl shadow-foreground/5 mb-8">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-0">
                   {filters.searchType === "tags" ? (
                    <TagInput
                      value={filters.tags}
                      onChange={(tags) =>
                        setFilters((prev) => ({ ...prev, tags }))
                      }
                      suggestions={availableTags}
                      placeholder="Add tags: wedding, photography, indian..."
                      className="border-none shadow-none focus-within:ring-0"
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
                      className="border-none shadow-none"
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
                      className="border-none shadow-none"
                    />
                  )}
                </div>

                <div className="flex gap-2 shrink-0 h-[52px]">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-8 bg-accent text-accent-foreground rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    <span className="sm:inline">Search</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-3.5 border border-border bg-background rounded-2xl flex items-center justify-center hover:bg-muted transition md:hidden group"
                    title="Toggle filters"
                  >
                    <SlidersHorizontal className="w-5 h-5 text-foreground group-active:scale-90 transition-transform" />
                  </button>
                </div>
              </form>

              {/* Active Search & Context */}
              {(filters.tags.length > 0 ||
                filters.slug ||
                (filters.query && filters.searchType !== "all")) && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50 text-sm">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" />
                    Searching for:
                  </span>

                  {filters.searchType === "tags" && filters.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full font-medium">
                      <Hash className="w-3.5 h-3.5" />
                      <span>
                        {filters.tags.length} tag
                        {filters.tags.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {filters.searchType === "slug" && filters.slug && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Slug: {filters.slug}</span>
                    </div>
                  )}

                  {filters.searchType === "text" && filters.query && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      <Search className="w-3.5 h-3.5" />
                      <span>"{filters.query}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="mb-8">
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
                <div className="text-center py-32 bg-card/30 rounded-3xl border-2 border-dashed border-border/50">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center shadow-inner">
                    <Search className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                    No matching vendors found
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed px-4">
                    We couldn't find any vendors matching your current filters. Try expanding your search or clearing all filters.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                    <button
                      onClick={clearFilters}
                      className="w-full sm:w-auto px-8 py-3.5 bg-accent text-accent-foreground rounded-2xl font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, query: "" }))}
                      className="w-full sm:w-auto px-8 py-3.5 border border-border bg-background rounded-2xl font-bold hover:bg-muted transition-all"
                    >
                      Reset Query
                    </button>
                  </div>
                  
                  {/* Suggestions for user */}
                  <div className="mt-12 pt-8 border-t border-border/50 max-w-lg mx-auto px-4">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Popular Categories</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Wedding", "Catering", "Photography", "Music"].map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                          className="px-4 py-2 bg-muted/50 hover:bg-accent/10 hover:text-accent rounded-full text-sm font-medium transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
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
