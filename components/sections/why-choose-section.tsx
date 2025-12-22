"use client";

import {
  MapPin,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function WhyChooseSection() {
  const features = [
    {
      icon: MapPin,
      title: "Hyper-Local Search",
      description:
        "Focus your search with precise postcode and radius filtering to find vendors right in your community.",
      colour: "from-accent/20 to-accent/10",
      iconColour: "text-accent",
    },
    {
      icon: Sparkles,
      title: "Cultural & Ceremony Matching",
      description:
        "Our core difference. Find specialists who understand the nuances of your traditions.",
      colour: "from-accent/20 to-accent/10",
      iconColour: "text-accent",
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description:
        "Book with confidence. All our listed vendors are vetted for quality and reliability.",
      colour: "from-accent/20 to-accent/10",
      iconColour: "text-accent",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-linear-to-b from-background via-muted/40 to-background px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Dot pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="h-full w-full bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Built for Modern Celebrations
          </div>

          <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-br from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Why couples and organisers rely on{" "}
            </span>
            <span className="bg-linear-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              EVA
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            We connect you with vetted professionals, tailored search filters,
            and collaborative planning tools so you can focus on designing the
            moments that matter.
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative mx-auto mt-20 grid max-w-7xl gap-8 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group relative flex animate-fadeInUp flex-col rounded-3xl border border-border bg-card/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-accent/40 hover:bg-card/90 hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "backwards",
                }}
              >
                {/* Icon container with linear */}
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${feature.colour} shadow-md ring-1 ring-border/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                >
                  <Icon
                    className={`h-7 w-7 ${feature.iconColour}`}
                    strokeWidth={2}
                  />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-4 grow text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className="mt-6 h-1 w-12 rounded-full bg-linear-to-r from-accent/50 to-accent/0 transition-all duration-300 group-hover:w-20" />
              </article>
            );
          })}
        </div>

        {/* CTA Card */}
        <div
          className="relative mx-auto mt-20 max-w-4xl animate-fadeInUp rounded-3xl border border-border bg-linear-to-br from-card/90 to-card/60 p-10 shadow-2xl backdrop-blur-sm sm:p-12 lg:p-14"
          style={{
            animationDelay: "450ms",
            animationFillMode: "backwards",
          }}
        >
          {/* Accent glow */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Ready to Explore?
            </div>

            <h3 className="mt-6 text-balance text-3xl font-bold text-foreground sm:text-4xl">
              Book vendors, compare quotes, and manage details in one calm space
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-muted-foreground">
              Join thousands of satisfied users who've simplified their event
              planning with EVA
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/auth"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-primary to-primary/90 px-8 py-3.5 text-sm font-semibold text-background shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/faq"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/80 px-8 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/40 hover:bg-background"
              >
                See How EVA Works
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Cancel anytime</span>
              </div>
              <div className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </section>
  );
}
