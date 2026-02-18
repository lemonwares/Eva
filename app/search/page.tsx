"use client";

import { useState, useEffect, useCallback, Suspense, useRef, useMemo } from "react";
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
  ArrowUp,
  RefreshCw,
} from "lucide-react";
import SearchResultSkeleton from "@/components/ui/SearchResultSkeleton";
import TagInput from "@/components/ui/TagInput";
import SearchModeToggle from "@/components/ui/SearchModeToggle";
import EnhancedSearchInput from "@/components/ui/EnhancedSearchInput";
import SearchResultCard from "@/components/ui/SearchResultCard";
import SearchFilters from "@/components/ui/SearchFilters";
import { useGeolocation } from "@/hooks/useGeolocation";
// import LocationPrompt from "@/components/ui/LocationPrompt";
import { logger } from "@/lib/logger";
import { Pagination } from "@/components/ui/Pagination";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const ITEMS_PER_PAGE = 12;

  // ── Scroll-aware fixed search bar (mobile) ──
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastScrollY = useRef(0);
  const scrollThreshold = 300; // Distance before fixed bar can appear

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Back to top button
      setShowBackToTop(currentScrollY > 600);

      // Fixed search bar logic (only matters on mobile via CSS)
      if (currentScrollY < scrollThreshold) {
        // Near top — hide fixed bar (original inline bar is visible)
        setIsSearchBarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling UP — show the fixed bar
        setIsSearchBarVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        // Scrolling DOWN (with small threshold to avoid flicker) — hide it
        setIsSearchBarVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Pull-to-Refresh ──
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);
  const pullDistanceRef = useRef(0);
  const isRefreshingRef = useRef(false);
  const pullThreshold = 80;

  // Keep refs in sync with state
  useEffect(() => { pullDistanceRef.current = pullDistance; }, [pullDistance]);
  useEffect(() => { isRefreshingRef.current = isRefreshing; }, [isRefreshing]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current) return;
      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.5, 120)); // Dampen the pull
      }
    };

    const handleTouchEnd = () => {
      if (pullDistanceRef.current >= pullThreshold && !isRefreshingRef.current) {
        setIsRefreshing(true);
        // Trigger refresh
        searchProviders(1).then(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        });
      } else {
        setPullDistance(0);
      }
      isPulling.current = false;
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  // const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  // Track which source (geo vs city) was set most recently to avoid loops
  const lastLocationSource = useRef<"geo" | "city" | null>(null);

  // 1. Check permission status on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // 2. Auto-fetch location — triggers browser popup if permission is "prompt"
  useEffect(() => {
    if (
      (permissionStatus === "granted" || permissionStatus === "prompt") &&
      !filters.lat &&
      !filters.lng
    ) {
      getLocation();
    }
  }, [permissionStatus, filters.lat, filters.lng, getLocation]);

  // 3. LocationPrompt disabled — relying on "Use my location" button instead
  // useEffect(() => {
  //   if (
  //     !filters.lat &&
  //     !filters.lng &&
  //     !filters.city &&
  //     (permissionStatus === "prompt" || permissionStatus === null)
  //   ) {
  //     setShowLocationPrompt(true);
  //   } else {
  //     setShowLocationPrompt(false);
  //   }
  // }, [filters.lat, filters.lng, filters.city, permissionStatus]);

  // 4. When geolocation hook resolves coords, push them into filters
  useEffect(() => {
    if (geoLat && geoLng) {
      lastLocationSource.current = "geo";
      setFilters((prev) => ({
        ...prev,
        lat: geoLat.toString(),
        lng: geoLng.toString(),
        city: "", // Clear city when geo is set (mutual exclusion)
      }));
      // setShowLocationPrompt(false);
    }
  }, [geoLat, geoLng]);

  // 5. When geo errors out while we're in "loading" state, reset
  useEffect(() => {
    if (geoError && filters.lat === "loading") {
      setFilters((prev) => ({ ...prev, lat: "", lng: "" }));
    }
  }, [geoError, filters.lat]);

  // 6. When SearchFilters "Use my location" button sets lat to "loading",
  //    actually trigger the browser geolocation
  useEffect(() => {
    if (filters.lat === "loading") {
      getLocation();
    }
  }, [filters.lat, getLocation]);

  // 7. When user picks a city, clear geo coords (mutual exclusion)
  //    Uses the ref to prevent infinite loops
  useEffect(() => {
    if (filters.city && filters.lat && filters.lat !== "loading") {
      // Only clear if the city change wasn't triggered by us setting geo
      if (lastLocationSource.current !== "geo") {
        lastLocationSource.current = "city";
        setFilters((prev) => ({ ...prev, lat: "", lng: "" }));
      }
    }
  }, [filters.city]);

  // Reset the source ref when filters are fully settled
  useEffect(() => {
    if (!filters.city && !filters.lat) {
      lastLocationSource.current = null;
    }
  }, [filters.city, filters.lat]);

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
    async (pageNumber: number) => {
      setLoading(true);
      
      if (pageNumber !== 1) {
         window.scrollTo({ top: 0, behavior: "smooth" });
      }

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
        // Guard: only send lat/lng when they are valid numbers (not "loading")
        if (filters.lat && filters.lat !== "loading" && !isNaN(Number(filters.lat))) {
          params.set("lat", filters.lat);
        }
        if (filters.lng && filters.lng !== "loading" && !isNaN(Number(filters.lng))) {
          params.set("lng", filters.lng);
        }
        if (filters.radius) params.set("radius", filters.radius);
        if (filters.ceremony) params.set("cultureTags", filters.ceremony);
        params.set("page", pageNumber.toString());
        params.set("limit", ITEMS_PER_PAGE.toString());

        const response = await fetch(`/api/search?${params}`);
        if (response.ok) {
          const data = await response.json();
          setProviders(data.providers || []);
          setTotalResults(data.meta?.total || data.total || 0);
        }
      } catch (error) {
        logger.error("Error searching providers:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    setPage(1);
    searchProviders(1);
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
    filters.lat,
    filters.lng,
    filters.radius,
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
    if (filters.lat && filters.lat !== "loading" && !isNaN(Number(filters.lat))) params.set("lat", filters.lat);
    if (filters.lng && filters.lng !== "loading" && !isNaN(Number(filters.lng))) params.set("lng", filters.lng);
    if (filters.radius !== "5") params.set("radius", filters.radius);

    const newUrl = params.toString() ? `/search?${params}` : "/search";
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1);
    searchProviders(1);
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    searchProviders(newPage);
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
    filters.radius !== "5";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Shared search bar content (used in both inline and fixed bar) ──
  const activeFilterCount = useMemo(() => 
    [filters.category, filters.city, filters.minPrice, filters.maxPrice, filters.minRating, filters.radius !== "5" ? filters.radius : ""].filter(Boolean).length,
    [filters.category, filters.city, filters.minPrice, filters.maxPrice, filters.minRating, filters.radius]
  );

  const renderSearchBar = useCallback((compact = false) => (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <div className="flex-1 min-w-0">
        {filters.searchType === "tags" ? (
          <TagInput
            value={filters.tags}
            onChange={(tags) =>
              setFilters((prev) => ({ ...prev, tags }))
            }
            suggestions={availableTags}
            placeholder="Add tags: wedding, photography..."
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

      <div className={`flex gap-2 shrink-0 ${compact ? "h-[44px]" : "h-[52px]"}`}>
        <button
          type="submit"
          className={`flex-1 sm:flex-none ${compact ? "px-5" : "px-8"} bg-accent text-accent-foreground rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
        >
          <Search className={compact ? "w-4 h-4" : "w-5 h-5"} />
          <span>Search</span>
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`relative ${compact ? "px-3 py-2" : "px-4 py-3"} border ${hasActiveFilters ? "border-accent/50 bg-accent/5" : "border-border bg-background"} rounded-2xl flex items-center justify-center gap-1.5 hover:bg-muted transition md:hidden group`}
          title="Toggle filters"
        >
          <SlidersHorizontal className={`${compact ? "w-3.5 h-3.5" : "w-4 h-4"} ${hasActiveFilters ? "text-accent" : "text-foreground"} group-active:scale-90 transition-transform`} />
          <span className={`${compact ? "text-xs" : "text-sm"} font-semibold ${hasActiveFilters ? "text-accent" : "text-foreground"}`}>Filter</span>
          {hasActiveFilters && activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-accent text-accent-foreground rounded-full leading-none shadow-sm">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </form>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [filters, loading, availableTags, hasActiveFilters, activeFilterCount, showFilters]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* LocationPrompt disabled — using "Use my location" in filters instead */}
      {/* <LocationPrompt
        isOpen={showLocationPrompt}
        onAllow={() => {
          getLocation();
        }}
        onDecline={() => {
          setShowLocationPrompt(false);
        }}
      /> */}

      {/* ── Pull-to-Refresh Indicator ── */}
      <div
        className="fixed top-20 left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-300 md:hidden"
        style={{
          opacity: pullDistance > 20 ? 1 : 0,
          transform: `translateY(${Math.min(pullDistance - 20, 60)}px)`,
        }}
      >
        <div className={`bg-card border border-border rounded-full p-3 shadow-lg ${isRefreshing ? "animate-spin" : ""}`}>
          <RefreshCw className="w-5 h-5 text-accent" />
        </div>
      </div>

      {/* ── Fixed Search Bar (appears on scroll-up, mobile only) ── */}
      <div
        className={`fixed top-20 left-0 right-0 z-40 transition-all duration-300 ease-in-out md:hidden
          ${isSearchBarVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
          }`}
      >
        <div className="mx-2 bg-background/95 backdrop-blur-md border border-border p-2.5 rounded-2xl shadow-xl shadow-foreground/5">
          {renderSearchBar(true)}
        </div>
      </div>

      <main className="pt-20 pb-16">
        {/* Search Header Section */}
        <section className="relative px-4 pt-8 pb-4 sm:px-6 sm:pt-10 sm:pb-6 lg:px-8">
          {/* Decorative background elements (contained) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Find your perfect vendor
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1.5 sm:mt-2 max-w-lg">
                  Discover top-rated professionals for your special occasion.
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

            {/* Inline Search Input Area (always visible at top) */}
            <div className="bg-background/95 backdrop-blur-md border border-border p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl shadow-foreground/5 mb-6 sm:mb-8">
              {renderSearchBar()}

              {/* Active Search & Context */}
              {(filters.tags.length > 0 ||
                filters.slug ||
                (filters.query && filters.searchType !== "all")) && (
                <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50 text-sm">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" />
                    Searching for:
                  </span>

                  {filters.searchType === "tags" && filters.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 text-accent rounded-full font-medium text-xs">
                      <Hash className="w-3 h-3" />
                      <span>
                        {filters.tags.length} tag
                        {filters.tags.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {filters.searchType === "slug" && filters.slug && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium text-xs">
                      <Link2 className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">Slug: {filters.slug}</span>
                    </div>
                  )}

                  {filters.searchType === "text" && filters.query && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium text-xs">
                      <Search className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">"{filters.query}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results header + Sort controls */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between gap-2">
              {/* Left: Result count */}
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {loading ? (
                    "Searching..."
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">
                        {totalResults}
                      </span>{" "}
                      vendors
                    </>
                  )}
                </p>
                
                {!loading && providers.length > 0 && (
                  <span className="hidden xs:inline text-[10px] sm:text-xs text-muted-foreground/70 px-1.5 py-0.5 bg-muted/50 rounded-full whitespace-nowrap">
                    {filters.searchType === "all" ? "combined" : filters.searchType}
                  </span>
                )}
              </div>

              {/* Right: Sort + View toggle */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                  className="px-2 sm:px-3 py-1.5 sm:py-2 border border-border rounded-lg bg-background text-foreground text-xs sm:text-sm min-w-0 max-w-[140px] sm:max-w-none"
                >
                  <option value="relevance">Relevant</option>
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price_low">Price ↑</option>
                  <option value="price_high">Price ↓</option>
                  <option value="newest">Newest</option>
                </select>

                <div className="flex border border-border rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 sm:p-2 ${
                      viewMode === "grid"
                        ? "bg-accent text-accent-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 sm:p-2 ${
                      viewMode === "list"
                        ? "bg-accent text-accent-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 lg:gap-8">
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

            <div className="flex-1 min-w-0">
              {loading && providers.length === 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                      : "space-y-4"
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SearchResultSkeleton key={i} viewMode={viewMode} />
                  ))}
                </div>
              ) : providers.length === 0 ? (
                <div className="text-center py-16 sm:py-32 bg-card/30 rounded-2xl sm:rounded-3xl border-2 border-dashed border-border/50">
                   <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center shadow-inner">
                    <Search className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3 tracking-tight px-4">
                    No matching vendors found
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-sm mx-auto leading-relaxed px-4">
                    We couldn&apos;t find any vendors matching your current filters. Try expanding your search or clearing all filters.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                    <button
                      onClick={clearFilters}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-accent text-accent-foreground rounded-2xl font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, query: "" }))}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border border-border bg-background rounded-2xl font-bold hover:bg-muted transition-all text-sm sm:text-base"
                    >
                      Reset Query
                    </button>
                  </div>
                  
                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50 max-w-lg mx-auto px-4">
                    <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4">Popular Categories</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {categories.slice(0, 6).map(cat => (
                        <button 
                          key={cat.slug}
                          onClick={() => setFilters(prev => ({ ...prev, category: cat.slug }))}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-muted/50 hover:bg-accent/10 hover:text-accent rounded-full text-xs sm:text-sm font-medium transition-colors"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                      : "space-y-3 sm:space-y-4"
                  }>
                    {providers.map((provider) => (
                      <SearchResultCard
                        key={provider.id}
                        provider={provider}
                        viewMode={viewMode}
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

                  <div className={loading ? "pointer-events-none opacity-50 mt-8 sm:mt-12 mb-6 sm:mb-8" : "mt-8 sm:mt-12 mb-6 sm:mb-8"}>
                     <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(totalResults / ITEMS_PER_PAGE)}
                        onPageChange={handlePageChange}
                     />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Back to Top FAB ── */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3.5 bg-accent text-accent-foreground rounded-full shadow-lg shadow-accent/25 transition-all duration-300 hover:scale-110 active:scale-95
          ${showBackToTop
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
