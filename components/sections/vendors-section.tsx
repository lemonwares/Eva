"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  MapPin,
  Award,
  ArrowRight,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import FavoriteButton from "../common/FavoriteButton";
import ShareButton from "../common/ShareButton";
import { useAuth } from "@/hooks/use-auth";
import Skeleton from "../ui/Skeleton";

/* ── types ────────────────────────────────────────────── */
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
  _count: { reviews: number };
}

interface VendorItem {
  id: string;
  title: string;
  category: string;
  image: string;
  verified: boolean;
  rating: number;
  reviews: number;
  city: string;
}

/* ── fallback data ────────────────────────────────────── */
const fallbackVendors: VendorItem[] = [
  {
    id: "1",
    title: "Elegant Wedding Venues",
    category: "Venues",
    image: "/images/photos/photo-1519225421980-715cb0215aed.jpeg",
    verified: true,
    rating: 4.9,
    reviews: 234,
    city: "London",
  },
  {
    id: "2",
    title: "Professional Photographers",
    category: "Photography",
    image: "/images/categories/photographer.jpg.jpeg",
    verified: true,
    rating: 5.0,
    reviews: 189,
    city: "Manchester",
  },
  {
    id: "3",
    title: "Gourmet Catering Services",
    category: "Catering",
    image: "/images/categories/caterer.jpg.jpeg",
    verified: true,
    rating: 4.8,
    reviews: 312,
    city: "Birmingham",
  },
  {
    id: "4",
    title: "Live Music & DJs",
    category: "DJ & Music",
    image: "/images/categories/dj.jpg.jpeg",
    verified: true,
    rating: 4.9,
    reviews: 156,
    city: "Leeds",
  },
  {
    id: "5",
    title: "Floral Arrangements",
    category: "Floral & Decor",
    image: "/images/categories/florist.jpg.jpeg",
    verified: true,
    rating: 5.0,
    reviews: 278,
    city: "Bristol",
  },
  {
    id: "6",
    title: "Event Planning",
    category: "Planning",
    image: "/images/categories/event-planner.jpg.jpeg",
    verified: true,
    rating: 4.7,
    reviews: 445,
    city: "Liverpool",
  },
  {
    id: "7",
    title: "Cake & Pastry Design",
    category: "Baking",
    image: "/images/categories/cake-maker.jpg.jpeg",
    verified: true,
    rating: 4.9,
    reviews: 201,
    city: "Edinburgh",
  },
  {
    id: "8",
    title: "Decorators & Styling",
    category: "Decoration",
    image: "/images/categories/decorator.jpg.jpeg",
    verified: true,
    rating: 4.8,
    reviews: 167,
    city: "Glasgow",
  },
];

/* ── VendorCard sub-component ─────────────────────────── */
interface VendorCardProps {
  vendor: VendorItem;
  isFallback: boolean;
  isFavourited: boolean;
  showFavourite: boolean;
  onToggleFav: () => void;
}

function VendorCard({
  vendor,
  isFallback,
  isFavourited,
  showFavourite,
  onToggleFav,
}: VendorCardProps) {
  return (
    <div className="relative group">
      <Link
        href={isFallback ? "/vendors" : `/vendors/${vendor.id}`}
        className="block"
        aria-label={`View ${vendor.title}`}
      >
        {/* image card */}
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-muted/30 shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${vendor.image})` }}
          />

          {/* verified badge */}
          {vendor.verified && (
            <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm">
              <Award className="h-4 w-4 text-primary" />
            </div>
          )}

          {/* gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* bottom info */}
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="mb-0.5 text-xs font-medium text-white/70">
              {vendor.category}
            </p>
            <h3
              className="text-lg font-semibold leading-tight"
              style={{ fontFamily: "var(--font-sans)", fontStyle: "normal" }}
            >
              {vendor.title}
            </h3>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">
                  {vendor.rating > 0 ? vendor.rating.toFixed(1) : "New"}
                </span>
              </div>
              <span className="text-xs text-white/70">
                ({vendor.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-2 flex items-center gap-1 px-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{vendor.city}</span>
        </div>
      </Link>

      {/* action buttons */}
      <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
        {showFavourite && (
          <div onClick={(e) => e.preventDefault()}>
            <FavoriteButton
              providerId={vendor.id}
              initialFavorited={isFavourited}
              variant="outline"
              className="text-white"
              onToggle={onToggleFav}
            />
          </div>
        )}
        <div onClick={(e) => e.preventDefault()}>
          <ShareButton
            url={`${typeof window !== "undefined" ? window.location.origin : ""}/vendors/${vendor.id}`}
            title={vendor.title}
            description={`Check out ${vendor.title} on EVA Local`}
            variant="ghost"
            className="text-white hover:text-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

/* ── VendorsSection ───────────────────────────────────── */
export default function VendorsSection() {
  const { data: session } = useSession();
  const { user } = useAuth();

  const [vendors, setVendors] = useState<VendorItem[]>(fallbackVendors);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  /* fetch vendors */
  useEffect(() => {
    (async () => {
      try {
        let res = await fetch(
          "/api/providers?featured=true&published=true&limit=8",
        );
        if (!res.ok) throw new Error();
        let data = await res.json();

        if (!data.providers?.length) {
          res = await fetch("/api/providers?published=true&limit=8");
          if (res.ok) data = await res.json();
        }

        if (data.providers?.length) {
          setVendors(
            data.providers.map((p: Provider) => ({
              id: p.id,
              title: p.businessName,
              category: p.categories[0] || "Services",
              image:
                p.coverImage ||
                p.photos[0] ||
                "/images/photos/photo-1519225421980-715cb0215aed.jpeg",
              verified: p.isVerified,
              rating: p.averageRating || 0,
              reviews: p._count?.reviews || p.reviewCount || 0,
              city: p.city || "UK",
            })),
          );
          setIsFallback(false);
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
      left: dir === "left" ? -360 : 360,
      behavior: "smooth",
    });
  }, []);

  const toggleFav = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream/30">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
              Featured Vendors
            </p>
            <h2 className="text-3xl sm:text-4xl text-foreground">
              Trusted by couples, organisers & venues alike
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Browse our curated collection of verified vendors across different
              categories
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
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

        {/* loading skeleton */}
        {isLoading && (
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-60 shrink-0 space-y-3">
                <Skeleton className="aspect-4/5 rounded-2xl" />
                <div className="px-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* vendor carousel */}
        {!isLoading && (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {vendors.map((v) => (
              <div
                key={v.id}
                className="w-60 sm:w-60 lg:w-64 shrink-0 snap-start"
              >
                <VendorCard
                  vendor={v}
                  isFallback={isFallback}
                  isFavourited={favorites.has(v.id)}
                  showFavourite={!!user}
                  onToggleFav={() => toggleFav(v.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <Link
            href="/vendors"
            className="btn-eva-primary rounded-full inline-flex"
          >
            Explore all vendors
            <ArrowRight size={16} />
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
