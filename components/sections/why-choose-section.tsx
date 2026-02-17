"use client";

import {
  MapPin,
  Users,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  FileText,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: MapPin,
    title: "Local-first search",
    description:
      "Find vendors near you by postcode and radius. Support your local community while reducing travel time and costs.",
    bg: "bg-teal-light",
  },
  {
    icon: Users,
    title: "Trusted community vendors",
    description:
      "Browse verified profiles with detailed portfolios, clear pricing, and authentic reviews from your community.",
    bg: "bg-lavender",
  },
  {
    icon: MessageSquare,
    title: "Simple messaging & quotes",
    description:
      "Request quotes, compare options, and book with confidence, all in one place, on any device.",
    bg: "bg-mint",
  },
];

export default function WhyChooseSection() {
  return (
    <>
      {/* Why Choose */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair text-foreground">
              Why choose EVA Local?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We make finding and booking local event vendors simple, trusted,
              and tailored to your community.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <article
                  key={feat.title}
                  className="card-float group rounded-2xl p-8 animate-fadeInUp"
                  style={{
                    animationDelay: `${i * 120}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feat.bg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6 text-primary" strokeWidth={2} />
                  </div>

                  <h3
                    className="text-xl font-semibold text-foreground"
                    style={{ fontStyle: "normal" }}
                  >
                    {feat.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>

                  <div className="mt-6 h-1 w-10 rounded-full bg-primary/30 transition-all duration-300 group-hover:w-16 group-hover:bg-primary/50" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tailor Made For You */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
              Local Discovery
            </p>
            <h2 className="text-3xl sm:text-4xl font-playfair text-foreground">
              Tailor Made For You
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
              EVA Local helps you discover truly local vendors who understand
              your community&apos;s unique needs. Reduce travel costs, support
              local businesses, and find professionals who match your cultural
              style and event requirements.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Search by postcode and radius",
                "See distance and availability quickly",
                "Find vendors who understand your style and culture",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/search" className="btn-eva-primary rounded-full">
                Start searching
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/features/tailor-made-collage.png"
              alt="Local businesses including hair boutique, tailor at work, and couple browsing"
              width={600}
              height={450}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Book with Confidence */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream/30">
        <div className="mx-auto max-w-7xl grid items-center gap-12 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl shadow-xl lg:order-1">
            <Image
              src="/images/features/messaging-lifestyle.png"
              alt="Customer messaging vendor about floral arrangements"
              width={600}
              height={450}
              className="w-full object-cover"
            />
          </div>
          <div className="lg:order-2">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
              Seamless Booking
            </span>
            <h2 className="text-3xl sm:text-5xl font-playfair italic text-[#1e2433] mb-6">
              Book with confidence
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-lg mb-10">
              Message vendors directly, discuss your requirements, and get
              personalised quotes. Keep all your conversations and confirmations
              in one place, accessible from any device.
            </p>

            {/* Steps Flow */}
            <div className="flex items-start gap-4 sm:gap-6 mb-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <MessageSquare size={24} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">Message</span>
              </div>

              {/* Arrow */}
              <div className="pt-4 sm:pt-5 text-border">
                <ArrowRight size={20} />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <FileText size={24} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">Get a quote</span>
              </div>

              {/* Arrow */}
              <div className="pt-4 sm:pt-5 text-border">
                <ArrowRight size={20} />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">Confirm booking</span>
              </div>
            </div>

            <div>
              <Link
                href="/search"
                className="btn-eva-primary rounded-xl px-8 py-3 h-auto inline-flex items-center gap-2"
              >
                Find vendors now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Find What You Need, On The Go */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
              Local Discovery
            </p>
            <h2 className="text-3xl sm:text-4xl font-playfair text-foreground">
              Find What You Need, On The Go
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
              Our powerful geo-search puts the best local vendors at your
              fingertips. Whether you&apos;re planning from home or on the move,
              discover trusted professionals within your chosen radius, complete
              with real-time availability, verified reviews, and instant
              booking.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                {
                  label: "GPS-powered search",
                  desc: "Find vendors within your chosen radius instantly",
                },
                {
                  label: "Real-time availability",
                  desc: "See who's available and ready to book",
                },
                {
                  label: "Verified local reviews",
                  desc: "Read trusted feedback from your community",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/search" className="btn-eva-primary rounded-full">
                Try it now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/features/geo-mobile-screens.png"
              alt="EVA Local mobile app showing vendor profile and map search"
              width={600}
              height={450}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
