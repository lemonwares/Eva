"use client";

import { Star, Filter, X, Navigation, Radar } from "lucide-react";

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
  className?: string; // To handle responsive visibility classes
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
  
  const FilterContent = () => (
    <div className="space-y-6">
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
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Location
        </label>
        <select
          value={filters.city}
          onChange={(e) =>
            setFilters((prev: any) => ({ ...prev, city: e.target.value }))
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

      {/* Geolocation & Radius */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Radar className="w-4 h-4" />
          Distance Radius
        </label>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              // Trigger geolocation logic in parent
              setFilters((prev: any) => ({ ...prev, lat: "loading", lng: "loading" }));
            }}
            disabled={filters.lat === "loading"}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-xl text-sm font-medium hover:bg-accent/20 transition disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${filters.lat === "loading" ? "animate-pulse" : ""}`} />
            {filters.lat === "loading" ? "Locating..." : "Use my location"}
          </button>

          {filters.lat && filters.lat !== "loading" && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Radius</span>
                <span className="font-medium text-foreground">{filters.radius} miles</span>
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
              <p className="text-[10px] text-muted-foreground italic">
                * Searching within {filters.radius} miles of your location
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
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev: any) => ({
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
              setFilters((prev: any) => ({
                ...prev,
                maxPrice: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Minimum Rating
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

      {/* Mobile Sidebar (Drawer) */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Drawer Content */}
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="font-semibold text-xl text-foreground">Filters</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Refine your search results</p>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2.5 hover:bg-muted rounded-full transition-colors border border-border"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            
            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6">
              <FilterContent />
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-border grid grid-cols-2 gap-3 bg-card">
              <button
                onClick={() => {
                   clearFilters();
                   setShowFilters(false);
                }}
                className="py-3 px-4 border border-border rounded-xl font-medium text-foreground hover:bg-muted transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="py-3 px-4 bg-accent text-accent-foreground rounded-xl font-semibold shadow-lg shadow-accent/20 active:scale-[0.98] transition-all"
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
