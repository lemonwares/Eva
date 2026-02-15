"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
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
  LucideIcon,
  Shirt,
  GlassWater,
  Video,
} from "lucide-react";
import CategorySkeleton from "@/components/ui/CategorySkeleton";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

/* ── icon + image defaults ────────────────────────────── */
const iconByName: Record<string, LucideIcon> = {
  Photography: Camera,
  Photographers: Camera,
  Videographers: Video,
  Catering: Utensils,
  Caterers: Utensils,
  "Music & DJs": Music,
  Music: Music,
  DJs: Music,
  MCs: Music,
  Musicians: Music,
  Florists: Flower2,
  Flowers: Flower2,
  "Floral & Decor": Flower2,
  "Event Planners": Users,
  Planning: Users,
  "Wedding Planners": Users,
  Bakers: Cake,
  Baking: Cake,
  "Cake & Confectionery": Cake,
  Decorators: Palette,
  Decoration: Palette,
  Makeup: Sparkles,
  "Makeup Artists": Sparkles,
  "Fashion Designers": Shirt,
  "Fashion & Styling": Shirt,
  Mixologists: GlassWater,
};

const imageByName: Record<string, string> = {
  Photography: "/images/categories/photographer.jpg.jpeg",
  Photographers: "/images/categories/photographer.jpg.jpeg",
  Catering: "/images/categories/caterer.jpg.jpeg",
  Caterers: "/images/categories/caterer.jpg.jpeg",
  "Music & DJs": "/images/categories/dj.jpg.jpeg",
  Music: "/images/categories/dj.jpg.jpeg",
  DJs: "/images/categories/dj.jpg.jpeg",
  Florists: "/images/categories/florist.jpg.jpeg",
  Flowers: "/images/categories/florist.jpg.jpeg",
  "Floral & Decor": "/images/categories/florist.jpg.jpeg",
  "Event Planners": "/images/categories/event-planner.jpg.jpeg",
  Planning: "/images/categories/event-planner.jpg.jpeg",
  Bakers: "/images/categories/cake-maker.jpg.jpeg",
  Baking: "/images/categories/cake-maker.jpg.jpeg",
  "Cake & Confectionery": "/images/categories/cake-maker.jpg.jpeg",
  Decorators: "/images/categories/decorator.jpg.jpeg",
  Decoration: "/images/categories/decorator.jpg.jpeg",
  "Fashion Designers": "/images/categories/tailor.jpg.jpeg",
  "Fashion & Styling": "/images/categories/tailor.jpg.jpeg",
  MCs: "/images/categories/mc-host.jpg.jpeg",
};
const defaultImage = "/images/photos/colourful-event-table-centrepiece.jpg";

/* ── types ────────────────────────────────────────────── */
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  coverImage: string | null;
  isFeatured: boolean;
  vendorCount?: number;
  subcategories?: { id: string; name: string; slug: string }[];
  _count?: { providers: number };
}

/* ── CategoryCard ─────────────────────────────────────── */
function CategoryCard({ cat }: { cat: Category }) {
  const Icon = iconByName[cat.name] || Sparkles;
  const img = cat.coverImage || imageByName[cat.name] || defaultImage;
  const count = cat.vendorCount ?? cat._count?.providers ?? 0;

  return (
    <Link href={`/categories/${cat.slug}`} className="group">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">
        <Image
          src={img}
          alt={cat.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

        {/* icon */}
        <div className="absolute left-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white">
          <Icon size={22} />
        </div>

        {/* featured badge */}
        {cat.isFeatured && (
          <div className="absolute right-4 top-4 z-10 chip-pastel bg-primary text-white">
            Featured
          </div>
        )}

        {/* count */}
        {count > 0 && (
          <div className="absolute right-4 bottom-4 z-10 chip-pastel bg-white/90 text-foreground backdrop-blur-sm">
            {count} vendor{count !== 1 ? "s" : ""}
          </div>
        )}

        {/* text */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          <h3
            className="text-xl font-semibold text-white"
            style={{ fontFamily: "var(--font-sans)", fontStyle: "normal" }}
          >
            {cat.name}
          </h3>
          {cat.description && (
            <p className="mt-1 text-sm text-white/80 line-clamp-2">
              {cat.description}
            </p>
          )}

          {/* subcategories */}
          {cat.subcategories && cat.subcategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cat.subcategories.slice(0, 3).map((sub) => (
                <span
                  key={sub.id}
                  className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm"
                >
                  {sub.name}
                </span>
              ))}
              {cat.subcategories.length > 3 && (
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm">
                  +{cat.subcategories.length - 3} more
                </span>
              )}
            </div>
          )}

          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:text-teal-light transition-colors">
            Browse vendors{" "}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/categories?withSubcategories=true");
        if (!res.ok) throw new Error();
        setCategories(await res.json());
      } catch {
        /* empty */
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-linear-to-b from-teal-light/40 to-background px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition mb-6"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>

          <h1 className="text-4xl sm:text-5xl text-foreground">
            Browse Categories
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Find the perfect vendor for every aspect of your event. From venues
            to videographers, we&apos;ve got you covered.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CategorySkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && categories.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-xl text-muted-foreground mb-2">
                No categories found
              </p>
              <p className="text-muted-foreground">
                Categories will appear here once they are added.
              </p>
            </div>
          )}

          {!isLoading && categories.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Are you a vendor? CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            Are you a vendor?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join EVA Local and connect with clients looking for your services.
            Get discovered by customers in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/list-your-business"
              className="btn-eva-primary px-8 py-3 text-center"
            >
              List your business
            </Link>
            <Link
              href="/how-it-works"
              className="btn-eva-outline px-8 py-3 text-center"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
