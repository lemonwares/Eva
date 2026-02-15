import type { Metadata } from "next";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how EVA Local works — search for event vendors by postcode, culture, and ceremony, send inquiries, receive quotes, and book with confidence.",
  openGraph: {
    title: "How It Works | EVA Local",
    description:
      "Search, compare, and book multicultural event vendors in three simple steps.",
    url: "/how-it-works",
  },
  alternates: {
    canonical: "/how-it-works",
  },
};
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Filter,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

const flowSteps = [
  {
    title: "Tell us what you need",
    description:
      "Share your ceremony type, budget range, and dates. We match by culture, postcode, and capacity so you only see relevant vendors.",
    icon: Compass,
  },
  {
    title: "Compare curated matches",
    description:
      "Browse verified profiles, portfolios, and reviews. Filter by specialities like halal catering, dhol players, or same-day edits.",
    icon: Filter,
  },
  {
    title: "Message and shortlist",
    description:
      "Chat with vendors, request quotes, and save favourites in one place so family and organisers can weigh in.",
    icon: HeartHandshake,
  },
  {
    title: "Book with confidence",
    description:
      "Lock in your date. Every vendor is identity-checked, insured, and reviewed by couples like you.",
    icon: CheckCircle2,
  },
];

const tracks = [
  {
    label: "For Customers",
    title:
      "Find the right vendors for your celebration with intelligent matching, collaborative tools, and trusted reviews.",
    points: [
      {
        label: "Postcode-first search",
        desc: "Find vendors within your chosen radius instantly",
      },
      {
        label: "Collaborative shortlists",
        desc: "Share and plan together with family and friends",
      },
      {
        label: "Response guidance",
        desc: "Know what to ask and expect from vendors",
      },
    ],
    badge: "For Customers",
    cta: { label: "Find vendors", href: "/search" },
  },
  {
    label: "For Vendors",
    title:
      "Grow your business with qualified leads, showcase your expertise, and connect with clients who value your work.",
    points: [
      {
        label: "Culture-aware visibility",
        desc: "Get seen by clients who value your expertise",
      },
      {
        label: "Lead management",
        desc: "Track inquiries and convert more bookings",
      },
      {
        label: "Credential displays",
        desc: "Showcase your certifications and insurance",
      },
    ],
    badge: "For Vendors",
    cta: { label: "List your business", href: "/list-your-business" },
  },
];

const assurances = [
  {
    icon: ShieldCheck,
    title: "Verified professionals",
    copy: "Every vendor passes ID, insurance, and quality checks before listing.",
    bg: "bg-teal-light",
  },
  {
    icon: Users,
    title: "Shared workspaces",
    copy: "Loop in partners, parents, or organisers with comment threads that stay organised.",
    bg: "bg-lavender",
  },
  {
    icon: Star,
    title: "Transparent reviews",
    copy: "See proof: portfolios, ratings, and cultural specialities are front and centre.",
    bg: "bg-mint",
  },
  {
    icon: CalendarCheck,
    title: "Date confidence",
    copy: "Vendors keep calendars fresh, so you avoid dead ends and ghosting.",
    bg: "bg-peach",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-linear-to-b from-teal-light/40 to-background px-4 py-20 pt-28 sm:px-6 lg:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                How It Works
              </p>

              <h1 className="text-4xl sm:text-5xl text-foreground">
                See how EVA finds vendors who get your traditions.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                A guided path from search to booking, designed for modern
                multicultural celebrations and the pros who serve them.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/search" className="btn-eva-dark rounded-full">
                  Start with search
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/list-your-business"
                  className="btn-eva-outline rounded-full"
                >
                  Become a vendor
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "Culture-first matching",
                  "Verified professionals",
                  "Shared planning workspace",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps card */}
            <div className="card-float rounded-3xl p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-light">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    The EVA Flow
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Four simple steps to your perfect vendor
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {flowSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="rounded-2xl border border-border/50 bg-background/80 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light/60">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
                            Step {i + 1}
                          </p>
                          <h3
                            className="text-base font-semibold text-foreground"
                            style={{ fontStyle: "normal" }}
                          >
                            {step.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Dual Tracks */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
                Built for Both Sides
              </p>
              <h2 className="text-3xl sm:text-4xl text-foreground">
                Designed for customers and vendors alike
              </h2>
              <p className="mt-3 mx-auto max-w-2xl text-muted-foreground">
                Whether you&apos;re planning a celebration or running a
                business, EVA has tools made for you.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {tracks.map((track) => (
                <div
                  key={track.badge}
                  className="card-float rounded-3xl p-8 transition hover:-translate-y-1"
                >
                  <h3
                    className="text-xl font-semibold text-foreground mb-2"
                    style={{ fontStyle: "normal" }}
                  >
                    {track.badge}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {track.title}
                  </p>
                  <ul className="space-y-4">
                    {track.points.map((pt) => (
                      <li
                        key={pt.label}
                        className="flex items-start gap-3 text-sm"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <span className="font-medium text-foreground">
                            {pt.label}
                          </span>
                          <p className="text-muted-foreground">{pt.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={track.cta.href}
                    className="btn-eva-primary rounded-full mt-6 inline-flex"
                  >
                    {track.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Assurances */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream/30">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
                Trust the Process
              </p>
              <h2 className="text-3xl sm:text-4xl text-foreground">
                Built on trust, designed for peace of mind
              </h2>
              <p className="mt-3 mx-auto max-w-2xl text-muted-foreground">
                Every feature is designed to give you confidence throughout your
                planning journey.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {assurances.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="card-float group rounded-2xl p-6 transition hover:-translate-y-1"
                  >
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3
                      className="text-base font-semibold text-foreground"
                      style={{ fontStyle: "normal" }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mx-auto max-w-4xl rounded-3xl bg-[#1e2433] px-8 py-14 text-center text-white">
            <h2 className="text-3xl font-bold" style={{ color: "white" }}>
              Ready to start planning?
            </h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              Join thousands of customers and vendors who trust EVA for their
              celebrations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/search" className="btn-eva-primary rounded-full">
                Find vendors
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/list-your-business"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                List your business
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: "4.9/5", label: "VENDOR RATING" },
                { value: "80+", label: "CULTURAL SPECIALTIES" },
                { value: "24hr", label: "RESPONSE GUIDANCE" },
                { value: "100%", label: "MOBILE PLANNING" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
