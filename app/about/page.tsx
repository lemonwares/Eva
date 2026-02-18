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
  TrendingUp,
  Users,
  Sparkles,
  Eye,
  Globe,
  ShieldCheck,
  Mail,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Community First",
    description:
      "We believe in supporting local. Every connection on EVA strengthens neighbourhood trade and keeps the heart of your community thriving.",
    bg: "bg-red-50 text-red-500",
  },
  {
    icon: Globe,
    title: "Cultural Respect",
    description:
      "Your celebration reflects your heritage. We celebrate diverse traditions and ensure vendors understand the cultural nuances that matter to you.",
    bg: "bg-indigo-50 text-indigo-500",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    description:
      "Clear GBP pricing, honest reviews, and straightforward terms — no hidden fees or surprises. What you see is what you get.",
    bg: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: Sparkles,
    title: "Trust",
    description: "Every vendor is vetted and verified. We prioritize safety and reliability, so you can book with confidence.",
     bg: "bg-amber-50 text-amber-500"
  },
].slice(0, 3);

const differentiators = [
  {
    icon: MapPin,
    title: "Radius-First Discovery",
    text: "Find vendors within your area first. We prioritise proximity so you get local talent who knows your neighbourhood.",
    bg: "bg-cyan-50 text-cyan-700"
  },
  {
    icon: Tag,
    title: "Culture & Tradition Tags",
    text: "Filter by South Asian, African, Caribbean, Chinese, Middle Eastern, and more. Find vendors who truly understand your celebration.",
    bg: "bg-pink-50 text-pink-700"
  },
  {
    icon: UserCheck, // Or Zap if preferred
    title: "Frictionless Vendor Onboarding",
    text: "Vendors can set up their profile and start receiving enquiries in minutes, not weeks.",
    bg: "bg-emerald-50 text-emerald-700"
  },
  {
    icon: Receipt, // Or PoundSterling
    title: "Transparent GBP Pricing",
    text: "All prices displayed in British Pounds with no hidden fees. Compare vendors fairly and confidently.",
    bg: "bg-purple-50 text-purple-700"
  },
  {
    icon: ClipboardList,
    title: "Complete Booking Pipeline",
    text: "From discovery to deposit, manage the entire booking journey in one place — enquiries, quotes, and secure payments.",
    bg: "bg-orange-50 text-orange-700"
  },
];

const team = [
  {
    name: "Omonlua Orhewere",
    role: "Co-founder & CEO",
    initials: "OO",
    color: "bg-cyan-100 text-cyan-700",
    bio: "Former event planner with 10+ years experience connecting communities with exceptional local talent.",
  },
  {
    name: "Adebayo Adeleye",
    role: "Head of Technology",
    initials: "AA",
    color: "bg-emerald-100 text-emerald-700",
    bio: "Tech innovator passionate about building platforms that empower local businesses and communities.",
  },
  {
    name: "Nana Bakare",
    role: "Community & Culture Lead",
    initials: "NB",
    color: "bg-purple-100 text-purple-700",
    bio: "Cultural ambassador dedicated to celebrating and respecting diverse traditions across all communities.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-20 pt-20">
        {/* Hero */}
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
        {/* Built from a Real Need */}
        {/* Built from a Real Need */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left Content */}
              <div>
                <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  Our Story
                </div>
                <h2 className="text-3xl sm:text-4xl font-playfair italic text-[#1e2433] mb-8">
                  Built from a Real Need
                </h2>
                
                <div className="space-y-6 text-muted-foreground/80 leading-relaxed font-medium">
                  <p>
                    We recognised a fundamental challenge: finding qualified event
                    vendors shouldn&apos;t demand excessive time, expense, or
                    complexity. The best vendors are often right around the corner —
                    neighbourhood professionals who understand cultural traditions
                    and respect your budget.
                  </p>
                  <p>
                    But clients were often stuck searching within a 25-mile radius,
                    scrolling through endless generic listings with no way to filter
                    by the traditions and cultural understanding that matter most
                    for their celebrations.
                  </p>
                  <p>
                    That&apos;s why we built EVA — a hyper-local events marketplace
                    that puts community, culture, and convenience at the centre of
                    every connection.
                  </p>
                </div>
              </div>

              {/* Right Card */}
              <div className="bg-cyan-50/50 rounded-[32px] p-8 sm:p-10">
                <div className="space-y-10">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-cyan-600">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1e2433] text-lg mb-1">Currently Live</h3>
                      <p className="text-cyan-900/70 font-medium text-sm">London, Manchester, Birmingham, Leeds & Bristol</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-cyan-600">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1e2433] text-lg mb-1">Expanding Soon</h3>
                      <p className="text-cyan-900/70 font-medium text-sm">More UK cities coming in 2026</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-cyan-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1e2433] text-lg mb-1">Community Focused</h3>
                      <p className="text-cyan-900/70 font-medium text-sm">Supporting neighbourhood vendors and local talent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Mission & Vision */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
          <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2">
            
            <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mb-6">
                 <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-playfair italic font-bold text-[#1e2433] mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground/80 leading-relaxed font-medium">
                To democratise event planning by connecting clients with
                exceptional local vendors who meet their budget, location, and
                cultural needs — making quality event services accessible to
                everyone, everywhere.
              </p>
            </div>

            <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                 <Eye size={24} />
              </div>
              <h3 className="text-2xl font-playfair italic font-bold text-[#1e2433] mb-4">
                Our Vision
              </h3>
              <p className="text-muted-foreground/80 leading-relaxed font-medium">
                To become the UK&apos;s leading hyper-local events marketplace,
                where cultural diversity is celebrated, every local talent
                thrives, and every celebration is exactly as it should be.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-border/30">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 space-y-4">
               <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Our Values
               </span>
              <h2 className="text-3xl sm:text-5xl font-playfair italic text-[#1e2433]">
                What We Stand For
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground/80 font-medium">
                Every decision we make is guided by these core principles.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <article
                    key={v.title}
                    className="group bg-[#fafafa] rounded-[32px] p-10 hover:bg-white hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-14 h-14 ${v.bg} rounded-2xl flex items-center justify-center mb-8`}>
                      <Icon size={26} />
                    </div>
                    <h3 className="text-xl font-playfair font-bold text-[#1e2433] mb-4">
                      {v.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                      {v.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* What Makes EVA Different */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 space-y-4">
               <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Why EVA
               </span>
              <h2 className="text-3xl sm:text-5xl font-playfair italic text-[#1e2433]">
                What Makes EVA Different
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground/80 font-medium">
                We&apos;re not just another vendor directory. Here&apos;s what sets us apart.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {differentiators.map((d, i) => {
                const Icon = d.icon;
                return (
                  <div
                    key={i}
                    className="p-8 rounded-[24px] bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all"
                  >
                    <div className={`w-12 h-12 ${d.bg} rounded-full flex items-center justify-center mb-6`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-playfair font-bold text-[#1e2433] mb-3">
                      {d.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                      {d.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-border/30">
          <div className="mx-auto max-w-7xl text-center">
             <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                Our Team
             </span>
            <h2 className="text-3xl sm:text-5xl font-playfair italic text-[#1e2433] mb-4">
              Meet the Leadership
            </h2>
            <p className="text-muted-foreground/80 font-medium mb-16 max-w-2xl mx-auto">
              We&apos;re united by a single goal: making quality event services
              accessible to everyone, everywhere.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-[#fafafa] rounded-[32px] p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className={`mx-auto mb-6 h-20 w-20 flex items-center justify-center rounded-full text-2xl font-bold tracking-wider ${member.color}`}>
                    {member.initials}
                  </div>
                  <h4 className="font-playfair font-bold text-xl text-[#1e2433] mb-1">
                    {member.name}
                  </h4>
                  <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-white py-20">
          <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="bg-cyan-50/50 rounded-[40px] px-8 py-20 text-center relative overflow-hidden border border-cyan-100/50">
              
              <h2 className="text-3xl sm:text-5xl font-playfair italic font-bold text-[#1e2433] leading-tight mb-6">
                Ready to Find Your Perfect Vendor?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium text-lg mb-10">
                Join thousands of clients and vendors across the UK who are making
                celebrations unforgettable with EVA.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Link href="/search" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0e7490] text-white rounded-lg font-bold hover:bg-[#155e75] transition-colors shadow-lg shadow-cyan-900/10">
                  Browse Vendors
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/list-your-business"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-gray-200 text-[#1e2433] rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm"
                >
                  List Your Business
                </Link>
              </div>

              <div className="text-sm font-medium text-muted-foreground/80">
                <p className="mb-2">Interested in joining our mission?</p>
                <a href="mailto:hello@eva-local.co.uk" className="inline-flex items-center gap-2 text-[#0e7490] hover:underline">
                  <Mail size={16} />
                  Get in touch
                </a>
              </div>
            </div>
          </section>
        </div>{" "}
      </main>
      <Footer />
    </>
  );
}
