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
  CalendarCheck
} from "lucide-react";
import { motion } from "framer-motion";

const flowSteps = [
  {
    number: "1",
    title: "Tell us what you need",
    description: "Describe your ceremony type, budget range, and dates. We match by culture, postcode, and capacity so you only see relevant vendors.",
    icon: Compass,
    color: "bg-blue-50 text-blue-600",
  },
  {
    number: "2",
    title: "Compare matched vendors",
    description: "Review potential vendors who specialize in your culture. Browse verified profiles, portfolios, and reviews side-by-side.",
    icon: Filter,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    number: "3",
    title: "Experience & Select",
    description: "Chat with vendors, review profiles, and choose your favorite. Experience proof: portfolios, ratings, and cultural specialities.",
    icon: HeartHandshake,
    color: "bg-purple-50 text-purple-600",
  },
  {
    number: "4",
    title: "Book & Start Planning",
    description: "Secure your booking and start planning your event. Vendors keep calendars fresh, so you avoid dead ends and ghosting.",
    icon: CheckCircle2,
    color: "bg-amber-50 text-amber-600",
  }
];

const customerPoints = [
  { label: "Postcode-first search", desc: "Find vendors within your chosen radius instantly", icon: MapPin },
  { label: "Collaborative shortlists", desc: "Share and plan together with family and friends", icon: Users },
  { label: "Response guidance", desc: "Know what to ask and expect from vendors", icon: Star },
];

const vendorPoints = [
  { label: "Culture-aware visibility", desc: "Get seen by clients who value your expertise", icon: Sparkles },
  { label: "Lead management", desc: "Track inquiries and convert more bookings", icon: BarChart3 },
  { label: "Credential displays", desc: "Showcase your certifications and insurance", icon: Award },
];

const assurances = [
  {
    icon: ShieldCheck,
    title: "Verified professionals",
    copy: "Every vendor passes ID, insurance, and quality checks before listing.",
    bg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: Users,
    title: "Shared workspaces",
    copy: "Loop in partners, parents, or organisers with comment threads that stay organised.",
    bg: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    icon: Star,
    title: "Transparent reviews",
    copy: "See proof: portfolios, ratings, and cultural specialities are front and centre.",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    icon: CalendarCheck,
    title: "Date confidence",
    copy: "Vendors keep calendars fresh, so you avoid dead ends and ghosting.",
    bg: "bg-amber-50",
    iconColor: "text-amber-600"
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
            <h1 className="text-4xl sm:text-6xl font-playfair max-w-4xl mx-auto leading-[1.1] text-[#1e2433]">
              See how EVA finds vendors who get your traditions.
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground/80 leading-relaxed font-medium">
              Simplified find vendors for your traditions. Effortless connection to your traditions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/search" 
                className="w-full sm:w-auto px-10 py-4 bg-[#1e2433] text-white rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-xl shadow-black/10 text-center"
              >
                Start a search
              </Link>
              <button 
                className="w-full sm:w-auto px-10 py-4 border border-border bg-white rounded-xl font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                Learn more
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-12 sm:pt-16">
              {[
                { icon: ShieldCheck, label: "Culture-first matching" },
                { icon: Award, label: "Verified Professionals" },
                { icon: Wallet, label: "Secure planning & payment" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-full shadow-sm border border-border/40">
                  <item.icon size={18} className="text-accent" />
                  <span className="text-xs sm:text-sm font-bold text-foreground/70 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* The Process Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                The Process
              </span>
              <h2 className="text-3xl sm:text-5xl font-playfair text-[#1e2433]">
                Four simple steps to your perfect vendor
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground/80 font-medium">
                Focusing on your unique cultural needs instead of just providing a list of vendors.
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
                    className="relative group p-8 rounded-3xl border border-border/50 bg-[#fafafa] hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-300"
                  >
                    <span className="absolute top-4 right-8 text-7xl font-sans font-black text-foreground/[0.03] transition-colors group-hover:text-accent/5">
                      {step.number}
                    </span>
                    
                    <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm`}>
                      <Icon size={24} />
                    </div>
                    
                    <h3 className="text-xl font-playfair font-semibold text-[#1e2433] mb-3">
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
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                Built for Both Sides
              </span>
              <h2 className="text-3xl sm:text-5xl font-playfair text-[#1e2433]">
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
                className="p-10 rounded-[40px] bg-white border border-border/40 shadow-xl shadow-black/[0.02] flex flex-col"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
                    <Users size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-playfair text-[#1e2433]">For Customers</h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground/80 mb-10 leading-relaxed font-medium">
                  Finding the perfect vendor from the comfort of your home. It&apos;s affordable, fast and reliable.
                </p>

                <div className="space-y-6 flex-1">
                  {customerPoints.map((point, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center shrink-0">
                        <point.icon size={18} className="text-accent" />
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
                  className="mt-12 w-fit px-8 py-4 bg-accent text-white rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform"
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
                className="p-10 rounded-[40px] bg-[#1e2433] text-white flex flex-col"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                    <Star size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-playfair text-white">For Vendors</h3>
                  </div>
                </div>
                
                <p className="text-white/70 mb-10 leading-relaxed font-medium text-base">
                  Grow your business with qualified leads, showcase your expertise, and connect with clients who value your work.
                </p>

                <div className="space-y-6 flex-1">
                  {vendorPoints.map((point, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <point.icon size={18} className="text-white/80" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">{point.label}</h4>
                        <p className="text-sm text-white/50">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/list-your-business"
                  className="mt-12 w-fit px-8 py-4 bg-white text-[#1e2433] rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform"
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
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                Transparency & Trust
              </span>
              <h2 className="text-3xl sm:text-4xl font-playfair text-[#1e2433]">
                Built on trust, designed for peace of mind
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground/80 font-medium">
                Every feature built with you in mind. No hidden fees, just your culture at the forefront.
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
                    className="p-8 rounded-[32px] border border-border/40 bg-[#fafafa] hover:shadow-xl transition-shadow"
                  >
                    <div className={`w-12 h-12 ${item.bg} ${item.iconColor} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-[#1e2433] mb-2 uppercase tracking-tight">
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
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-accent/5 to-transparent pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-10 relative"
          >
            <h2 className="text-4xl sm:text-6xl font-playfair text-[#1e2433]">
              Ready to start planning?
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
              Join thousands of customers and vendors who trust EVA for their celebrations. Effortless connection to your traditions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/search" 
                className="w-full sm:w-auto px-12 py-5 bg-accent text-white rounded-2xl font-bold shadow-2xl shadow-accent/20 hover:scale-[1.02] transition-transform text-lg flex items-center justify-center gap-2"
              >
                <Search size={22} strokeWidth={2.5} />
                Find a vendor
              </Link>
              <Link 
                href="/list-your-business" 
                className="w-full sm:w-auto px-12 py-5 border-2 border-accent text-accent bg-transparent rounded-2xl font-bold hover:bg-accent hover:text-white transition-all text-lg"
              >
                List your business
              </Link>
            </div>

            {/* Stats */}
            <div className="pt-20 grid grid-cols-2 sm:grid-cols-4 gap-12 sm:gap-4 border-t border-border/50 max-w-2xl mx-auto">
              {[
                { label: "VENDOR RATING", value: "4.9/5" },
                { label: "CULTURAL SPECIALTIES", value: "80+" },
                { label: "RESPONSE GUIDANCE", value: "24hr" },
                { label: "MOBILE PLANNING", value: "100%" }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-2xl font-playfair font-black text-[#1e2433]">{stat.value}</div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
