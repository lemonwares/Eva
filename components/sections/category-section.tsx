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
  LucideIcon,
  Heart,
  Video,
  Wand2,
  Shirt,
  GlassWater,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

// Map icon names to Lucide icons
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

// Default images by category name
const categoryImages: Record<string, string> = {
  Venues:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
  Photographers:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
  Photography:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
  Caterers:
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
  Catering:
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
  "Music & DJs":
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
  Music:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
  Florists:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
  Flowers:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
  "Event Planners":
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
  Planning:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
  Bakers:
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
  Baking:
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
  Decorators:
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
  Decoration:
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
  "Makeup Artists":
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
  Makeup:
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
  default:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
};

// Default icon by category name
const defaultIconMap: Record<string, LucideIcon> = {
  Venues: Building2,
  Photographers: Camera,
  Photography: Camera,
  Caterers: Utensils,
  Catering: Utensils,
  "Music & DJs": Music,
  Music: Music,
  Florists: Flower2,
  Flowers: Flower2,
  "Event Planners": Users,
  Planning: Users,
  Bakers: Cake,
  Baking: Cake,
  Decorators: Sparkles,
  Decoration: Sparkles,
  "Makeup Artists": Palette,
  Makeup: Palette,
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  coverImage: string | null;
  isFeatured: boolean;
  _count?: {
    providers?: number;
  };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  count: string;
  image: string;
}

// Fallback categories
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(true);

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

  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-secondary/40 px-4 py-28 sm:px-6 lg:px-8"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Browse categories
            </span>
          </div>

          <h2 className="text-balance text-4xl font-semibold text-foreground sm:text-5xl">
            Every service you need, curated in one place
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-balance text-lg text-muted-foreground">
            From venues to videographers, discover talented professionals who
            understand your vision
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && (
          <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isHovered = hoveredIndex === index;

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Image Background */}
                  <div className="relative aspect-4/3 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${category.image})` }}
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-foreground/60 transition duration-500 group-hover:bg-foreground/70"></div>

                    {/* Icon badge */}
                    <div className="absolute left-6 top-6 z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/20 text-background shadow-lg transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon size={26} />
                      </div>
                    </div>

                    {/* Count badge */}
                    <div className="absolute right-6 top-6 z-10">
                      <div className="rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground shadow">
                        <span>{category.count}</span>
                      </div>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                      <h3 className="text-2xl font-semibold text-background transition">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm text-background/80">
                        {category.description}
                      </p>

                      {/* View button - appears on hover */}
                      <span
                        className={`group/btn inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-xs font-semibold text-foreground transition ${
                          isHovered
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                        }`}
                      >
                        Browse {category.name}
                        <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" />
                      </span>
                    </div>

                    {/* Bottom accent bar */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-foreground transition ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/categories"
            className="group inline-flex items-center gap-3 rounded-full bg-foreground px-10 py-4 text-sm font-semibold text-background transition hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground"
          >
            View all categories
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
