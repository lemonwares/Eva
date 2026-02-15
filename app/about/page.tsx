import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "About EVA Local",
  description:
    "EVA Local is the UK's multicultural events marketplace. We connect communities with trusted local vendors for weddings, birthdays, cultural celebrations, and more.",
  openGraph: {
    title: "About EVA Local",
    description:
      "The UK's multicultural events marketplace — connecting communities with trusted local vendors.",
    url: "/about",
  },
  alternates: {
    canonical: "/about",
  },
};
import {
  Heart,
  PartyPopper,
  Search,
  MapPin,
  Tag,
  UserCheck,
  Receipt,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Community First",
    description:
      "We prioritise local involvement and community support, helping neighbourhoods thrive through local trade.",
    bg: "bg-blush",
  },
  {
    icon: PartyPopper,
    title: "Cultural Respect",
    description:
      "Every tradition matters. We celebrate diversity and ensure vendors understand cultural significance.",
    bg: "bg-lavender",
  },
  {
    icon: Search,
    title: "Transparency",
    description:
      "Clear GBP pricing, honest reviews, and straightforward terms — no hidden fees or surprises.",
    bg: "bg-mint",
  },
];

const differentiators = [
  {
    icon: MapPin,
    title: "Radius-First Discovery",
    text: "Find vendors within your area first. We prioritise proximity so you get local talent who knows your neighbourhood.",
  },
  {
    icon: Tag,
    title: "Culture & Tradition Tags",
    text: "Filter by South Asian, African, Caribbean, Chinese, Middle Eastern, and more. Find vendors who truly understand your celebration.",
  },
  {
    icon: UserCheck,
    title: "Frictionless Vendor Onboarding",
    text: "Vendors can set up their profile and start receiving enquiries in minutes, not weeks.",
  },
  {
    icon: Receipt,
    title: "Transparent GBP Pricing",
    text: "All prices displayed in British Pounds with no hidden fees. Compare vendors fairly and confidently.",
  },
  {
    icon: ClipboardList,
    title: "Complete Booking Pipeline",
    text: "From discovery to deposit, manage the entire booking journey in one place — enquiries, quotes, and secure payments.",
  },
];

const team = [
  {
    name: "Omonlua Orhewere",
    role: "Co-founder & CEO",
    image: "/team-abiodun.png",
    bio: "Former event planner with 10+ years connecting communities with exceptional local talent.",
  },
  {
    name: "Adebayo Adeleye",
    role: "Head of Technology",
    image: "/team-adebayo.jpeg",
    bio: "Tech innovator passionate about building platforms that empower local businesses and communities.",
  },
  {
    name: "Nana Bakare",
    role: "Community & Culture Lead",
    image: "/team-nana.jpeg",
    bio: "Cultural ambassador celebrating and respecting diverse traditions across all communities.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-20 pt-20">
        {/* Hero */}
        <section className="bg-linear-to-b from-teal-light/40 to-background px-4 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
            About EVA
          </p>
          <h1 className="text-4xl sm:text-5xl text-foreground mx-auto max-w-3xl">
            Find Vendors Who Get Your Traditions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Connecting communities with trusted local event vendors, making
            every celebration memorable and stress-free.
          </p>
        </section>
        {/* Built from a Real Need */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
                Our Story
              </p>
              <h2 className="text-3xl text-foreground">
                Built from a Real Need
              </h2>
            </div>

            <div className="mx-auto max-w-3xl space-y-5 mb-12">
              <p className="text-muted-foreground leading-relaxed">
                We recognised a fundamental challenge: finding qualified event
                vendors shouldn&apos;t demand excessive time, expense, or
                complexity. The best vendors are often right around the corner —
                neighbourhood professionals who understand cultural traditions
                and respect your budget.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                But clients were often stuck searching within a 25-mile radius,
                scrolling through endless generic listings with no way to filter
                by the traditions and cultural understanding that matter most
                for their celebrations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                That&apos;s why we built EVA — a hyper-local events marketplace
                that puts community, culture, and convenience at the centre of
                every connection.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 mb-12">
              <div className="card-float rounded-2xl p-6 text-center">
                <p className="text-sm font-semibold text-primary">
                  Currently Live
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  London, Manchester, Birmingham, Leeds &amp; Bristol
                </p>
              </div>
              <div className="card-float rounded-2xl p-6 text-center">
                <p className="text-sm font-semibold text-primary">
                  Expanding Soon
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  More UK cities coming in 2026
                </p>
              </div>
              <div className="card-float rounded-2xl p-6 text-center">
                <p className="text-sm font-semibold text-primary">
                  Community Focused
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  Supporting neighbourhood vendors and local talent
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Mission & Vision */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cream/30">
          <div className="mx-auto max-w-5xl grid gap-8 sm:grid-cols-2">
            <div className="card-float rounded-2xl p-8">
              <h3
                className="text-xl font-semibold text-foreground"
                style={{ fontStyle: "normal" }}
              >
                Our Mission
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                To democratise event planning by connecting clients with
                exceptional local vendors who meet their budget, location, and
                cultural needs — making quality event services accessible to
                everyone, everywhere.
              </p>
            </div>
            <div className="card-float rounded-2xl p-8">
              <h3
                className="text-xl font-semibold text-foreground"
                style={{ fontStyle: "normal" }}
              >
                Our Vision
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                To become the UK&apos;s leading hyper-local events marketplace,
                where cultural diversity is celebrated, every local talent
                thrives, and every celebration is exactly as it should be.
              </p>
            </div>
          </div>
        </section>
        {/* Our Values */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
                Our Values
              </p>
              <h2 className="text-3xl text-foreground">What We Stand For</h2>
              <p className="mt-3 text-muted-foreground">
                Every decision we make is guided by these core principles.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <article
                    key={v.title}
                    className="card-float rounded-2xl p-8 text-center"
                  >
                    <div
                      className={`mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${v.bg}`}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3
                      className="text-lg font-semibold text-foreground"
                      style={{ fontStyle: "normal" }}
                    >
                      {v.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {v.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        {/* What Makes EVA Different */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cream/30">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
                Why EVA
              </p>
              <h2 className="text-3xl text-foreground">
                What Makes EVA Different
              </h2>
              <p className="mt-3 text-muted-foreground">
                We&apos;re not just another vendor directory. Here&apos;s what
                sets us apart.
              </p>
            </div>
            <div className="space-y-4">
              {differentiators.map((d, i) => {
                const Icon = d.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm border border-border/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3
                        className="text-base font-semibold text-foreground"
                        style={{ fontStyle: "normal" }}
                      >
                        {d.title}
                      </h3>
                      <p className="mt-1 text-muted-foreground leading-relaxed">
                        {d.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Team */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-2">
              Our Team
            </p>
            <h2 className="text-3xl text-foreground mb-4">
              Meet the Leadership
            </h2>
            <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
              We&apos;re united by a single goal: making quality event services
              accessible to everyone, everywhere.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="card-float rounded-2xl p-6 text-center"
                >
                  <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-teal-light">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    {member.name}
                  </h4>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl bg-[#1e2433] px-8 py-14 text-center text-white">
            <h2 className="text-3xl font-bold" style={{ color: "white" }}>
              Ready to Find Your Perfect Vendor?
            </h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              Join thousands of clients and vendors across the UK who are making
              celebrations unforgettable with EVA.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/search" className="btn-eva-primary rounded-full">
                Browse Vendors
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/list-your-business"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                List Your Business
              </Link>
            </div>
            <p className="mt-6 text-white/60 text-sm">
              Interested in joining our mission?{" "}
              <a
                href="mailto:hello@eva-local.co.uk"
                className="text-primary hover:underline"
              >
                Get in touch
              </a>
            </p>
          </div>
        </section>{" "}
      </main>
      <Footer />
    </>
  );
}
