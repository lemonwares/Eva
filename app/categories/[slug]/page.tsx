"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  seoIntro: string | null;
  vendorCount?: number;
  subcategories?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

interface Provider {
  id: string;
  businessName: string;
  description: string | null;
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

// Default images by category
const categoryImages: Record<string, string> = {
  Venues:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&h=600&fit=crop",
  Photographers:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&h=600&fit=crop",
  Photography:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&h=600&fit=crop",
  Caterers:
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&h=600&fit=crop",
  Catering:
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&h=600&fit=crop",
  default:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&h=600&fit=crop",
};

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [vendors, setVendors] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    if (params.slug) {
      fetchCategory();
    }
  }, [params.slug]);

  useEffect(() => {
    if (category) {
      fetchVendors();
    }
  }, [category, pagination.page, selectedSubcategory, verifiedOnly]);

  async function fetchCategory() {
    try {
      const response = await fetch(`/api/categories/${params.slug}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      const data = await response.json();
      setCategory(data);
    } catch (err) {
      console.error("Error fetching category:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchVendors() {
    if (!category) return;

    setVendorsLoading(true);
    try {
      // Use category.slug for filtering, since provider.categories is an array of slugs
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        published: "true",
        category: category.slug,
      });

      if (verifiedOnly) {
        queryParams.append("verified", "true");
      }

      const response = await fetch(`/api/providers?${queryParams.toString()}`);
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

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition"
          >
            <ArrowLeft size={18} />
            Back to Categories
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20">
        <div
          className="relative h-64 md:h-80 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              category.coverImage ||
              categoryImages[category.name] ||
              categoryImages.default
            })`,
          }}
        >
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-background/70 hover:text-background transition mb-4"
              >
                <ArrowLeft size={18} />
                <span>All Categories</span>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-lg text-background/80 max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <p className="text-muted-foreground">
              {vendorsLoading
                ? "Loading..."
                : `${pagination.total} vendors found`}
            </p>

            <div className="flex items-center gap-4">
              {/* Subcategory Filter */}
              {category.subcategories && category.subcategories.length > 0 && (
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">All Services</option>
                  {category.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Verified Filter */}
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border cursor-pointer hover:bg-muted transition">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 text-accent"
                />
                <span>Verified Only</span>
              </label>

              {/* Clear Filters */}
              {(selectedSubcategory || verifiedOnly) && (
                <button
                  onClick={() => {
                    setSelectedSubcategory("");
                    setVerifiedOnly(false);
                  }}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition"
                >
                  <X size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Vendors Loading */}
          {vendorsLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          )}

          {/* Empty State */}
          {!vendorsLoading && vendors.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">
                No vendors found in this category
              </p>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or check back later.
              </p>
              <Link
                href="/vendors"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition"
              >
                Browse All Vendors
              </Link>
            </div>
          )}

          {/* Vendors Grid */}
          {!vendorsLoading && vendors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendors.map((vendor) => (
                <Link
                  key={vendor.id}
                  href={`/vendors/${vendor.id}`}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-muted/50 shadow-lg transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${
                          vendor.coverImage ||
                          vendor.photos[0] ||
                          categoryImages.default
                        })`,
                      }}
                    />

                    {/* Verified Badge */}
                    {vendor.isVerified && (
                      <div className="absolute right-4 top-4 z-10 rounded-full bg-card/90 p-2 shadow">
                        <Award className="h-5 w-5 text-accent" />
                      </div>
                    )}

                    {/* Featured Badge */}
                    {vendor.isFeatured && (
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                        Featured
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-background">
                      <h3 className="font-semibold text-lg leading-tight mb-2">
                        {vendor.businessName}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star
                            className="h-4 w-4 text-accent"
                            fill="currentColor"
                          />
                          <span className="text-sm font-medium">
                            {vendor.averageRating?.toFixed(1) || "New"}
                          </span>
                        </div>
                        <span className="text-xs text-background/70">
                          ({vendor._count?.reviews || vendor.reviewCount || 0}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-3 px-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{vendor.city || "UK"}</span>
                      </div>
                      {vendor.priceFrom && (
                        <span className="text-sm font-medium text-foreground">
                          From {formatCurrency(vendor.priceFrom)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!vendorsLoading && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition"
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
                className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition"
              >
                Next
              </button>
            </div>
          )}

          {/* SEO Content */}
          {category.seoIntro && (
            <div className="mt-16 p-8 rounded-2xl bg-muted/50">
              <h2 className="text-2xl font-bold mb-4">
                About {category.name} Services
              </h2>
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: category.seoIntro }}
              />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
