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
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

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
  },
  {
    id: "8",
    title: "Decoration & Styling",
    category: "Decoration",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.8,
    reviews: 167,
    city: "Glasgow",
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
  Decoration:
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop",
  default:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop",
};

export default function VendorsSection() {
  const [vendors, setVendors] = useState<VendorGalleryItem[]>(fallbackVendors);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const toggleFavorite = (e: React.MouseEvent, vendorId: string) => {
    e.preventDefault();
    e.stopPropagation();
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

  const formatCategories = (cats?: string) => {
    const str = (cats ?? "").trim();
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
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
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={`flex gap-6 overflow-x-auto pb-6 scroll-smooth ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {vendors.map((vendor, index) => (
                <Link
                  key={vendor.id}
                  href={isUsingFallback ? "/vendors" : `/vendors/${vendor.id}`}
                  className="group/card shrink-0 w-[320px] animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative mb-4 aspect-4/3 overflow-hidden rounded-2xl bg-muted/50 shadow-md transition-all duration-500 group-hover/card:shadow-2xl group-hover/card:-translate-y-2 border border-transparent group-hover/card:border-accent/20">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover/card:scale-110"
                      style={{ backgroundImage: `url(${vendor.image})` }}
                    />

                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Verified Badge with animation */}
                    {vendor.verified && (
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                        <Award className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs font-semibold text-foreground">
                          Verified
                        </span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, vendor.id)}
                      className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`h-4.5 w-4.5 transition-all duration-300 ${
                          favorites.has(vendor.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 hover:text-red-500"
                        }`}
                      />
                    </button>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-accent/0 group-hover/card:bg-accent/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/card:opacity-100">
                      <div className="flex items-center gap-2 text-white font-semibold text-sm bg-accent/90 px-4 py-2 rounded-full backdrop-blur-sm transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300">
                        View Profile
                        <ExternalLink className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Card Info */}
                  <div className="px-1 space-y-2.5">
                    <h4 className="text-lg font-bold text-foreground transition-colors duration-300 group-hover/card:text-accent line-clamp-1">
                      {vendor.title}
                    </h4>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-medium">{vendor.city}</span>
                      </div>

                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                        {formatCategories(vendor.category)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full">
                        <Star
                          className="h-3.5 w-3.5 text-amber-500"
                          fill="currentColor"
                        />
                        <span className="text-sm font-bold text-foreground">
                          {vendor.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {vendor.reviews}{" "}
                        {vendor.reviews === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
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
  );
}
// "use client";

// import {
//   MapPin,
//   Award,
//   ArrowRight,
//   Star,
//   Sparkles,
//   Loader2,
// } from "lucide-react";
// import { useState, useEffect, useRef, useCallback } from "react";
// import Link from "next/link";

// interface Provider {
//   id: string;
//   businessName: string;
//   description: string | null;
//   categories: string[];
//   coverImage: string | null;
//   photos: string[];
//   isVerified: boolean;
//   isFeatured: boolean;
//   averageRating: number | null;
//   reviewCount: number;
//   city: string | null;
//   _count: {
//     reviews: number;
//   };
// }

// interface VendorGalleryItem {
//   id: string;
//   title: string;
//   category: string;
//   image: string;
//   verified: boolean;
//   rating: number;
//   reviews: number;
//   city: string;
// }

// // Fallback data when API is unavailable
// const fallbackVendors: VendorGalleryItem[] = [
//   {
//     id: "1",
//     title: "Elegant Wedding Venues",
//     category: "Venues",
//     image:
//       "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop",
//     verified: true,
//     rating: 4.9,
//     reviews: 234,
//     city: "London",
//   },
//   {
//     id: "2",
//     title: "Professional Photography",
//     category: "Photography",
//     image:
//       "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=800&fit=crop",
//     verified: true,
//     rating: 5.0,
//     reviews: 189,
//     city: "Manchester",
//   },
//   {
//     id: "3",
//     title: "Gourmet Catering Services",
//     category: "Catering",
//     image:
//       "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop",
//     verified: true,
//     rating: 4.8,
//     reviews: 312,
//     city: "Birmingham",
//   },
//   {
//     id: "4",
//     title: "Live Music & DJs",
//     category: "Music & DJs",
//     image:
//       "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=800&fit=crop",
//     verified: true,
//     rating: 4.9,
//     reviews: 156,
//     city: "Leeds",
//   },
//   {
//     id: "5",
//     title: "Floral Arrangements",
//     category: "Flowers",
//     image:
//       "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop",
//     verified: true,
//     rating: 5.0,
//     reviews: 278,
//     city: "Bristol",
//   },
//   {
//     id: "6",
//     title: "Event Planning",
//     category: "Planning",
//     image:
//       "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop",
//     verified: true,
//     rating: 4.7,
//     reviews: 445,
//     city: "Liverpool",
//   },
//   {
//     id: "7",
//     title: "Cake & Pastry Design",
//     category: "Baking",
//     image:
//       "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=800&fit=crop",
//     verified: true,
//     rating: 4.9,
//     reviews: 201,
//     city: "Edinburgh",
//   },
//   {
//     id: "8",
//     title: "Decoration & Styling",
//     category: "Decoration",
//     image:
//       "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop",
//     verified: true,
//     rating: 4.8,
//     reviews: 167,
//     city: "Glasgow",
//   },
// ];

// // Default images by category
// const categoryImages: Record<string, string> = {
//   Venues:
//     "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop",
//   Photography:
//     "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=800&fit=crop",
//   Catering:
//     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop",
//   "Music & DJs":
//     "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=800&fit=crop",
//   Flowers:
//     "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop",
//   Planning:
//     "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop",
//   Baking:
//     "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=800&fit=crop",
//   Decoration:
//     "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop",
//   default:
//     "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop",
// };

// export default function VendorsSection() {
//   const [vendors, setVendors] = useState<VendorGalleryItem[]>(fallbackVendors);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUsingFallback, setIsUsingFallback] = useState(true);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(false);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   // Update arrow visibility based on scroll position
//   const updateArrowVisibility = useCallback(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const { scrollLeft, scrollWidth, clientWidth } = container;
//     const scrollThreshold = 10;

//     setShowLeftArrow(scrollLeft > scrollThreshold);
//     setShowRightArrow(scrollLeft < scrollWidth - clientWidth - scrollThreshold);
//   }, []);

//   useEffect(() => {
//     async function fetchVendors() {
//       try {
//         // First try featured providers
//         let response = await fetch(
//           "/api/providers?featured=true&published=true&limit=8"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch vendors");
//         }
//         let data = await response.json();

//         // If no featured providers, try getting any published providers
//         if (!data.providers || data.providers.length === 0) {
//           response = await fetch("/api/providers?published=true&limit=8");
//           if (response.ok) {
//             data = await response.json();
//           }
//         }

//         if (data.providers && data.providers.length > 0) {
//           const mappedVendors: VendorGalleryItem[] = data.providers.map(
//             (provider: Provider) => ({
//               id: provider.id,
//               title: provider.businessName,
//               category: provider.categories[0] || "Services",
//               image:
//                 provider.coverImage ||
//                 provider.photos[0] ||
//                 categoryImages[provider.categories[0]] ||
//                 categoryImages.default,
//               verified: provider.isVerified,
//               rating: provider.averageRating || 0,
//               reviews: provider._count?.reviews || provider.reviewCount || 0,
//               city: provider.city || "UK",
//             })
//           );
//           setVendors(mappedVendors);
//           setIsUsingFallback(false);
//         }
//       } catch (err) {
//         console.error("Error fetching vendors:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchVendors();
//   }, []);

//   // Set up scroll and resize listeners
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     // Initial check
//     updateArrowVisibility();

//     // Delayed check to ensure content is rendered
//     const timer = setTimeout(updateArrowVisibility, 100);

//     // Add event listeners
//     container.addEventListener("scroll", updateArrowVisibility);
//     window.addEventListener("resize", updateArrowVisibility);

//     return () => {
//       clearTimeout(timer);
//       container.removeEventListener("scroll", updateArrowVisibility);
//       window.removeEventListener("resize", updateArrowVisibility);
//     };
//   }, [vendors, isLoading, updateArrowVisibility]);

//   const scrollContainer = (direction: "left" | "right") => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       const scrollAmount = direction === "left" ? -400 : 400;
//       container.scrollBy({ left: scrollAmount, behavior: "smooth" });
//     }
//   };

//   const formatCategories = (cats?: string) => {
//     const str = (cats ?? "").trim();

//     if (!str) return ""; // avoid null/undefined

//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   };

//   return (
//     <section
//       id="vendors"
//       className="relative w-full overflow-hidden bg-background px-4 py-20"
//     >
//       {/* Decorative elements */}
//       <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl"></div>
//       <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>

//       <div className="relative max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-20 text-center flex flex-col items-center justify-center">
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2 shadow-sm backdrop-blur-sm">
//             <Sparkles className="w-4 h-4 text-accent" />
//             <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//               FEATURED VENDORS
//             </span>
//           </div>

//           <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl mb-3">
//             Trusted by couples, organisers, and venues alike
//           </h2>
//           <p className="max-w-2xl text-base text-muted-foreground">
//             Browse our curated collection of verified vendors across different
//             categories
//           </p>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="flex justify-center items-center py-20">
//             <Loader2 className="h-8 w-8 animate-spin text-accent" />
//           </div>
//         )}

//         {/* Horizontal Scrollable Gallery */}
//         {!isLoading && (
//           <div className="relative">
//             {/* Left Navigation Arrow */}
//             {showLeftArrow && (
//               <button
//                 onClick={() => scrollContainer("left")}
//                 className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-border/20 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200 hover:scale-110"
//                 aria-label="Previous"
//               >
//                 <ArrowRight className="h-5 w-5 rotate-180" />
//               </button>
//             )}

//             {/* Right Navigation Arrow */}
//             {showRightArrow && (
//               <button
//                 onClick={() => scrollContainer("right")}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-border/20 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200 hover:scale-110"
//                 aria-label="Next"
//               >
//                 <ArrowRight className="h-5 w-5" />
//               </button>
//             )}

//             {/* Scrollable Container */}
//             <div
//               ref={scrollContainerRef}
//               className="flex gap-6 overflow-x-auto pb-6 scroll-smooth"
//               style={{
//                 scrollbarWidth: "none",
//                 msOverflowStyle: "none",
//               }}
//             >
//               <style jsx>{`
//                 div::-webkit-scrollbar {
//                   display: none;
//                 }
//               `}</style>

//               {vendors.map((vendor) => (
//                 <Link
//                   key={vendor.id}
//                   href={isUsingFallback ? "/vendors" : `/vendors/${vendor.id}`}
//                   className="group shrink-0 w-[320px]"
//                 >
//                   {/* Image Container */}
//                   <div className="relative mb-4 aspect-4/3 overflow-hidden rounded-2xl bg-muted/50 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
//                     <div
//                       className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
//                       style={{ backgroundImage: `url(${vendor.image})` }}
//                     />

//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />

//                     {/* Verified Badge */}
//                     {vendor.verified && (
//                       <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
//                         <Award className="h-4 w-4 text-accent inline-block" />
//                       </div>
//                     )}
//                   </div>

//                   {/* Card Info */}
//                   <div className="px-1">
//                     <h4 className="mb-2 text-lg font-bold text-foreground transition group-hover:text-accent line-clamp-1">
//                       {vendor.title}
//                     </h4>

//                     <div className="flex items-center justify-between mb-1">
//                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                         <MapPin className="h-3.5 w-3.5" />
//                         <span className="font-medium">{vendor.city}</span>
//                       </div>
//                     </div>

//                     <div className="text-sm text-muted-foreground mb-2">
//                       {formatCategories(vendor.category)}
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-1">
//                         <Star
//                           className="h-4 w-4 text-amber-400"
//                           fill="currentColor"
//                         />
//                         <span className="text-sm font-bold text-foreground">
//                           {vendor.rating.toFixed(1)}
//                         </span>
//                       </div>
//                       <span className="text-sm text-muted-foreground">
//                         ({vendor.reviews})
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* CTA Button */}
//         <div className="text-center mt-12">
//           <Link
//             href="/vendors"
//             className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-lg hover:bg-accent hover:text-white"
//           >
//             Explore all vendors
//             <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }
