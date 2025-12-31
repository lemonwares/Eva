"use client";

import { useState, useEffect } from "react";
import { Loader2, Quote, Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: string;
  provider: {
    id: string;
    businessName: string;
  };
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  initials: string;
  rating: number;
  highlight?: string;
  avatar?: string; // Add avatar field
}

// Realistic fallback testimonials with British English
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Finding a photographer who understood our cultural background made all the difference. The shots from our ceremony were absolutely stunning, and our families were thrilled with how everything was captured.",
    author: "Amara & James",
    role: "Wedding, Peckham",
    initials: "AJ",
    rating: 5,
    highlight: "photographer",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80", // Professional woman
  },
  {
    id: "2",
    quote:
      "I've been organising events for years and sourcing culturally aware vendors has always been difficult. This platform has genuinely changed how I work—I can now connect with suppliers who really get what my clients need.",
    author: "Rachel Thompson",
    role: "Event Planner, London",
    initials: "RT",
    rating: 5,
    highlight: "vendors",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80", // Professional woman
  },
  {
    id: "3",
    quote:
      "We hosted a big family celebration and needed caterers who could deliver authentic food for 80 guests. Found an amazing local supplier through EVA who absolutely nailed the brief. Will definitely use again.",
    author: "Priya & Anil",
    role: "Anniversary Party, Birmingham",
    initials: "PA",
    rating: 5,
    highlight: "caterers",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80", // Professional man (representing the couple)
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const StarRating = ({ rating }: { rating: number }) => (
  <div
    className="flex items-center gap-0.5"
    aria-label={`${rating} out of 5 stars`}
  >
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

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        // First try approved reviews with minimum 4 star rating
        let response = await fetch(
          "/api/reviews?approved=true&minRating=4&limit=3"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        let data = await response.json();

        // If no high-rated reviews, try getting any approved reviews
        if (!data.reviews || data.reviews.length === 0) {
          response = await fetch("/api/reviews?approved=true&limit=3");
          if (response.ok) {
            data = await response.json();
          }
        }

        if (data.reviews && data.reviews.length > 0) {
          const mappedTestimonials: Testimonial[] = data.reviews.map(
            (review: Review) => ({
              id: review.id,
              quote:
                review.body.length > 180
                  ? review.body.slice(0, 180).trim() + "..."
                  : review.body,
              author: review.authorName,
              role: `Reviewed ${review.provider.businessName}`,
              initials: getInitials(review.authorName),
              rating: review.rating,
              avatar: "/images/default-avatar.svg", // Use default avatar for real reviews
            })
          );
          setTestimonials(mappedTestimonials);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Unable to load reviews");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-linear-to-b from-background via-muted/20 to-background px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Loading testimonials...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-linear-to-b from-background via-muted/20 to-background px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-linear(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

      {/* Floating accent shapes */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Real Stories from Real People
          </div>

          <h2 className="mt-6 text-balance bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Why people choose EVA
          </h2>

          <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
            Join thousands of couples, hosts, and organisers who've found their
            perfect match
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto mt-16 grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className="group relative flex animate-fadeInUp flex-col rounded-3xl border border-border/50 bg-card/50 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-accent/40 hover:bg-card/80 hover:shadow-2xl"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "backwards",
              }}
            >
              {/* Quote icon with gradient background */}
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-accent/20 to-accent/10 transition-all duration-300 group-hover:from-accent/30 group-hover:to-accent/20">
                  <Quote className="h-5 w-5 text-accent" />
                </div>

                {/* Star rating */}
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Quote text */}
              <blockquote className="grow">
                <p className="text-base leading-relaxed text-foreground/90">
                  "{testimonial.quote}"
                </p>
              </blockquote>

              {/* Author info */}
              <footer className="mt-8 flex items-center gap-4 border-t border-border/50 pt-6">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/20 ring-offset-2 ring-offset-background transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <img
                    src={testimonial.avatar || "/images/default-avatar.svg"}
                    alt={`${testimonial.author} profile`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback to default avatar if testimonial avatar fails
                      const target = e.target as HTMLImageElement;
                      if (target.src !== "/images/default-avatar.svg") {
                        target.src = "/images/default-avatar.svg";
                      } else {
                        // If default avatar also fails, show a simple user icon
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex h-full w-full items-center justify-center bg-linear-to-br from-accent via-accent/90 to-accent/70 text-white">
                              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          `;
                        }
                      }
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </footer>

              {/* Verified badge */}
              {/* <div
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-green-500 to-green-600 shadow-lg ring-2 ring-background transition-transform duration-300 group-hover:scale-110"
                aria-label="Verified review"
              >
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div> */}
            </article>
          ))}
        </div>

        {/* Trust indicators */}
        {/* <div className="mt-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-background bg-linear-to-br from-accent/90 to-accent/60 shadow-md"
                  style={{
                    transform: `translateX(${i * 2}px)`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              2,000+ happy users
            </span>
          </div>

          <div className="hidden h-1 w-1 rounded-full bg-muted-foreground/30 sm:block" />

          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-foreground">
              4.9 average rating
            </span>
          </div>

          <div className="hidden h-1 w-1 rounded-full bg-muted-foreground/30 sm:block" />

          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10">
              <svg
                className="h-3 w-3 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">
              500+ verified reviews
            </span>
          </div>
        </div> */}

        {/* Error message if needed */}
        {error && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
