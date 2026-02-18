"use client";

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Link from "next/link";
import { 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Compass, 
  Filter, 
  HeartHandshake,
  Users,
  Search,
  Award,
  Wallet,
  ChevronRight,
  Sparkles,
  BarChart3,
  CalendarCheck,
  MessageSquare,
  TrendingUp,
  Eye,
  MessageSquareText
} from "lucide-react";
import { motion } from "framer-motion";

const flowSteps = [
  {
    number: "1",
    title: "Tell us what you need",
    description: "Share your ceremony details, budget, and dates. We use your culture and location to find the perfect matches.",
    icon: Search,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    number: "2",
    title: "Compare curated matches",
    description: "Browse verified profiles, portfolios, and authentic reviews. Use specialty filters to find exactly what you need.",
    icon: Filter,
    color: "bg-teal-50 text-teal-600",
  },
  {
    number: "3",
    title: "Message and shortlist",
    description: "Chat directly with vendors, request personalised quotes, and save your favourites to collaborate with family.",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600",
  },
  {
    number: "4",
    title: "Book with confidence",
    description: "Finalise your dates with identity-checked, insured vendors. Keep all confirmations in one secure place.",
    icon: CalendarCheck,
    color: "bg-orange-50 text-orange-600",
  }
];

const customerPoints = [
  { label: "Postcode-first search", desc: "Find vendors within your chosen radius instantly", icon: MapPin },
  { label: "Collaborative shortlists", desc: "Share and plan together with family and friends", icon: Users },
  { label: "Response guidance", desc: "Know what to ask and expect from vendors", icon: MessageSquareText },
];

const vendorPoints = [
  { label: "Culture-aware visibility", desc: "Get seen by clients who value your expertise", icon: Eye },
  { label: "Lead management", desc: "Track inquiries and convert more bookings", icon: TrendingUp },
  { label: "Credential displays", desc: "Showcase your certifications and insurance", icon: Award },
];

const assurances = [
  {
    icon: ShieldCheck,
    title: "Verified professionals",
    copy: "Every vendor passes ID verification and insurance checks before joining EVA.",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
  {
    icon: Users,
    title: "Shared workspaces",
    copy: "Collaborate with family and friends using shared comment threads and shortlists.",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
  {
    icon: Star,
    title: "Transparent reviews",
    copy: "Read authentic reviews from real customers with detailed portfolios and ratings.",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
  {
    icon: CalendarCheck,
    title: "Date confidence",
    copy: "Real-time calendar availability ensures you can book when you need.",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
];

export default function HowItWorksClient() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-foreground font-sans">
      <Header />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-4 pt-32 pb-20 sm:pt-40 sm:pb-32 text-center max-w-7xl mx-auto">
          {/* Background Decorative Blurs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-4xl sm:text-6xl font-playfair italic max-w-4xl mx-auto leading-[1.1] text-[#1e2433]">
              See how EVA finds vendors who get your traditions.
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground/80 leading-relaxed font-medium">
              A guided path from search to booking, designed for modern multicultural celebrations and the pros who serve them.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/search" 
                className="w-full sm:w-auto px-10 py-4 bg-[#1e2433] text-white rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-xl shadow-black/10 text-center"
              >
                Start with search
              </Link>
              <Link
                href="/list-your-business"
                className="w-full sm:w-auto px-10 py-4 border border-border bg-white rounded-xl font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                Become a vendor
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-10 sm:pt-14">
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-100/50 rounded-full">
                <ShieldCheck size={16} className="text-cyan-700" />
                <span className="text-xs sm:text-sm font-medium text-cyan-900">Culture-first matching</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100/50 rounded-full">
                <CheckCircle2 size={16} className="text-emerald-700" />
                <span className="text-xs sm:text-sm font-medium text-emerald-900">Verified professionals</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100/50 rounded-full">
                <Users size={16} className="text-purple-700" />
                <span className="text-xs sm:text-sm font-medium text-purple-900">Shared planning workspace</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* The Process Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-xs font-bold uppercase tracking-wider">
                The EVA Flow
              </span>
              <h2 className="text-3xl sm:text-5xl font-playfair italic text-[#1e2433]">
                Four simple steps to your perfect vendor
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground/80 font-medium">
                From sharing your needs to confirming your booking, we make every step seamless.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {flowSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group p-8 rounded-3xl border border-transparent bg-[#fafafa] hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <span className="text-6xl font-sans font-bold text-accent/10 mb-6 transition-colors group-hover:text-accent/20">
                      {step.number}
                    </span>
                    
                    <div className={`w-14 h-14 ${step.color} rounded-full flex items-center justify-center mb-6 shadow-sm`}>
                      <Icon size={24} />
                    </div>
                    
                    <h3 className="text-lg font-playfair italic font-semibold text-[#1e2433] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground/80 leading-relaxed text-sm font-medium">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* For Customers & Vendors Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-xs font-bold uppercase tracking-wider">
                Built for Both Sides
              </span>
              <h2 className="text-3xl sm:text-5xl font-playfair italic text-[#1e2433]">
                Designed for customers and vendors alike
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground/80 font-medium">
                Whether you&apos;re planning a celebration or running a business, EVA has tools made for you.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
              {/* For Customers */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[40px] bg-white border border-transparent shadow-xl shadow-black/2 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center">
                    <Search size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-playfair italic text-[#1e2433]">For Customers</h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground/80 mb-10 leading-relaxed font-medium">
                  Find the right vendors for your celebration with intelligent matching, collaborative tools, and trusted reviews.
                </p>

                <div className="space-y-6 flex-1">
                  {customerPoints.map((point, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                        <point.icon size={18} className="text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">{point.label}</h4>
                        <p className="text-sm text-muted-foreground/80">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/search"
                  className="mt-12 w-fit px-8 py-4 bg-[#0097b2] text-white rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-900/10"
                >
                  Find vendors
                  <ArrowRight size={18} />
                </Link>
              </motion.div>

              {/* For Vendors */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[40px] bg-white border border-transparent shadow-xl shadow-black/2 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-playfair italic text-[#1e2433]">For Vendors</h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground/80 mb-10 leading-relaxed font-medium text-base">
                  Grow your business with qualified leads, showcase your expertise, and connect with clients who value your work.
                </p>

                <div className="space-y-6 flex-1">
                  {vendorPoints.map((point, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <point.icon size={18} className="text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">{point.label}</h4>
                        <p className="text-sm text-muted-foreground/80">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/list-your-business"
                  className="mt-12 w-fit px-8 py-4 bg-[#1e2433] text-white rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-black/10"
                >
                  List your business
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Transparency & Trust Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-border/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Trust the Process
              </span>
              <h2 className="text-3xl sm:text-5xl font-playfair italic text-[#1e2433]">
                Built on trust, designed for peace of mind
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground/80 font-medium">
                Every feature is designed to give you confidence throughout your planning journey.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {assurances.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-[24px] border border-transparent bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all"
                  >
                    <div className={`w-12 h-12 ${item.bg} ${item.iconColor} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-playfair font-bold text-[#1e2433] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                      {item.copy}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ready to start planning */}
        <section className="py-32 px-4 text-center bg-[#fafafa] relative overflow-hidden">
          {/* Bottom Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-cyan-50/50 to-transparent pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-10 relative"
          >
            <h2 className="text-4xl sm:text-6xl font-playfair italic text-[#1e2433]">
              Ready to start planning?
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
              Join thousands of customers and vendors who trust EVA for their celebrations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/search" 
                className="w-full sm:w-auto px-8 py-3 bg-[#0097b2] text-white rounded-lg font-bold shadow-xl shadow-cyan-900/10 hover:scale-[1.02] transition-transform text-base flex items-center justify-center gap-2"
              >
                <Search size={18} strokeWidth={2.5} />
                Find vendors
              </Link>
              <Link 
                href="/list-your-business" 
                className="w-full sm:w-auto px-8 py-3 border border-[#0097b2] text-[#0097b2] bg-white rounded-lg font-bold hover:bg-cyan-50 transition-all text-base"
              >
                List your business
              </Link>
            </div>

            {/* Stats Pill */}
            <div className="pt-8 flex justify-center">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-6 px-4 sm:px-12 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 items-center">
                {[
                  { label: "VENDOR RATING", value: "4.9/5" },
                  { label: "CULTURAL SPECIALTIES", value: "80+" },
                  { label: "RESPONSE GUIDANCE", value: "24hr" },
                  { label: "MOBILE PLANNING", value: "100%" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1 text-center">
                    <div className="text-xl sm:text-2xl font-playfair font-black text-[#1e2433]">{stat.value}</div>
                    <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
