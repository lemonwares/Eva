import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {
  Heart,
  MapPin,
  Tag,
  UserCheck,
  Receipt,
  ClipboardList,
  ArrowRight,
  Users,
  Sparkles,
  Eye,
  Globe,
  ShieldCheck,
  Mail,
  Target,
} from "lucide-react";

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

const values = [
  {
    icon: Heart,
    title: "Community First",
    description:
      "We prioritize local connections and community support, helping neighbourhoods thrive through local commerce.",
    iconBg: "bg-gray-100 text-gray-600",
  },
  {
    icon: Sparkles,
    title: "Cultural Respect",
    description:
      "Every tradition matters. We celebrate diversity and ensure vendors understand cultural significance.",
    iconBg: "bg-pink-50 text-pink-500",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    description:
      "Clear GBP pricing, honest reviews, and straightforward terms — no hidden fees or surprises.",
    iconBg: "bg-emerald-50 text-emerald-500",
  },
];

const differentiators = [
  {
    title: "Radius-First Discovery",
    text: "Default 3-mile radius cuts travel costs and time. Find quality vendors right in your neighbourhood.",
  },
  {
    title: "Culture & Tradition Tags",
    text: "Specialised filters ensure vendors understand South Asian, African, Caribbean, Chinese, Middle Eastern, and other cultural ceremonies.",
  },
  {
    title: "Frictionless Vendor Onboarding",
    text: "Social media import makes setup easy. Vendors showcase their best work from Instagram instantly.",
  },
  {
    title: "Transparent GBP Pricing",
    text: "All prices in pounds sterling. Clear quotes with line items, deposits, and payment schedules.",
  },
  {
    title: "Complete Booking Pipeline",
    text: "From inquiry to quote to booking to review — manage everything in one platform.",
  },
];

const team = [
  {
    name: "Abiodun Orhewere",
    role: "Co-Founder & CEO",
    image: "/team-abiodun.png",
    imagePosition: "object-top",
    initials: "AO",
    color: "bg-cyan-100 text-cyan-700",
    bio: "Former event planner with 10+ years experience connecting communities with exceptional local talent.",
  },
  {
    name: "Adebayo Adeleye",
    role: "Head of Technology",
    image: "/adebobo.jpeg",
    imagePosition: "object-top",
    initials: "AA",
    color: "bg-emerald-100 text-emerald-700",
    bio: "Tech innovator passionate about building platforms that empower local businesses and communities.",
  },
  {
    name: "Nana Bakare",
    role: "Community & Culture Lead",
    image: "/team-nana.jpeg",
    imagePosition: "object-top",
    initials: "NB",
    color: "bg-purple-100 text-purple-700",
    bio: "Cultural consultant ensuring EVA celebrates and respects diverse traditions across all communities.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f5f5f7] pb-20 pt-20">

        {/* Hero */}
        <section className="bg-white px-4 pt-32 pb-20 text-center">
          <div className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            About EVA
          </div>
          <h1 className="text-4xl sm:text-6xl font-playfair italic text-[#1e2433] mx-auto max-w-4xl leading-tight mb-6">
            Find Vendors Who Get Your Traditions
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connecting communities with trusted local event vendors, making
            every celebration memorable and stress-free.
          </p>
        </section>

        {/* Our Story — two overlapping images left, text right */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-playfair italic text-[#1e2433] text-center mb-12">
              Our Story
            </h2>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Overlapping images */}
              <div className="relative h-[420px] hidden lg:block">
                <div className="absolute top-0 left-0 w-[58%] h-[72%] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/about-img-1.jpeg"
                    alt="Bride at wedding venue"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-[58%] h-[65%] rounded-2xl overflow-hidden shadow-lg border-4 border-[#f5f5f7]">
                  <Image
                    src="/about-img-2.jpeg"
                    alt="Couple celebrating"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Mobile: single image */}
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg lg:hidden">
                <Image
                  src="/about-img-1.jpeg"
                  alt="Bride at wedding venue"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="space-y-5 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  EVA was born from a simple observation: finding the right event
                  vendors shouldn&apos;t be complicated, expensive, or time-consuming.
                  Too many people struggle to discover talented local professionals
                  who understand their cultural traditions and can work within their
                  budget and location constraints.
                </p>
                <p>
                  We recognised that the best vendors are often right around the
                  corner, not miles away. By focusing on hyper-local discovery
                  within a 3-mile radius, we help clients minimise travel costs and
                  support their local communities. Our platform celebrates cultural
                  diversity with specialised tags for South Asian, African,
                  Caribbean, Chinese, and Middle Eastern traditions, ensuring
                  vendors truly understand what makes each celebration unique.
                </p>
                <p>
                  Today, EVA is transforming how people plan events across London,
                  Manchester, Birmingham, Leeds, and Bristol — with many more cities
                  on the horizon. We&apos;re building a platform where quality vendors
                  thrive and clients find exactly what they need, when they need it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision — side-by-side cards with icon + title inline */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
          <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center shrink-0">
                  <Target size={20} />
                </div>
                <h3 className="text-xl font-playfair font-bold text-[#1e2433]">
                  Our Mission
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                To democratise event planning by connecting clients with
                exceptional local vendors who respect their budget, location, and
                cultural traditions. We believe everyone deserves access to quality
                event services without the hassle of endless searching or breaking
                the bank on travel costs.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-red-50 text-red-400 rounded-full flex items-center justify-center shrink-0">
                  <Eye size={20} />
                </div>
                <h3 className="text-xl font-playfair font-bold text-[#1e2433]">
                  Our Vision
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                To become the UK&apos;s leading hyper-local events marketplace,
                where cultural diversity is celebrated, local talent thrives, and
                every event — from intimate gatherings to grand celebrations — is
                powered by trusted professionals who truly understand their
                communities.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values — list cards left, tall image right */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-playfair italic text-[#1e2433] text-center mb-12">
              Our Values
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Value cards */}
              <div className="space-y-4">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.title}
                      className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-start"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${v.iconBg}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-playfair font-bold text-[#1e2433] text-base mb-1">
                          {v.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {v.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tall image */}
              <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-lg hidden lg:block">
                <Image
                  src="/about-img-3.jpeg"
                  alt="Two women using EVA app"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What Makes EVA Different — numbered list in a single card */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-playfair italic text-[#1e2433] text-center mb-12">
              What Makes EVA Different
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {differentiators.map((d, i) => (
                <div
                  key={i}
                  className={`flex gap-5 p-6 items-start ${
                    i < differentiators.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-[#1e2433] flex items-center justify-center shrink-0 text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-[#1e2433] text-base mb-1">
                      {d.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {d.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <Users size={40} className="text-[#1e2433]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-playfair italic text-[#1e2433] mb-3">
                Our Team
              </h2>
              <p className="text-muted-foreground text-[15px]">
                EVA is built by a passionate team dedicated to transforming event planning
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl p-8 text-center shadow-sm"
                >
                  <div className="mx-auto mb-5 h-36 w-36 rounded-full overflow-hidden">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={144}
                        height={144}
                        className={`object-cover w-full h-full ${member.imagePosition || "object-center"}`}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-3xl font-bold ${member.color}`}>
                        {member.initials}
                      </div>
                    )}
                  </div>
                  <h4 className="font-playfair font-bold text-lg text-[#1e2433] mb-1">
                    {member.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
          <div className="mx-auto max-w-3xl">
            <div className="bg-white rounded-2xl px-8 py-16 text-center shadow-sm">
              <h2 className="text-3xl sm:text-4xl font-playfair italic font-bold text-[#1e2433] leading-tight mb-4">
                Ready to Find Your Perfect Vendor?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-[15px] mb-10">
                Join thousands of clients and vendors across the UK who are making
                celebrations unforgettable with EVA.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0e7490] text-white rounded-lg font-bold hover:bg-[#155e75] transition-colors"
                >
                  Browse Vendors
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/list-your-business"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-gray-200 text-[#1e2433] rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  List Your Business
                </Link>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                Interested in joining our mission?
              </p>
              <a
                href="mailto:hello@evalocal.com"
                className="inline-flex items-center gap-2 text-[#0e7490] text-sm hover:underline"
              >
                <Mail size={15} />
                Get in touch
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
