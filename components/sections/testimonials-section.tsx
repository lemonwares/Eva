"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";

/* ── types ────────────────────────────────────────────── */
interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: string;
  provider: { id: string; businessName: string };
}

interface Testimonial {
  id: string;
  quote: string;
  title: string;
  author: string;
  role: string;
  initials: string;
  rating: number;
  avatar?: string;
}

/* ── fallback data ────────────────────────────────────── */
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    title: "The best booking system",
    quote:
      "Great experience, easy to book. Finding local vendors who understand my culture made all the difference for my wedding!",
    author: "Amara",
    role: "London, UK",
    initials: "AM",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2",
    title: "Easy to use & explore",
    quote:
      "EVA Local made finding a tailor for my traditional outfit so simple. The geo-search feature is brilliant!",
    author: "Priya",
    role: "Birmingham, UK",
    initials: "PR",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    title: "Great for finding vendors",
    quote:
      "I've been using EVA Local for a year and it's by far the best platform for finding quality local vendors. Highly recommend!",
    author: "David",
    role: "Manchester, UK",
    initials: "DA",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "4",
    title: "My go-to for events",
    quote:
      "EVA Local is my go-to app for caterers and decorators. I can easily find and book vendors near me who get my vision!",
    author: "Chioma",
    role: "Leeds, UK",
    initials: "CH",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "5",
    title: "Perfect for cultural events",
    quote:
      "Found the perfect MUA for my sister's wedding through EVA. The reviews from our community really helped!",
    author: "Fatima",
    role: "Bristol, UK",
    initials: "FA",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

/* ── helpers ──────────────────────────────────────────── */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted/20 text-muted/20"
          }`}
        />
      ))}
    </div>
  );
}

/* ── TestimonialCard ──────────────────────────────────── */
function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <article
      className="card-float group flex flex-col rounded-2xl p-8 w-[340px] sm:w-[380px] shrink-0 snap-start animate-fadeInUp"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "backwards",
      }}
    >
      {/* star rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* title */}
      <h3
        className="text-lg font-semibold text-foreground mb-3"
        style={{ fontStyle: "normal" }}
      >
        {testimonial.title}
      </h3>

      {/* quote */}
      <blockquote className="grow">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {testimonial.quote}
        </p>
      </blockquote>

      {/* author */}
      <footer className="mt-6 flex items-center gap-3">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar}
            alt={testimonial.author}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {testimonial.initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {testimonial.author}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {testimonial.role}
          </p>
        </div>
      </footer>
    </article>
  );
}

/* ── TestimonialsSection ──────────────────────────────── */
export default function TestimonialsSection() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        let res = await fetch(
          "/api/reviews?public=true&approved=true&minRating=4&limit=5",
        );
        if (!res.ok) throw new Error();
        let data = await res.json();

        if (!data.reviews?.length) {
          res = await fetch("/api/reviews?public=true&approved=true&limit=5");
          if (res.ok) data = await res.json();
        }

        if (data.reviews?.length) {
          setTestimonials(
            data.reviews.map((r: Review) => ({
              id: r.id,
              title: r.title || "Great experience",
              quote:
                r.body.length > 180
                  ? r.body.slice(0, 180).trim() + "…"
                  : r.body,
              author: r.authorName,
              role: `Reviewed ${r.provider.businessName}`,
              initials: getInitials(r.authorName),
              rating: r.rating,
            })),
          );
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
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-cream/30">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-cream/30">
      <div className="mx-auto max-w-7xl">
        {/* header row with arrows */}
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl sm:text-4xl text-foreground">
            Recent Reviews
          </h2>

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

        {/* horizontal carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
