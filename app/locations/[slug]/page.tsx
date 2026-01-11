"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import {
  ArrowLeft,
  MapPin,
  Award,
  Star,
  Filter,
  ChevronDown,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import VendorCard from "@/components/vendors/VendorCard";

interface City {
  id: string;
  name: string;
  slug: string;
  county: string | null;
  region: string | null;
  country: string;
  metaTitle: string | null;
  metaDescription: string | null;
  seoIntro: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Provider {
  id: string;
  businessName: string;
  description: string | null;
  address: string | null;
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
}

export default function CityDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [city, setCity] = useState<City | null>(null);
  const [vendors, setVendors] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    if (params.slug) {
      fetchCity();
      fetchCategories();
    }
  }, [params.slug]);

  useEffect(() => {
    if (city) {
      fetchVendors();
    }
  }, [city, pagination.page, selectedCategory, verifiedOnly, sortBy]);

  async function fetchCity() {
    try {
      const response = await fetch(`/api/cities/${params.slug}`);
      if (!response.ok) throw new Error("Failed to fetch city");
      const data = await response.json();
      setCity(data);
    } catch (err) {
      console.error("Error fetching city:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  async function fetchVendors() {
    if (!city) return;

    setVendorsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: sortBy,
      });

      if (selectedCategory) {
        queryParams.append("categoryId", selectedCategory);
      }

      if (verifiedOnly) {
        queryParams.append("verified", "true");
      }

      const response = await fetch(`/api/cities/${city.slug}/providers?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch vendors");

      const data = await response.json();
      setVendors(data.providers || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      setVendorsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Location Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The location you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition"
          >
            <ArrowLeft size={18} />
            Browse All Vendors
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-linear-to-b from-slate-50 to-white dark:from-gray-900 dark:to-background border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link
                href="/vendors"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition group"
              >
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                <span>Back to Explore</span>
              </Link>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                <MapPin size={12} />
                <span>Local Experts</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Event Vendors in <span className="text-accent">{city.name}</span>
              </h1>
              
              {city.region && (
                <p className="text-lg text-muted-foreground">
                  Discover the finest professionals across {city.region}, {city.country}
                </p>
              )}
            </div>
            
            <div className="hidden lg:block">
               <div className="flex items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-border">
                 <div className="h-10 w-10 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                   <Sparkles size={20} />
                 </div>
                 <div className="pr-4">
                   <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Verified Local Pros</p>
                   <p className="font-bold">{pagination.total}+ Vendors</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6 border-b border-border/50">
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="relative min-w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted/50 transition focus:outline-none focus:ring-2 focus:ring-accent/50 pr-10"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>

              {/* Verified Filter */}
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border transition ${
                  verifiedOnly 
                    ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/20" 
                    : "bg-background border-border hover:bg-muted text-foreground"
                }`}
              >
                <Award size={18} className={verifiedOnly ? "animate-pulse" : ""} />
                <span className="font-medium">Verified Only</span>
              </button>

              {/* Sort Filter */}
              <div className="relative min-w-40">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted/50 transition focus:outline-none focus:ring-2 focus:ring-accent/50 pr-10"
                >
                  <option value="featured">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>

              {/* Clear Filters */}
              {(selectedCategory || verifiedOnly || sortBy !== "featured") && (
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setVerifiedOnly(false);
                    setSortBy("featured");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <X size={16} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="text-sm font-medium text-muted-foreground">
              {vendorsLoading 
                ? "Searching..." 
                : <span>Showing <span className="text-foreground">{vendors.length}</span> of <span className="text-foreground">{pagination.total}</span> professionals</span>
              }
            </div>
          </div>

          {/* Vendors Loading State */}
          {vendorsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="space-y-4 animate-pulse">
                  <div className="aspect-square bg-muted rounded-2xl" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!vendorsLoading && vendors.length === 0 && (
            <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border/100">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-6">
                <MapPin size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No results found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn't find any vendors matching your criteria in {city.name}. 
                Try broadening your search or checking nearby cities.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setVerifiedOnly(false);
                }}
                className="px-8 py-3 rounded-full bg-foreground text-background hover:opacity-90 transition font-bold"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Vendors Grid */}
          {!vendorsLoading && vendors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!vendorsLoading && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <button
                onClick={() => {
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={pagination.page === 1}
                className="px-6 py-3 rounded-xl border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition font-medium"
              >
                Previous
              </button>
              <span className="font-bold text-lg">
                <span className="text-accent">{pagination.page}</span> / {pagination.pages}
              </span>
              <button
                onClick={() => {
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={pagination.page === pagination.pages}
                className="px-6 py-3 rounded-xl border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition font-medium"
              >
                Next
              </button>
            </div>
          )}

          {/* SEO Content Section */}
          {city.seoIntro && (
            <div className="mt-24 p-8 md:p-12 rounded-3xl bg-linear-to-br from-slate-50 to-white dark:from-gray-900 dark:to-background border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Planning an event in {city.name}?</h2>
              <div 
                className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: city.seoIntro }}
              />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
