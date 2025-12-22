"use client";

import {
  MapPin,
  Award,
  ArrowRight,
  Star,
  Sparkles,
  Loader2,
  Heart,
  ExternalLink,
  Share2,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import FavoriteButton from "../common/FavoriteButton";
import ShareButton from "../common/ShareButton";
import { useAuth } from "@/hooks/use-auth";

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
  address: string;
  reviewCount: number;
  city: string | null;
  _count: {
    reviews: number;
  };
}

interface VendorGalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  verified: boolean;
  rating: number;
  reviews: number;
  city: string;
  address: string;
}

// Fallback data when API is unavailable
const fallbackVendors: VendorGalleryItem[] = [
  {
    id: "1",
    title: "Elegant Wedding Venues",
    category: "Venues",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.9,
    reviews: 234,
    city: "London",
    address: "London",
  },
  {
    id: "2",
    title: "Professional Photography",
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=800&fit=crop",
    verified: true,
    rating: 5.0,
    reviews: 189,
    city: "Manchester",
    address: "Manchester",
  },
  {
    id: "3",
    title: "Gourmet Catering Services",
    category: "Catering",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.8,
    reviews: 312,
    city: "Birmingham",
    address: "Birmingham",
  },
  {
    id: "4",
    title: "Live Music & DJs",
    category: "Music & DJs",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.9,
    reviews: 156,
    city: "Leeds",
    address: "Leeds",
  },
  {
    id: "5",
    title: "Floral Arrangements",
    category: "Flowers",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop",
    verified: true,
    rating: 5.0,
    reviews: 278,
    city: "Bristol",
    address: "Bristol",
  },
  {
    id: "6",
    title: "Event Planning",
    category: "Planning",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.7,
    reviews: 445,
    city: "Liverpool",
    address: "liverpool",
  },
  {
    id: "7",
    title: "Cake & Pastry Design",
    category: "Baking",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.9,
    reviews: 201,
    city: "Edinburgh",
    address: "Edinburgh",
  },
  {
    id: "8",
    title: "Decorators & Styling",
    category: "Decorators",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.8,
    reviews: 167,
    city: "Glasgow",
    address: "Glasgow",
  },
];

// Default images by category
const categoryImages: Record<string, string> = {
  Venues:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop",
  Photography:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=800&fit=crop",
  Catering:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop",
  "Music & DJs":
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=800&fit=crop",
  Flowers:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop",
  Planning:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop",
  Baking:
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=800&fit=crop",
  Decorators:
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop",
  default:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop",
};

export default function VendorsSection() {
  const { data: session } = useSession();
  const { user } = useAuth();

  const [vendors, setVendors] = useState<VendorGalleryItem[]>(fallbackVendors);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Toggle favorite for a vendor
  const toggleFavorite = (vendorId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vendorId)) {
        newFavorites.delete(vendorId);
      } else {
        newFavorites.add(vendorId);
      }
      return newFavorites;
    });
  };

  // Share handler for vendor
  const handleShare = (e: React.MouseEvent, vendor: VendorGalleryItem) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/vendors/${vendor.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: vendor.title,
          text: `Check out this vendor: ${vendor.title}`,
          url: shareUrl,
        })
        .catch((err) => {
          // Optionally handle error or fallback
          console.error("Share failed", err);
        });
    } else {
      // Optionally show a fallback modal or copy link
      window.prompt("Copy this link to share:", shareUrl);
    }
  };

  // Update arrow visibility based on scroll position
  const updateArrowVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const scrollThreshold = 10;

    setShowLeftArrow(scrollLeft > scrollThreshold);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - scrollThreshold);
  }, []);

  useEffect(() => {
    async function fetchVendors() {
      try {
        let response = await fetch(
          "/api/providers?featured=true&published=true&limit=8"
        );
        if (!response.ok) throw new Error("Failed to fetch vendors");
        let data = await response.json();

        if (!data.providers || data.providers.length === 0) {
          response = await fetch("/api/providers?published=true&limit=8");
          if (response.ok) data = await response.json();
        }

        if (data.providers && data.providers.length > 0) {
          const mappedVendors: VendorGalleryItem[] = data.providers.map(
            (provider: Provider) => ({
              id: provider.id,
              title: provider.businessName,
              category: provider.categories[0] || "Services",
              image:
                provider.coverImage ||
                provider.photos[0] ||
                categoryImages[provider.categories[0]] ||
                categoryImages.default,
              verified: provider.isVerified,
              rating: provider.averageRating || 0,
              reviews: provider._count?.reviews || provider.reviewCount || 0,
              city: provider.city || "UK",
              address: provider.address || provider.city || "UK",
            })
          );
          setVendors(mappedVendors);
          setIsUsingFallback(false);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVendors();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateArrowVisibility();
    const timer = setTimeout(updateArrowVisibility, 100);

    container.addEventListener("scroll", updateArrowVisibility);
    window.addEventListener("resize", updateArrowVisibility);

    return () => {
      clearTimeout(timer);
      container.removeEventListener("scroll", updateArrowVisibility);
      window.removeEventListener("resize", updateArrowVisibility);
    };
  }, [vendors, isLoading, updateArrowVisibility]);

  const scrollContainer = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const formatCategories = (cats?: string) => {
    const str = (cats ?? "").trim();
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <>
      <section
        id="vendors"
        className="relative w-full overflow-hidden bg-linear-to-b from-background via-background to-secondary/20 px-4 py-24"
      >
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-16 text-center flex flex-col items-center justify-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-6 py-2.5 shadow-sm backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-accent/10">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Featured Vendors
              </span>
            </div>

            <h2 className="text-balance text-4xl font-bold text-foreground sm:text-5xl mb-4 leading-tight">
              Trusted by couples, organisers,
              <br />
              <span className="text-accent">and venues alike</span>
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Browse our curated collection of verified vendors across different
              categories
            </p>
          </div>

          {/* Loading State with Skeleton */}
          {isLoading && (
            <div className="flex gap-6 overflow-hidden pb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="shrink-0 w-[320px] animate-pulse">
                  <div className="relative mb-4 aspect-4/3 overflow-hidden rounded-2xl bg-muted/50"></div>
                  <div className="px-1 space-y-3">
                    <div className="h-5 bg-muted/50 rounded w-3/4"></div>
                    <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                    <div className="h-4 bg-muted/50 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Horizontal Scrollable Gallery */}
          {!isLoading && (
            <div className="relative group">
              {/* Left Navigation Arrow */}
              {showLeftArrow && (
                <button
                  onClick={() => scrollContainer("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-border/20 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                  aria-label="Previous vendors"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
              )}

              {/* Right Navigation Arrow */}
              {showRightArrow && (
                <button
                  onClick={() => scrollContainer("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-border/20 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                  aria-label="Next vendors"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}

              {/* Scrollable Container with drag support */}
              <div className="max-w-7xl mx-auto">
                <div
                  ref={scrollContainerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseUpOrLeave}
                  onMouseUp={handleMouseUpOrLeave}
                >
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="relative group">
                      {/* Action Buttons (not inside Link) */}
                      <div className="flex gap-2 items-center absolute top-4 right-4 z-20 rounded-full p-2">
                        {user && (
                          <FavoriteButton
                            providerId={vendor.id}
                            initialFavorited={favorites.has(vendor.id)}
                            variant="outline"
                            className="text-accent"
                            onToggle={(isFav) => toggleFavorite(vendor.id)}
                          />
                        )}
                        <ShareButton
                          url={`${
                            typeof window !== "undefined"
                              ? window.location.origin
                              : ""
                          }/vendors/${vendor.id}`}
                          title={vendor.title}
                          description={`Check out this vendor: ${vendor.title}`}
                          variant="ghost"
                          className="text-white hover:text-accent transition-colors duration-300 ease-in-out"
                        />
                      </div>
                      <Link
                        href={
                          isUsingFallback ? "/vendors" : `/vendors/${vendor.id}`
                        }
                        className="group"
                        tabIndex={0}
                        aria-label={`View details for ${vendor.title}`}
                      >
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-muted/50 shadow-lg transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                            style={{
                              backgroundImage: `url(${vendor.image})`,
                            }}
                          />
                          {/* Verified Badge */}
                          {vendor.verified && (
                            <div className="absolute left-4 top-4 z-10 rounded-full bg-card/90 p-2 shadow">
                              <Award className="h-5 w-5 text-accent" />
                            </div>
                          )}
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent" />
                          {/* Content */}
                          <div className="absolute inset-x-0 bottom-0 p-4 text-background">
                            <p className="text-xs font-medium text-background/70 mb-1">
                              {formatCategories(vendor.category) || "Services"}
                            </p>
                            <h3 className="font-semibold text-lg leading-tight mb-2">
                              {vendor.title}
                            </h3>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Star
                                  className="h-4 w-4 text-accent"
                                  fill="currentColor"
                                />
                                <span className="text-sm font-medium">
                                  {typeof vendor.rating === "number" &&
                                  !isNaN(vendor.rating)
                                    ? vendor.rating.toFixed(1)
                                    : "New"}
                                </span>
                              </div>
                              <span className="text-xs text-background/70">
                                ({vendor.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {/* Card Footer */}
                      <div className="mt-3 px-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{vendor.city || "UK"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced CTA Button */}
          <div className="text-center mt-16 flex flex-col items-center gap-4">
            <Link
              href="/vendors"
              className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-accent to-accent/90 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/40 hover:scale-105"
            >
              Explore all vendors
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover {vendors.length}+ verified professionals ready to bring
              your vision to life
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
