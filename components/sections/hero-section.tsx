"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import HeroSearchForm from "./hero/HeroSearchForm";
import HeroStats from "./hero/HeroStats";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-linear-to-b from-teal-light/40 via-background to-background pt-32 pb-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 right-12 h-72 w-72 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-mint/60 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
        {/* Left: Headline */}
        <div className="space-y-8 text-left animate-fadeInUp">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-teal-light/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <Sparkles size={14} />
            UK&apos;s Multicultural Events Marketplace
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.15] text-foreground">
              Find vendors who honour every tradition you celebrate.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              EVA maps trusted photographers, organisers, caterers, and more to
              your postcode, culture, and ceremony details — so every moment
              feels personal.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/search" className="btn-eva-primary rounded-full px-8">
              Start planning
            </Link>
            <Link
              href="/how-it-works"
              className="btn-eva-outline rounded-full px-8"
            >
              See How It Works
            </Link>
          </div>

          <HeroStats />
        </div>

        {/* Right: Search Form */}
        <div className="animate-fadeInUp" style={{ animationDelay: "0.15s" }}>
          <HeroSearchForm />
        </div>
      </div>
    </section>
  );
}
