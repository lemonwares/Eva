"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

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
}

// Fallback testimonials
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "EVA was a lifesaver! We found a photographer who understood the specific traditions of our Nikah ceremony. The photos are incredible.",
    author: "Aisha & Tariq",
    role: "Married May 2024",
    initials: "AT",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "As a planner, finding vendors who are culturally competent is my biggest challenge. EVA's platform has made my job so much easier.",
    author: "David Chen",
    role: "Event Planner",
    initials: "DC",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "We needed a caterer for our Diwali party who could handle a large crowd and authentic recipes. Found the perfect one in our area on EVA!",
    author: "Priya Sharma",
    role: "Party Host",
    initials: "PS",
    rating: 5,
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

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(true);

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
                review.body.length > 200
                  ? review.body.slice(0, 200) + "..."
                  : review.body,
              author: review.authorName,
              role: `Reviewed ${review.provider.businessName}`,
              initials: getInitials(review.authorName),
              rating: review.rating,
            })
          );
          setTestimonials(mappedTestimonials);
          setIsUsingFallback(false);
        }
        // If no reviews from API, keep fallback data
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        // Keep fallback data on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  return (
    <section
      id="inspiration"
      className="bg-background px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Stories from the EVA community
        </p>
        <h2 className="mt-4 text-balance text-4xl font-semibold text-foreground sm:text-5xl">
          Trusted by couples, planners, & hosts
        </h2>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {!isLoading && (
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="flex flex-col rounded-[28px] border border-border/70 bg-card/80 p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl"
            >
              <div className="mb-6 flex items-center gap-1 text-accent">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <svg key={index} viewBox="0 0 20 20" className="h-4 w-4">
                    <path
                      d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                      fill="currentColor"
                    />
                  </svg>
                ))}
                {[...Array(5 - testimonial.rating)].map((_, index) => (
                  <svg
                    key={`empty-${index}`}
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-muted-foreground/30"
                  >
                    <path
                      d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                      fill="currentColor"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-foreground">"{testimonial.quote}"</p>
              <div className="mt-auto flex items-center gap-4 pt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
