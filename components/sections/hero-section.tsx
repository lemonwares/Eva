"use client";

import Link from "next/link";
import HeroSearchForm from "./hero/HeroSearchForm";
import HeroStats from "./hero/HeroStats";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#fafafa] pt-32 pb-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-7xl grid gap-12 lg:gap-16 lg:grid-cols-2 items-start py-8 sm:py-0">
        {/* Left: Headline & Description */}
        <div className="space-y-8 sm:space-y-10 text-left animate-fadeInUp">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-foreground leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Find vendors who honour every tradition you celebrate.
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              EVA maps trusted photographers, organisers, caterers, and more to
              your postcode, culture, and ceremony details, so every moment
              feels personal.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row items-center">
            <Link 
              href="/search" 
              className="w-full sm:w-auto bg-[#0f172a] hover:bg-black text-white px-10 py-4 rounded-2xl font-bold transition-all text-center"
            >
              Start planning
            </Link>
            <Link
              href="/how-it-works"
              className="w-full sm:w-auto border border-border bg-white text-foreground hover:bg-muted px-10 py-4 rounded-2xl font-bold transition-all text-center"
            >
              See How It Works
            </Link>
          </div>

          <HeroStats />
        </div>

        {/* Right: Search Form */}
        <div className="animate-fadeInUp lg:pl-4" style={{ animationDelay: "0.15s" }}>
          <HeroSearchForm />
        </div>
      </div>
    </section>
  );
}
