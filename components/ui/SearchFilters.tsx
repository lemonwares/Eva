"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Filter, X, Navigation, Radar, MapPinOff } from "lucide-react";

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

interface SearchFiltersProps {
  filters: {
    category: string;
    city: string;
    minPrice: string;
    maxPrice: string;
    minRating: string;
    lat: string;
    lng: string;
    radius: string;
  };
  categories: Category[];
  cities: City[];
  setFilters: (filters: any) => void;
  clearFilters: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  hasActiveFilters: boolean;
  className?: string;
}

export default function SearchFilters({
  filters,
  categories,
  cities,
  setFilters,
  clearFilters,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  className = "",
}: SearchFiltersProps) {
  const [isClosing, setIsClosing] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Count active filters for badge
  const activeFilterCount = [
    filters.category,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.radius !== "5" ? filters.radius : "",
  ].filter(Boolean).length;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
      setIsClosing(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  // Smooth close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowFilters(false);
      setIsClosing(false);
    }, 250);
  };

  const FilterContent = () => (
    <div className="space-y-5 sm:space-y-6">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              category: e.target.value,
            }))
          }
          className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-xl sm:rounded-lg bg-background text-foreground text-sm appearance-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Location
        </label>
        <select
          value={filters.city}
          onChange={(e) =>
            setFilters((prev: any) => ({ ...prev, city: e.target.value }))
          }
          className="w-full px-3 py-2.5 sm:py-2 border border-border rounded-xl sm:rounded-lg bg-background text-foreground text-sm appearance-none"
        >
          <option value="">All Locations</option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Geolocation & Radius */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Radar className="w-4 h-4" />
          Distance Radius
        </label>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setFilters((prev: any) => ({ ...prev, lat: "loading", lng: "loading" }));
            }}
            disabled={filters.lat === "loading"}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent/10 text-accent border border-accent/20 rounded-xl text-sm font-medium hover:bg-accent/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${filters.lat === "loading" ? "animate-pulse" : ""}`} />
            {filters.lat === "loading" ? "Locating..." : "Use my location"}
          </button>

          {filters.lat && filters.lat !== "loading" && (
            <div className="space-y-2.5 p-3 bg-accent/5 rounded-xl border border-accent/10">
              <div className="flex items-center justify-between">
                <div className="flex justify-between text-xs text-muted-foreground flex-1">
                  <span>Radius</span>
                  <span className="font-semibold text-foreground">{filters.radius} mi</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev: any) => ({ ...prev, lat: "", lng: "", radius: "5" }))
                  }
                  className="ml-3 p-1 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                  title="Clear location"
                >
                  <MapPinOff className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={filters.radius}
                onChange={(e) =>
                  setFilters((prev: any) => ({
                    ...prev,
                    radius: e.target.value,
                  }))
                }
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <p className="text-[10px] text-muted-foreground">
                Searching within {filters.radius} miles of your location
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev: any) => ({
                  ...prev,
                  minPrice: e.target.value,
                }))
              }
              className="w-full pl-7 pr-2 py-2.5 sm:py-2 border border-border rounded-xl sm:rounded-lg bg-background text-foreground text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <span className="text-muted-foreground text-xs font-medium">to</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev: any) => ({
                  ...prev,
                  maxPrice: e.target.value,
                }))
              }
              className="w-full pl-7 pr-2 py-2.5 sm:py-2 border border-border rounded-xl sm:rounded-lg bg-background text-foreground text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Minimum Rating
          {filters.minRating && (
            <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">(tap again to clear)</span>
          )}
        </label>
        <div className="flex gap-2 flex-wrap">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setFilters((prev: any) => ({
                  ...prev,
                  minRating:
                    prev.minRating === rating.toString()
                      ? ""
                      : rating.toString(),
                }))
              }
              className={`flex items-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-lg border text-sm font-medium transition-all active:scale-95 ${
                filters.minRating === rating.toString()
                  ? "border-accent bg-accent/10 text-accent shadow-sm shadow-accent/10"
                  : "border-border hover:border-accent/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              {rating}+
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`w-72 shrink-0 ${className}`}>
        <div className="sticky top-28 p-4 border border-border rounded-xl bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-accent text-accent-foreground rounded-full leading-none">
                  {activeFilterCount}
                </span>
              )}
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
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {(showFilters || isClosing) && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-foreground/30 backdrop-blur-sm transition-opacity duration-250 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleClose}
          />
          
          {/* Drawer */}
          <div
            ref={drawerRef}
            className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background shadow-2xl flex flex-col transition-transform duration-250 ease-out ${
              isClosing ? "translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent text-accent-foreground rounded-full leading-none">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Refine your search results</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-full transition-colors border border-border"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            
            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 themed-scrollbar">
              <FilterContent />
            </div>

            {/* Footer with safe-area */}
            <div className="px-5 py-4 border-t border-border grid grid-cols-2 gap-3 bg-card safe-area-bottom">
              <button
                onClick={() => {
                   clearFilters();
                   handleClose();
                }}
                className="py-2.5 px-4 border border-border rounded-xl font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all"
              >
                Reset All
              </button>
              <button
                onClick={handleClose}
                className="py-2.5 px-4 bg-accent text-accent-foreground rounded-xl font-semibold shadow-lg shadow-accent/20 active:scale-[0.98] transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
