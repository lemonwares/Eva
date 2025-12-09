"use client";

import {
  MapPin,
  Award,
  ArrowRight,
  Star,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

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

  useEffect(() => {
    async function fetchVendors() {
      try {
        // First try featured providers
        let response = await fetch(
          "/api/providers?featured=true&published=true&limit=8"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        let data = await response.json();

        // If no featured providers, try getting any published providers
        if (!data.providers || data.providers.length === 0) {
          response = await fetch("/api/providers?published=true&limit=8");
          if (response.ok) {
            data = await response.json();
          }
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
        // If no providers from API, keep fallback data
      } catch (err) {
        console.error("Error fetching vendors:", err);
        // Keep fallback data on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchVendors();
  }, []);

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("vendors-scroll");
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      id="vendors"
      className="relative w-full overflow-hidden bg-background px-4 py-20"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 text-center flex flex-col items-center justify-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              FEATURED VENDORS
            </span>
          </div>

          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl mb-3">
            Trusted by couples, planners, and venues alike
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            Browse our curated collection of verified vendors across different
            categories
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        )}

        {/* Horizontal Scrollable Gallery */}
        {!isLoading && (
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={() => scrollContainer("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-border/20 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200 hover:scale-110"
              aria-label="Previous"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>

            <button
              onClick={() => scrollContainer("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-border/20 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200 hover:scale-110"
              aria-label="Next"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Scrollable Container */}
            <div
              id="vendors-scroll"
              className="flex gap-6 overflow-x-auto pb-6 scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                #vendors-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {vendors.map((vendor) => (
                <Link
                  key={vendor.id}
                  href={isUsingFallback ? "/vendors" : `/vendors/${vendor.id}`}
                  className="group shrink-0 w-[320px]"
                >
                  {/* Image Container */}
                  <div className="relative mb-4 aspect-4/3 overflow-hidden rounded-2xl bg-muted/50 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${vendor.image})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />

                    {/* Verified Badge */}
                    {vendor.verified && (
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                        <Award className="h-4 w-4 text-accent inline-block" />
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="px-1">
                    <h4 className="mb-2 text-lg font-bold text-foreground transition group-hover:text-accent line-clamp-1">
                      {vendor.title}
                    </h4>

                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="font-medium">{vendor.city}</span>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-2">
                      {vendor.category}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star
                          className="h-4 w-4 text-amber-400"
                          fill="currentColor"
                        />
                        <span className="text-sm font-bold text-foreground">
                          {vendor.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({vendor.reviews})
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/vendors"
            className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-lg hover:bg-accent hover:text-white"
          >
            Explore all vendors
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
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
// import { useState, useEffect } from "react";
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
//   const [hoveredId, setHoveredId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isUsingFallback, setIsUsingFallback] = useState(true);

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
//         // If no providers from API, keep fallback data
//       } catch (err) {
//         console.error("Error fetching vendors:", err);
//         // Keep fallback data on error
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchVendors();
//   }, []);

//   return (
//     <section
//       id="vendors"
//       className="relative w-full overflow-hidden bg-background px-4 py-28"
//     >
//       {/* Decorative elements */}
//       <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>
//       <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>

//       <div className="relative max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-20">
//           <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3 shadow-sm">
//             <Sparkles className="w-4 h-4 text-accent" />
//             <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
//               FEATURED VENDORS
//             </span>
//           </div>

//           <h2 className="text-balance text-4xl font-semibold text-foreground sm:text-5xl">
//             Trusted by couples, planners, and venues alike
//           </h2>
//           <p className="mx-auto mt-4 max-w-3xl text-balance text-lg text-muted-foreground">
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

//         {/* Gallery Grid */}
//         {!isLoading && (
//           <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {vendors.map((vendor) => (
//               <Link
//                 key={vendor.id}
//                 href={isUsingFallback ? "/vendors" : `/vendors/${vendor.id}`}
//                 className="group cursor-pointer"
//                 onMouseEnter={() => setHoveredId(vendor.id)}
//                 onMouseLeave={() => setHoveredId(null)}
//               >
//                 {/* Image Container */}
//                 <div className="relative mb-5 aspect-square overflow-hidden rounded-[28px] border border-border/70 bg-muted/50 shadow-lg transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
//                   <div
//                     className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
//                     style={{ backgroundImage: `url(${vendor.image})` }}
//                   />

//                   {/* Verified Badge */}
//                   {vendor.verified && (
//                     <div className="absolute right-4 top-4 z-10 rounded-full bg-card/90 p-2 shadow">
//                       <Award className="h-5 w-5 text-accent" />
//                     </div>
//                   )}

//                   {/* Overlay with content */}
//                   <div
//                     className={`absolute inset-0 flex flex-col justify-between bg-foreground/90 p-6 text-background backdrop-blur-sm transition-opacity ${
//                       hoveredId === vendor.id ? "opacity-100" : "opacity-0"
//                     }`}
//                   >
//                     <div>
//                       <span className="mb-3 inline-block rounded-full bg-background/20 px-3 py-1.5 text-xs font-semibold">
//                         {vendor.category}
//                       </span>
//                     </div>

//                     <div>
//                       <h3 className="mb-3 text-2xl font-semibold leading-tight">
//                         {vendor.title}
//                       </h3>

//                       <div className="flex items-center gap-4 mb-4">
//                         <div className="flex items-center gap-1">
//                           <Star
//                             className="h-4 w-4 text-accent"
//                             fill="currentColor"
//                           />
//                           <span className="text-sm font-semibold">
//                             {vendor.rating.toFixed(1)}
//                           </span>
//                         </div>
//                         <span className="text-sm text-background/70">
//                           {vendor.reviews} reviews
//                         </span>
//                       </div>

//                       <span className="group/btn flex w-full items-center justify-center gap-2 rounded-full bg-background py-3 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground">
//                         View Profile
//                         <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" />
//                       </span>
//                     </div>
//                   </div>

//                   {/* Bottom color accent bar */}
//                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent transition duration-300 group-hover:translate-y-0"></div>
//                 </div>

//                 {/* Card Info - Visible by default */}
//                 <div className="px-2">
//                   <h4 className="mb-2 text-lg font-semibold text-foreground transition group-hover:text-accent">
//                     {vendor.title}
//                   </h4>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <MapPin className="h-4 w-4" />
//                       <span className="font-medium">{vendor.city}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Star
//                         className="h-4 w-4 text-accent"
//                         fill="currentColor"
//                       />
//                       <span className="text-sm font-semibold text-foreground">
//                         {vendor.rating.toFixed(1)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}

//         {/* CTA Button */}
//         <div className="text-center">
//           <Link
//             href="/vendors"
//             className="group inline-flex items-center gap-3 rounded-full bg-foreground px-10 py-4 text-sm font-semibold text-background transition hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground"
//           >
//             Explore all vendors
//             <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }
