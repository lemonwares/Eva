"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ArrowLeft,
  ArrowRight,
  Loader2,
  LucideIcon,
  Video,
  Wand2,
  Shirt,
  GlassWater,
  Heart,
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

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
  Scissors: Users, // Placeholder for Hair Stylists
  Crown: Sparkles, // Placeholder for Gele Stylists
  Mic: Music, // Placeholder for MCs
  Gift: Sparkles, // Placeholder for Souvenir Vendors
  Star: Sparkles, // Placeholder for Entertainment
  Snowflake: Sparkles, // Placeholder for Ice Sculptors
};

// Default icon by category name
const defaultIconMap: Record<string, LucideIcon> = {
  Venues: Building2,
  Photographers: Camera,
  Videographers: Video,
  Caterers: Utensils,
  Catering: Utensils,
  "Music & DJs": Music,
  Music: Music,
  DJs: Music,
  MCs: Music,
  Musicians: Music,
  Florists: Flower2,
  Flowers: Flower2,
  "Event Planners": Users,
  Planning: Users,
  "Wedding Planners": Users,
  Bakers: Cake,
  Baking: Cake,
  Decorators: Sparkles,
  Decoration: Sparkles,
  Makeup: Palette,
  "Makeup Artists": Palette,
  "Hair Stylists": Users,
  Mixologists: GlassWater,
  "Waiters & Servers": Users,
  "Gele Stylists": Sparkles,
  "Fashion Designers": Shirt,
  "Souvenir Vendors": Sparkles,
  Entertainment: Sparkles,
  "Ice Sculptors": Sparkles,
};

// Default images by category name
const categoryImages: Record<string, string> = {
  Venues:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
  Photographers:
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
  Videographers:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
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
  DJs: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
  MCs: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
  Musicians:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
  Florists:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
  Flowers:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
  "Event Planners":
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
  Planning:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
  "Wedding Planners":
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
  Bakers:
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
  Baking:
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
  Decorators:
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
  Decoration:
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
  Makeup:
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
  "Makeup Artists":
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
  "Hair Stylists":
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
  Mixologists:
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
  "Waiters & Servers":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
  "Gele Stylists":
    "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
  "Fashion Designers":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
  "Souvenir Vendors":
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
  Entertainment:
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
  "Ice Sculptors":
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
  default:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  coverImage: string | null;
  isFeatured: boolean;
  vendorCount?: number;
  subcategories?: {
    id: string;
    name: string;
    slug: string;
  }[];
  _count?: {
    providers: number;
  };
}
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories?withSubcategories=true");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function formatVendorCount(count: number) {
    if (count > 999)
      return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + "k";
    if (count > 99) return "99+";
    return count.toString();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-foreground pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-background/70 hover:text-background transition mb-6"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-background/70 max-w-2xl">
            Find the perfect vendor for every aspect of your event. From venues
            to videographers, we've got you covered.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && categories.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">
                No categories found
              </p>
              <p className="text-muted-foreground mb-6">
                Categories will appear here once they are added.
              </p>
            </div>
          )}

          {/* Categories Grid */}
          {!isLoading && categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => {
                const IconComponent =
                  category.icon && iconMap[category.icon]
                    ? iconMap[category.icon]
                    : defaultIconMap[category.name] || Sparkles;

                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border/70 bg-muted/50 shadow-lg transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${
                            category.coverImage ||
                            categoryImages[category.name] ||
                            categoryImages.default
                          })`,
                        }}
                      />

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-foreground/60 transition duration-500 group-hover:bg-foreground/70" />

                      {/* Featured Badge */}
                      {category.isFeatured && (
                        <div className="absolute right-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                          Featured
                        </div>
                      )}

                      {/* Icon badge */}
                      <div className="absolute left-6 top-6 z-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/20 text-background shadow-lg transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <IconComponent size={26} />
                        </div>
                      </div>

                      {/* --- VENDOR COUNT BADGE: Add this block --- */}

                      {typeof category.vendorCount === "number" && (
                        <div className="absolute right-4 bottom-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-foreground shadow">
                          {formatVendorCount(category.vendorCount)} vendor
                          {category.vendorCount === 1 ? "" : "s"}
                        </div>
                      )}
                      {/* --- END VENDOR COUNT BADGE --- */}

                      {/* Content overlay */}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                        <h3 className="text-2xl font-semibold text-background mb-2">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-background/80 mb-4 line-clamp-2">
                            {category.description}
                          </p>
                        )}

                        {/* Subcategories preview */}
                        {category.subcategories &&
                          category.subcategories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {category.subcategories.slice(0, 3).map((sub) => (
                                <span
                                  key={sub.id}
                                  className="px-2 py-1 rounded-full bg-background/20 text-xs text-background"
                                >
                                  {sub.name}
                                </span>
                              ))}
                              {category.subcategories.length > 3 && (
                                <span className="px-2 py-1 rounded-full bg-background/20 text-xs text-background">
                                  +{category.subcategories.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-background group-hover:text-accent transition">
                          Browse vendors
                          <ArrowRight
                            size={16}
                            className="transition group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
