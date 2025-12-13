// "use client";

// import {
//   Building2,
//   Camera,
//   Utensils,
//   Music,
//   Flower2,
//   Users,
//   Cake,
//   Sparkles,
//   Palette,
//   ArrowRight,
//   Loader2,
//   LucideIcon,
//   Heart,
//   Video,
//   Wand2,
//   Shirt,
//   GlassWater,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import Link from "next/link";

// // Map icon names to Lucide icons
// const iconMap: Record<string, LucideIcon> = {
//   Building2,
//   Camera,
//   Utensils,
//   Music,
//   Flower2,
//   Users,
//   Cake,
//   Sparkles,
//   Palette,
//   Heart,
//   Video,
//   Wand2,
//   Shirt,
//   GlassWater,
// };

// // Default images by category name
// const categoryImages: Record<string, string> = {
//   Venues:
//     "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
//   Photographers:
//     "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
//   Photography:
//     "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
//   Caterers:
//     "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
//   Catering:
//     "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
//   "Music & DJs":
//     "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
//   Music:
//     "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
//   Florists:
//     "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
//   Flowers:
//     "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
//   "Event Planners":
//     "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
//   Planning:
//     "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
//   Bakers:
//     "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
//   Baking:
//     "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
//   Decorators:
//     "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
//   Decoration:
//     "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
//   "Makeup Artists":
//     "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
//   Makeup:
//     "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
//   default:
//     "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
// };

// // Default icon by category name
// const defaultIconMap: Record<string, LucideIcon> = {
//   Venues: Building2,
//   Photographers: Camera,
//   Photography: Camera,
//   Caterers: Utensils,
//   Catering: Utensils,
//   "Music & DJs": Music,
//   Music: Music,
//   Florists: Flower2,
//   Flowers: Flower2,
//   "Event Planners": Users,
//   Planning: Users,
//   Bakers: Cake,
//   Baking: Cake,
//   Decorators: Sparkles,
//   Decoration: Sparkles,
//   "Makeup Artists": Palette,
//   Makeup: Palette,
// };

// interface Category {
//   id: string;
//   name: string;
//   slug: string;
//   description: string | null;
//   icon: string | null;
//   coverImage: string | null;
//   isFeatured: boolean;
//   _count?: {
//     providers?: number;
//   };
// }

// interface CategoryItem {
//   id: string;
//   name: string;
//   slug: string;
//   icon: LucideIcon;
//   description: string;
//   count: string;
//   image: string;
// }

// // Fallback categories
// const fallbackCategories: CategoryItem[] = [
//   {
//     id: "1",
//     name: "Venues",
//     slug: "venues",
//     icon: Building2,
//     description: "Beautiful spaces for your event",
//     count: "150+ venues",
//     image: categoryImages.Venues,
//   },
//   {
//     id: "2",
//     name: "Photographers",
//     slug: "photographers",
//     icon: Camera,
//     description: "Capture your precious moments",
//     count: "200+ professionals",
//     image: categoryImages.Photographers,
//   },
//   {
//     id: "3",
//     name: "Caterers",
//     slug: "caterers",
//     icon: Utensils,
//     description: "Delicious food for every palate",
//     count: "180+ caterers",
//     image: categoryImages.Caterers,
//   },
//   {
//     id: "4",
//     name: "Music & DJs",
//     slug: "music-djs",
//     icon: Music,
//     description: "Set the perfect mood",
//     count: "120+ artists",
//     image: categoryImages["Music & DJs"],
//   },
//   {
//     id: "5",
//     name: "Florists",
//     slug: "florists",
//     icon: Flower2,
//     description: "Fresh blooms for your celebration",
//     count: "90+ florists",
//     image: categoryImages.Florists,
//   },
//   {
//     id: "6",
//     name: "Event Planners",
//     slug: "event-planners",
//     icon: Users,
//     description: "Expert coordination & planning",
//     count: "75+ planners",
//     image: categoryImages["Event Planners"],
//   },
//   {
//     id: "7",
//     name: "Bakers",
//     slug: "bakers",
//     icon: Cake,
//     description: "Custom cakes & desserts",
//     count: "110+ bakers",
//     image: categoryImages.Bakers,
//   },
//   {
//     id: "8",
//     name: "Decorators",
//     slug: "decorators",
//     icon: Sparkles,
//     description: "Transform your venue",
//     count: "95+ decorators",
//     image: categoryImages.Decorators,
//   },
//   {
//     id: "9",
//     name: "Makeup Artists",
//     slug: "makeup-artists",
//     icon: Palette,
//     description: "Look your absolute best",
//     count: "140+ artists",
//     image: categoryImages["Makeup Artists"],
//   },
// ];

// export default function CategorySection() {
//   const [categories, setCategories] =
//     useState<CategoryItem[]>(fallbackCategories);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUsingFallback, setIsUsingFallback] = useState(true);

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         // First try featured categories
//         let response = await fetch("/api/categories?featured=true");
//         if (!response.ok) {
//           throw new Error("Failed to fetch categories");
//         }
//         let data = await response.json();

//         // If no featured categories, try getting any categories
//         if (!data || data.length === 0) {
//           response = await fetch("/api/categories");
//           if (response.ok) {
//             data = await response.json();
//           }
//         }

//         if (data && data.length > 0) {
//           const mappedCategories: CategoryItem[] = data.map(
//             (cat: Category) => ({
//               id: cat.id,
//               name: cat.name,
//               slug: cat.slug,
//               icon: cat.icon
//                 ? iconMap[cat.icon] || defaultIconMap[cat.name] || Sparkles
//                 : defaultIconMap[cat.name] || Sparkles,
//               description:
//                 cat.description || `Explore ${cat.name.toLowerCase()} vendors`,
//               count: cat._count?.providers
//                 ? `${cat._count.providers}+ vendors`
//                 : "Browse all",
//               image:
//                 cat.coverImage ||
//                 categoryImages[cat.name] ||
//                 categoryImages.default,
//             })
//           );
//           setCategories(mappedCategories);
//           setIsUsingFallback(false);
//         }
//         // If no categories from API, keep fallback data
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         // Keep fallback data on error
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   const scrollContainer = (direction: "left" | "right") => {
//     const container = document.getElementById("categories-scroll");
//     if (container) {
//       const scrollAmount = direction === "left" ? -400 : 400;
//       container.scrollBy({ left: scrollAmount, behavior: "smooth" });
//     }
//   };

//   return (
//     <section
//       id="categories"
//       className="relative overflow-hidden bg-secondary/40 px-4 py-20 sm:px-6 lg:px-8"
//     >
//       {/* Decorative elements */}
//       <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl"></div>

//       <div className="relative max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-12 text-center flex flex-col items-center justify-center">
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2 shadow-sm backdrop-blur-sm">
//             <Sparkles className="w-4 h-4 text-accent" />
//             <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//               BROWSE CATEGORIES
//             </span>
//           </div>

//           <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl mb-3">
//             Every service you need, curated in one place
//           </h2>
//           <p className="max-w-2xl text-base text-muted-foreground">
//             From venues to videographers, discover talented professionals who
//             understand your vision
//           </p>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="flex justify-center items-center py-20">
//             <Loader2 className="h-8 w-8 animate-spin text-accent" />
//           </div>
//         )}

//         {/* Horizontal Scrollable Categories */}
//         {!isLoading && (
//           <div className="relative">
//             {/* Navigation Arrows */}
//             <button
//               onClick={() => scrollContainer("left")}
//               className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-border/20 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200 hover:scale-110"
//               aria-label="Previous"
//             >
//               <ArrowRight className="h-5 w-5 rotate-180" />
//             </button>

//             <button
//               onClick={() => scrollContainer("right")}
//               className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-border/20 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200 hover:scale-110"
//               aria-label="Next"
//             >
//               <ArrowRight className="h-5 w-5" />
//             </button>

//             {/* Scrollable Container */}
//             <div
//               id="categories-scroll"
//               className="flex gap-6 overflow-x-auto pb-6 scroll-smooth"
//               style={{
//                 scrollbarWidth: "none",
//                 msOverflowStyle: "none",
//               }}
//             >
//               <style jsx>{`
//                 #categories-scroll::-webkit-scrollbar {
//                   display: none;
//                 }
//               `}</style>

//               {categories.map((category) => {
//                 const Icon = category.icon;

//                 return (
//                   <Link
//                     key={category.id}
//                     href={`/categories/${category.slug}`}
//                     className="group shrink-0 w-[320px]"
//                   >
//                     {/* Image Container */}
//                     <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted/50 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
//                       <div
//                         className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
//                         style={{ backgroundImage: `url(${category.image})` }}
//                       />

//                       {/* Gradient Overlay */}
//                       <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />

//                       {/* Icon badge */}
//                       <div className="absolute left-4 top-4 z-10">
//                         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 text-foreground shadow-lg backdrop-blur-sm transition duration-300 group-hover:scale-110">
//                           <Icon size={22} />
//                         </div>
//                       </div>

//                       {/* Count badge */}
//                       <div className="absolute right-4 top-4 z-10">
//                         <div className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-sm backdrop-blur-sm">
//                           {category.count}
//                         </div>
//                       </div>

//                       {/* Content overlay */}
//                       <div className="absolute inset-x-0 bottom-0 z-10 p-5">
//                         <h3 className="text-xl font-bold text-white mb-1 transition">
//                           {category.name}
//                         </h3>
//                         <p className="text-sm text-white/90 line-clamp-2">
//                           {category.description}
//                         </p>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* View All Button */}
//         <div className="text-center mt-12">
//           <Link
//             href="/categories"
//             className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-lg hover:bg-accent hover:text-white"
//           >
//             View all categories
//             <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import {
  Building2,
  Camera,
  Utensils,
  Music,
  Flower2,
  Users,
  Cake,
  Sparkles,
  Palette,
  ArrowRight,
  Loader2,
  Heart,
  Video,
  Wand2,
  Shirt,
  GlassWater,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

import type { LucideIcon } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  coverImage?: string | null;
  isFeatured?: boolean;
  _count?: {
    providers?: number;
  };
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  count: string;
  image: string;
};

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Camera,
  Utensils,
  Music,
  Flower2,
  Users,
  Cake,
  Sparkles,
  Palette,
  Heart,
  Video,
  Wand2,
  Shirt,
  GlassWater,
};

const categoryImages: Record<string, string> = {
  Venues:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
  Photographers:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
  Caterers:
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
  "Music & DJs":
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
  Florists:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
  "Event Planners":
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
  Bakers:
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
  Decorators:
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
  "Makeup Artists":
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
  default:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
};

const defaultIconMap: Record<string, LucideIcon> = {
  Venues: Building2,
  Photographers: Camera,
  Caterers: Utensils,
  "Music & DJs": Music,
  Florists: Flower2,
  "Event Planners": Users,
  Bakers: Cake,
  Decorators: Sparkles,
  "Makeup Artists": Palette,
};

const fallbackCategories: CategoryItem[] = [
  {
    id: "1",
    name: "Venues",
    slug: "venues",
    icon: Building2,
    description: "Beautiful spaces for your event",
    count: "150+ venues",
    image: categoryImages.Venues,
  },
  {
    id: "2",
    name: "Photographers",
    slug: "photographers",
    icon: Camera,
    description: "Capture your precious moments",
    count: "200+ professionals",
    image: categoryImages.Photographers,
  },
  {
    id: "3",
    name: "Caterers",
    slug: "caterers",
    icon: Utensils,
    description: "Delicious food for every palate",
    count: "180+ caterers",
    image: categoryImages.Caterers,
  },
  {
    id: "4",
    name: "Music & DJs",
    slug: "music-djs",
    icon: Music,
    description: "Set the perfect mood",
    count: "120+ artists",
    image: categoryImages["Music & DJs"],
  },
  {
    id: "5",
    name: "Florists",
    slug: "florists",
    icon: Flower2,
    description: "Fresh blooms for your celebration",
    count: "90+ florists",
    image: categoryImages.Florists,
  },
  {
    id: "6",
    name: "Event Planners",
    slug: "event-planners",
    icon: Users,
    description: "Expert coordination & planning",
    count: "75+ planners",
    image: categoryImages["Event Planners"],
  },
  {
    id: "7",
    name: "Bakers",
    slug: "bakers",
    icon: Cake,
    description: "Custom cakes & desserts",
    count: "110+ bakers",
    image: categoryImages.Bakers,
  },
  {
    id: "8",
    name: "Decorators",
    slug: "decorators",
    icon: Sparkles,
    description: "Transform your venue",
    count: "95+ decorators",
    image: categoryImages.Decorators,
  },
  {
    id: "9",
    name: "Makeup Artists",
    slug: "makeup-artists",
    icon: Palette,
    description: "Look your absolute best",
    count: "140+ artists",
    image: categoryImages["Makeup Artists"],
  },
];

export default function CategorySection() {
  const [categories, setCategories] =
    useState<CategoryItem[]>(fallbackCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const updateArrowVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const scrollThreshold = 10;

    setShowLeftArrow(scrollLeft > scrollThreshold);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - scrollThreshold);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // First try featured categories
        let response = await fetch("/api/categories?featured=true");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        let data = await response.json();

        // If no featured categories, try getting any categories
        if (!data || data.length === 0) {
          response = await fetch("/api/categories");
          if (response.ok) {
            data = await response.json();
          }
        }

        if (data && data.length > 0) {
          const mappedCategories: CategoryItem[] = data.map(
            (cat: Category) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              icon: cat.icon
                ? iconMap[cat.icon] || defaultIconMap[cat.name] || Sparkles
                : defaultIconMap[cat.name] || Sparkles,
              description:
                cat.description || `Explore ${cat.name.toLowerCase()} vendors`,
              count: cat._count?.providers
                ? `${cat._count.providers}+ vendors`
                : "Browse all",
              image:
                cat.coverImage ||
                categoryImages[cat.name] ||
                categoryImages.default,
            })
          );
          setCategories(mappedCategories);
          setIsUsingFallback(false);
        }
        // If no categories from API, keep fallback data
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Keep fallback data on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
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
  }, [categories, isLoading, updateArrowVisibility]);

  const scrollContainer = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-purple-100 opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-100 opacity-30 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="mb-12 text-center flex flex-col items-center justify-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              BROWSE CATEGORIES
            </span>
          </div>

          <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl mb-3">
            Every service you need, curated in one place
          </h2>
          <p className="max-w-2xl text-base text-slate-600">
            From venues to videographers, discover talented professionals who
            understand your vision
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        )}

        {!isLoading && (
          <div className="relative">
            {showLeftArrow && (
              <button
                onClick={() => scrollContainer("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Previous"
              >
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
            )}

            {showRightArrow && (
              <button
                onClick={() => scrollContainer("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Next"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-6 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="group shrink-0 w-[320px] cursor-pointer"
                  >
                    <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-200 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />

                      <div className="absolute left-4 top-4 z-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900 shadow-lg transition duration-300 group-hover:scale-110">
                          <Icon size={22} />
                        </div>
                      </div>

                      <div className="absolute right-4 top-4 z-10">
                        <div className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
                          {category.count}
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/90 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <button className="group inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:bg-purple-600">
            View all categories
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
