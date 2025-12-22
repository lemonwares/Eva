"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Award,
  Star,
  Filter,
  ChevronDown,
  Loader2,
  ArrowLeft,
  X,
  Heart,
  Share2,
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { formatCurrency } from "@/lib/formatters";
import FavoriteButton from "@/components/common/FavoriteButton";
import ShareButton from "@/components/common/ShareButton";

interface Provider {
  id: string;
  businessName: string;
  address: string | null;
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

const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max - 3) + "..." : str;

const formatCategories = (cats?: string) => {
  const str = (cats ?? "").trim();
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function VendorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </div>
      }
    >
      <VendorsPageContent />
    </Suspense>
  );
}

function VendorsPageContent() {
  const searchParams = useSearchParams();
  const [vendors, setVendors] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [locationQuery, setLocationQuery] = useState(
    searchParams.get("location") || ""
  );
  const [ceremonyType, setCeremonyType] = useState(
    searchParams.get("ceremony") || ""
  );
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  // Update state when URL params change
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setLocationQuery(searchParams.get("location") || "");
    setCeremonyType(searchParams.get("ceremony") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchVendors();
  }, [
    pagination.page,
    selectedCategory,
    verifiedOnly,
    searchQuery,
    locationQuery,
    ceremonyType,
  ]);

  async function fetchVendors() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        published: "true",
      });

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      if (verifiedOnly) {
        params.append("verified", "true");
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (locationQuery) {
        params.append("location", locationQuery);
      }
      if (ceremonyType) {
        params.append("ceremony", ceremonyType);
      }

      const response = await fetch(`/api/providers?${params.toString()}`);
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
      setIsLoading(false);
    }
  }

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    verifiedOnly ||
    locationQuery ||
    ceremonyType;

  const categories = [
    "Venues",
    "Photography",
    "Catering",
    "Music & DJs",
    "Flowers",
    "Planning",
    "Baking",
    "Decoration",
    "Makeup",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-foreground via-foreground/95 to-foreground/90 px-4 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-background/70 transition hover:text-background mb-6"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Back to Home</span>
          </Link>

          <h1 className="mb-4 bg-linear-to-r from-background via-background to-background/80 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Find Your Perfect Vendor
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-background/70">
            Browse our curated collection of verified vendors across different
            categories. Find the perfect match for your event.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vendors by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-background py-4 pl-12 pr-4 text-foreground shadow-lg ring-1 ring-black/5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-full bg-background/20 px-6 py-4 text-background backdrop-blur-sm transition hover:bg-background/30"
            >
              <Filter size={18} />
              Filters
              <ChevronDown
                size={16}
                className={`transition ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 rounded-2xl bg-background/10 p-6 backdrop-blur-sm">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="mb-2 block text-sm text-background/70">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-background px-4 py-2">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="h-4 w-4 text-accent"
                    />
                    <span className="text-foreground">Verified Only</span>
                  </label>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setLocationQuery("");
                      setCeremonyType("");
                      setVerifiedOnly(false);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-background/20 px-4 py-2 text-background transition hover:bg-background/30"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Vendors Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${pagination.total} vendors found`}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && vendors.length === 0 && (
            <div className="py-20 text-center">
              <p className="mb-4 text-xl text-muted-foreground">
                No vendors found
              </p>
              <p className="mb-6 text-muted-foreground">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setLocationQuery("");
                  setCeremonyType("");
                  setVerifiedOnly(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-accent-foreground transition hover:opacity-90"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Vendors Grid */}
          {!isLoading && vendors.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="group relative">
                  <Link href={`/vendors/${vendor.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-muted/50 shadow-lg transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${
                            vendor.coverImage ||
                            vendor.photos[0] ||
                            categoryImages[vendor.categories[0]] ||
                            categoryImages.default
                          })`,
                        }}
                      />

                      {/* Action Buttons - Top Right */}
                      <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <div onClick={(e) => e.preventDefault()}>
                          <FavoriteButton
                            providerId={vendor.id}
                            variant="outline"
                            className="bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                          />
                        </div>
                        <div onClick={(e) => e.preventDefault()}>
                          <ShareButton
                            url={`${
                              typeof window !== "undefined"
                                ? window.location.origin
                                : ""
                            }/vendors/${vendor.id}`}
                            title={vendor.businessName}
                            description={
                              vendor.description ||
                              `Check out ${vendor.businessName} on EVA`
                            }
                            variant="outline"
                            className="bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                          />
                        </div>
                      </div>

                      {/* Verified Badge */}
                      {vendor.isVerified && (
                        <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
                          <Award className="h-5 w-5 text-accent" />
                        </div>
                      )}

                      {/* Featured Badge */}
                      {vendor.isFeatured && (
                        <div className="absolute left-3 top-14 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-md">
                          Featured
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/40 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-x-0 bottom-0 p-4 text-background">
                        <p className="mb-1 text-xs font-medium text-background/70">
                          {formatCategories(vendor.categories[0]) || "Services"}
                        </p>
                        <h3 className="mb-2 text-lg font-semibold leading-tight">
                          {vendor.businessName}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star
                              className="h-4 w-4 text-amber-400"
                              fill="currentColor"
                            />
                            <span className="text-sm font-medium">
                              {vendor.averageRating && vendor.averageRating > 0
                                ? vendor.averageRating.toFixed(1)
                                : "New"}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({vendor.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Card Footer */}
                  <div className="mt-3 px-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>
                          {truncate(
                            vendor.address && vendor.city
                              ? `${vendor.address}, ${vendor.city}`
                              : vendor.city || "UK",
                            25
                          )}
                        </span>
                      </div>
                      {vendor.priceFrom && (
                        <span className="text-sm font-medium text-foreground">
                          From {formatCurrency(vendor.priceFrom || 0)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && pagination.pages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="rounded-lg border border-border px-4 py-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-lg border border-border px-4 py-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import {
//   Search,
//   MapPin,
//   Award,
//   Star,
//   Filter,
//   ChevronDown,
//   Loader2,
//   ArrowLeft,
//   X,
// } from "lucide-react";
// import Header from "@/components/common/Header";
// import Footer from "@/components/common/Footer";
// import { formatCurrency } from "@/lib/formatters";
// import FavoriteButton from "@/components/common/FavoriteButton";
// import ShareButton from "@/components/common/ShareButton";
// interface Provider {
//   id: string;
//   businessName: string;
//   address: string | null;
//   description: string | null;
//   categories: string[];
//   coverImage: string | null;
//   photos: string[];
//   isVerified: boolean;
//   isFeatured: boolean;
//   averageRating: number | null;
//   reviewCount: number;
//   city: string | null;
//   priceFrom: number | null;
//   _count: {
//     reviews: number;
//   };
// }

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

// const truncate = (str: string, max: number) =>
//   str.length > max ? str.slice(0, max - 3) + "..." : str;

// const formatCategories = (cats?: string) => {
//   const str = (cats ?? "").trim();

//   if (!str) return ""; // avoid null/undefined

//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// };

// export default function VendorsPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-background">
//           <Header />
//           <div className="flex items-center justify-center py-20">
//             <Loader2 className="h-8 w-8 animate-spin text-accent" />
//           </div>
//         </div>
//       }
//     >
//       <VendorsPageContent />
//     </Suspense>
//   );
// }

// function VendorsPageContent() {
//   const searchParams = useSearchParams();
//   const [vendors, setVendors] = useState<Provider[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState(
//     searchParams.get("search") || ""
//   );
//   const [selectedCategory, setSelectedCategory] = useState<string>(
//     searchParams.get("category") || ""
//   );
//   const [locationQuery, setLocationQuery] = useState(
//     searchParams.get("location") || ""
//   );
//   const [ceremonyType, setCeremonyType] = useState(
//     searchParams.get("ceremony") || ""
//   );
//   const [verifiedOnly, setVerifiedOnly] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 12,
//     total: 0,
//     pages: 1,
//   });

//   // Update state when URL params change
//   useEffect(() => {
//     setSearchQuery(searchParams.get("search") || "");
//     setLocationQuery(searchParams.get("location") || "");
//     setCeremonyType(searchParams.get("ceremony") || "");
//   }, [searchParams]);

//   useEffect(() => {
//     fetchVendors();
//   }, [
//     pagination.page,
//     selectedCategory,
//     verifiedOnly,
//     searchQuery,
//     locationQuery,
//     ceremonyType,
//   ]);

//   async function fetchVendors() {
//     setIsLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: pagination.page.toString(),
//         limit: pagination.limit.toString(),
//         published: "true",
//       });

//       if (selectedCategory) {
//         params.append("category", selectedCategory);
//       }
//       if (verifiedOnly) {
//         params.append("verified", "true");
//       }
//       if (searchQuery) {
//         params.append("search", searchQuery);
//       }
//       if (locationQuery) {
//         params.append("location", locationQuery);
//       }
//       if (ceremonyType) {
//         params.append("ceremony", ceremonyType);
//       }

//       const response = await fetch(`/api/providers?${params.toString()}`);
//       if (!response.ok) throw new Error("Failed to fetch vendors");

//       const data = await response.json();
//       setVendors(data.providers || []);
//       setPagination((prev) => ({
//         ...prev,
//         total: data.pagination?.total || 0,
//         pages: data.pagination?.pages || 1,
//       }));
//     } catch (err) {
//       console.error("Error fetching vendors:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // Check if any filters are active
//   const hasActiveFilters =
//     searchQuery ||
//     selectedCategory ||
//     verifiedOnly ||
//     locationQuery ||
//     ceremonyType;

//   const categories = [
//     "Venues",
//     "Photography",
//     "Catering",
//     "Music & DJs",
//     "Flowers",
//     "Planning",
//     "Baking",
//     "Decoration",
//     "Makeup",
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />

//       {/* Hero Section */}
//       <section className="relative bg-foreground pt-32 pb-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           <Link
//             href="/"
//             className="inline-flex items-center gap-2 text-background/70 hover:text-background transition mb-6"
//           >
//             <ArrowLeft size={18} />
//             <span>Back to Home</span>
//           </Link>

//           <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
//             Find Your Perfect Vendor
//           </h1>
//           <p className="text-lg text-background/70 max-w-2xl mb-8">
//             Browse our curated collection of verified vendors across different
//             categories. Find the perfect match for your event.
//           </p>

//           {/* Search Bar */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1 max-w-xl">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search vendors by name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 rounded-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-background/20 text-background hover:bg-background/30 transition"
//             >
//               <Filter size={18} />
//               Filters
//               <ChevronDown
//                 size={16}
//                 className={`transition ${showFilters ? "rotate-180" : ""}`}
//               />
//             </button>
//           </div>

//           {/* Filters Panel */}
//           {showFilters && (
//             <div className="mt-6 p-6 rounded-2xl bg-background/10 backdrop-blur-sm">
//               <div className="flex flex-wrap gap-4">
//                 <div>
//                   <label className="block text-sm text-background/70 mb-2">
//                     Category
//                   </label>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="px-4 py-2 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
//                   >
//                     <option value="">All Categories</option>
//                     {categories.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex items-end">
//                   <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={verifiedOnly}
//                       onChange={(e) => setVerifiedOnly(e.target.checked)}
//                       className="w-4 h-4 text-accent"
//                     />
//                     <span className="text-foreground">Verified Only</span>
//                   </label>
//                 </div>
//                 {hasActiveFilters && (
//                   <button
//                     onClick={() => {
//                       setSearchQuery("");
//                       setSelectedCategory("");
//                       setLocationQuery("");
//                       setCeremonyType("");
//                       setVerifiedOnly(false);
//                     }}
//                     className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-background/20 text-background hover:bg-background/30 transition"
//                   >
//                     <X size={16} />
//                     Clear Filters
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Vendors Grid */}
//       <section className="py-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           {/* Results Count */}
//           <div className="flex items-center justify-between mb-8">
//             <p className="text-muted-foreground">
//               {isLoading ? "Loading..." : `${pagination.total} vendors found`}
//             </p>
//           </div>

//           {/* Loading State */}
//           {isLoading && (
//             <div className="flex justify-center items-center py-20">
//               <Loader2 className="h-8 w-8 animate-spin text-accent" />
//             </div>
//           )}

//           {/* Empty State */}
//           {!isLoading && vendors.length === 0 && (
//             <div className="text-center py-20">
//               <p className="text-xl text-muted-foreground mb-4">
//                 No vendors found
//               </p>
//               <p className="text-muted-foreground mb-6">
//                 Try adjusting your search or filters
//               </p>
//               <button
//                 onClick={() => {
//                   setSearchQuery("");
//                   setSelectedCategory("");
//                   setLocationQuery("");
//                   setCeremonyType("");
//                   setVerifiedOnly(false);
//                 }}
//                 className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition"
//               >
//                 Clear all filters
//               </button>
//             </div>
//           )}

//           {/* Vendors Grid */}
//           {!isLoading && vendors.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {vendors.map((vendor) => (
//                 <Link
//                   key={vendor.id}
//                   href={`/vendors/${vendor.id}`}
//                   className="group"
//                 >
//                   <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-muted/50 shadow-lg transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
//                     <div
//                       className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
//                       style={{
//                         backgroundImage: `url(${
//                           vendor.coverImage ||
//                           vendor.photos[0] ||
//                           categoryImages[vendor.categories[0]] ||
//                           categoryImages.default
//                         })`,
//                       }}
//                     />

//                     {/* Verified Badge */}
//                     {vendor.isVerified && (
//                       <div className="absolute right-4 top-4 z-10 rounded-full bg-card/90 p-2 shadow">
//                         <Award className="h-5 w-5 text-accent" />
//                       </div>
//                     )}

//                     {/* Featured Badge */}
//                     {vendor.isFeatured && (
//                       <div className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
//                         Featured
//                       </div>
//                     )}

//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent" />

//                     {/* Content */}
//                     <div className="absolute inset-x-0 bottom-0 p-4 text-background">
//                       <p className="text-xs font-medium text-background/70 mb-1">
//                         {formatCategories(vendor.categories[0]) || "Services"}
//                       </p>
//                       <h3 className="font-semibold text-lg leading-tight mb-2">
//                         {vendor.businessName}
//                       </h3>
//                       <div className="flex items-center gap-3">
//                         <div className="flex items-center gap-1">
//                           <Star
//                             className="h-4 w-4 text-accent"
//                             fill="currentColor"
//                           />
//                           <span className="text-sm font-medium">
//                             {vendor.averageRating?.toFixed(1) || "New"}
//                           </span>
//                         </div>
//                         <span className="text-xs text-background/70">
//                           ({vendor._count?.reviews || vendor.reviewCount || 0}{" "}
//                           reviews)
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Card Footer */}
//                   <div className="mt-3 px-1">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                         <MapPin className="h-4 w-4" />
//                         <span>
//                           {truncate(
//                             `${vendor.address}, ${vendor.city}` || "UK",
//                             25
//                           )}
//                         </span>
//                       </div>
//                       {vendor.priceFrom && (
//                         <span className="text-sm font-medium text-foreground">
//                           From {formatCurrency(vendor.priceFrom || 0)}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}

//           {/* Pagination */}
//           {!isLoading && pagination.pages > 1 && (
//             <div className="flex justify-center gap-2 mt-12">
//               <button
//                 onClick={() =>
//                   setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
//                 }
//                 disabled={pagination.page === 1}
//                 className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition"
//               >
//                 Previous
//               </button>
//               <span className="px-4 py-2">
//                 Page {pagination.page} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() =>
//                   setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
//                 }
//                 disabled={pagination.page === pagination.pages}
//                 className="px-4 py-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
