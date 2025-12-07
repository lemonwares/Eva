import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Filter,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const flowSteps = [
  {
    title: "Tell us what you need",
    description:
      "Share your ceremony, budget range, and dates. We match by culture, postcode, and capacity so you only see relevant vendors.",
    icon: Compass,
  },
  {
    title: "Compare curated matches",
    description:
      "Browse verified profiles, portfolios, and reviews. Filter by specialties like halal catering, dhol players, or same-day edits.",
    icon: Filter,
  },
  {
    title: "Message and shortlist",
    description:
      "Chat with vendors, request quotes, and save favorites in one place so family and planners can weigh in.",
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
    label: "For couples & planners",
    title: "Organize every detail in one calm view",
    points: [
      "Postcode-first search with cultural tags",
      "Collaborative shortlists for family sign-off",
      "Availability hints and response SLAs",
    ],
    badge: "Customer track",
  },
  {
    label: "For vendors",
    title: "Book the right clients faster",
    points: [
      "Show up in culture-aware searches",
      "Lead inbox with quote templates",
      "Reviews, credentials, and insurance badges",
    ],
    badge: "Vendor track",
  },
];

const assurances = [
  {
    icon: ShieldCheck,
    title: "Verified professionals",
    copy: "Every vendor passes ID, insurance, and quality checks before listing.",
  },
  {
    icon: Users,
    title: "Shared workspaces",
    copy: "Loop in partners, parents, or planners with comment threads that stay organized.",
  },
  {
    icon: Star,
    title: "Transparent reviews",
    copy: "See proof: portfolios, ratings, and cultural specialties are front and center.",
  },
  {
    icon: CalendarCheck,
    title: "Date confidence",
    copy: "Vendors keep calendars fresh, so you avoid dead ends and ghosting.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="">
        {/* Hero */}
        <section className="relative overflow-hidden bg-linear-to-b from-secondary/60 via-background to-background px-4 py-20 sm:px-6 lg:px-8 sm:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-primary/12 blur-[140px]" />
            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-accent/12 blur-[160px]" />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                <Sparkles size={16} className="text-accent" />
                Product walkthrough
              </div>

              <div className="space-y-5">
                <h1 className="text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">
                  See how EVA finds vendors who get your traditions.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                  A guided path from search to booking, designed for modern
                  multicultural celebrations and the pros who serve them.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/search"
                  className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5"
                >
                  Start with search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
                >
                  Become a vendor
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  "Culture-first matching",
                  "Verified professionals",
                  "Shared planning workspace",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[30px] border border-border/80 bg-card/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    The EVA flow
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Four moves from idea to booked
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {flowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="group relative overflow-hidden rounded-[22px] border border-border/70 bg-background/80 p-4 shadow-inner"
                    >
                      <div className="absolute left-0 top-0 h-full w-1 bg-accent/80 opacity-0 transition " />
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                            Step {index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
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

        {/* Dual tracks */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Built for both sides
              </p>
              <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
                One platform, two clear tracks
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Couples get clarity and collaboration; vendors get qualified
                leads who already know their style.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {tracks.map((track) => (
                <div
                  key={track.title}
                  className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card/90 p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                    {track.badge}
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {track.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-foreground">
                    {track.title}
                  </h3>
                  <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                    {track.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Assurances */}
        <section className="relative overflow-hidden bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute top-16 left-12 h-64 w-64 rounded-full bg-accent/15 blur-[140px]" />
            <div className="absolute bottom-10 right-12 h-64 w-64 rounded-full bg-primary/15 blur-[140px]" />
          </div>

          <div className="relative mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Trust the process
              </p>
              <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
                Everything you need to book with confidence
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                EVA keeps quality high and communication clear, so planning
                feels calm—on desktop or mobile.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {assurances.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-lg transition hover:-translate-y-1 hover:border-accent/60"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
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
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-4xl border border-border/60 bg-linear-to-r from-primary via-foreground to-accent text-background shadow-[0_30px_120px_rgba(15,23,42,0.3)]">
            <div className="grid items-center gap-10 px-8 py-12 sm:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-background/70">
                  Ready when you are
                </p>
                <h3 className="text-3xl font-semibold sm:text-4xl">
                  Start your search or join as a vendor today.
                </h3>
                <p className="text-base text-background/80">
                  Whether you are planning for family or growing your bookings,
                  EVA keeps everyone aligned.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="/search"
                    className="inline-flex items-center justify-center rounded-full bg-background px-7 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
                  >
                    Find vendors
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <a
                    href="/auth"
                    className="inline-flex items-center justify-center rounded-full border border-background/50 px-7 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5"
                  >
                    List your business
                  </a>
                </div>
              </div>

              <div className="grid gap-4 rounded-4xl border border-background/20 bg-background/10 p-5 text-sm text-background">
                {[
                  "4.9/5 average vendor rating",
                  "Cultural specialists across 80+ traditions",
                  "Response guidance so vendors reply fast",
                  "Built for mobile planning with family",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-background/15 p-3"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
