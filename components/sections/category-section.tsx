"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import CategorySkeleton from "@/components/ui/CategorySkeleton";

/* ── fallback data ────────────────────────────────────── */
const fallbackCategories = [
  {
    name: "Photography",
    slug: "photography",
    description: "Capture your best moments",
    image: "/images/categories/photographer.jpg.jpeg",
    _count: { providers: 24 },
  },
  {
    name: "Catering",
    slug: "catering",
    description: "Authentic cuisine for every palate",
    image: "/images/categories/caterer.jpg.jpeg",
    _count: { providers: 18 },
  },
  {
    name: "DJ & Music",
    slug: "dj-music",
    description: "Set the perfect vibe",
    image: "/images/categories/dj.jpg.jpeg",
    _count: { providers: 15 },
  },
  {
    name: "Event Planning",
    slug: "event-planning",
    description: "End-to-end coordination",
    image: "/images/categories/event-planner.jpg.jpeg",
    _count: { providers: 20 },
  },
  {
    name: "Floral & Decor",
    slug: "floral-decor",
    description: "Transform any space",
    image: "/images/categories/florist.jpg.jpeg",
    _count: { providers: 12 },
  },
  {
    name: "Cake & Confectionery",
    slug: "cake-confectionery",
    description: "Custom cakes & treats",
    image: "/images/categories/cake-maker.jpg.jpeg",
    _count: { providers: 10 },
  },
  {
    name: "Fashion & Styling",
    slug: "fashion-styling",
    description: "Look your absolute best",
    image: "/images/categories/tailor.jpg.jpeg",
    _count: { providers: 14 },
  },
  {
    name: "Decoration",
    slug: "decoration",
    description: "Create stunning aesthetics",
    image: "/images/categories/decorator.jpg.jpeg",
    _count: { providers: 16 },
  },
  {
    name: "MC & Hosting",
    slug: "mc-hosting",
    description: "Keep the energy alive",
    image: "/images/categories/mc-host.jpg.jpeg",
    _count: { providers: 8 },
  },
];

/* ── CategoryCard ─────────────────────────────────────── */
interface CategoryCardProps {
  category: (typeof fallbackCategories)[number];
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block shrink-0 w-[280px] sm:w-[320px]"
    >
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">
        <Image
          src={category.image}
          alt={category.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

        {/* text overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3
            className="text-xl font-playfair font-bold text-white tracking-tight"
          >
            {category.name}
          </h3>
          <p className="mt-1 text-sm text-white/80 line-clamp-1">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ── CategorySection ──────────────────────────────────── */
export default function CategorySection() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* fetch from API, keep fallback on error */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/categories?featured=true");
        if (res.ok) {
          const data = await res.json();
          if (data?.length > 0) {
            setCategories(
              data.map((cat: any) => ({
                name: cat.name,
                slug: cat.slug,
                description: cat.description || "",
                image:
                  cat.coverImage ||
                  cat.image ||
                  fallbackCategories.find((f) => f.name === cat.name)?.image ||
                  fallbackCategories[0].image,
                _count: cat._count || { providers: 0 },
              })),
            );
          }
        }
      } catch {
        /* keep fallback */
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="mb-6 inline-flex items-center rounded-full bg-teal-light px-6 py-2 text-sm font-semibold text-primary-dark">
              Browse Categories
            </p>
            <h2 className="text-3xl sm:text-5xl font-playfair leading-tight text-foreground">
              Every service you need, curated in one place
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              From venues to videographers, discover talented professionals who
              understand your vision
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground hover:border-primary hover:text-primary transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground hover:border-primary hover:text-primary transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* carousel */}
        {isLoading ? (
          <div className="flex gap-5 overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <CategorySkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <div key={cat.slug} className="snap-start">
                <CategoryCard category={cat} />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/categories"
            className="btn-eva-outline rounded-full inline-flex"
          >
            View all categories
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
