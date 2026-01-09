"use client";

import { Star, Filter, X } from "lucide-react";

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

      {/* Mobile Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-background rounded-t-2xl p-4 overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-foreground">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <FilterContent />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                   clearFilters();
                   setShowFilters(false);
                }}
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
    </>
  );
}
