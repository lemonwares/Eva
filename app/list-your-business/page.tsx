import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header";
import {
  Users,
  Shield,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "List Your Business | EVA Local",
  description:
    "Join the UK's multicultural events marketplace. List your business on EVA Local and connect with clients looking for your services.",
};

export default function ListYourBusinessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="bg-linear-to-b from-teal-light/40 to-background px-4 pt-28 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl sm:text-5xl text-foreground">
              Grow your business with EVA&nbsp;Local
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of vendors reaching customers in their community.
              Get discovered, manage bookings, and build your reputation — all
              in one place.
            </p>
            <Link
              href="/auth?tab=signup&type=PROFESSIONAL"
              className="btn-eva-primary rounded-full mt-8 inline-flex"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl text-foreground text-center mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              We give you the tools to focus on what you do best — delivering
              amazing experiences.
            </p>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "Reach Local Customers",
                  desc: "Connect with clients actively searching for services like yours in their area.",
                },
                {
                  icon: Shield,
                  title: "Secure Payments",
                  desc: "Get paid safely through our secure payment system with guaranteed deposits.",
                },
                {
                  icon: LayoutDashboard,
                  title: "Manage Everything",
                  desc: "Handle inquiries, quotes, and bookings all in one dashboard.",
                },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="card-float rounded-2xl p-8 text-center"
                  >
                    <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-light">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3
                      className="text-lg font-semibold text-foreground"
                      style={{ fontStyle: "normal" }}
                    >
                      {b.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream/30">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl text-foreground text-center mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">
              Getting started takes just a few minutes. Here&apos;s what to
              expect.
            </p>

            <div className="relative grid gap-12 sm:grid-cols-3">
              <div className="absolute top-7 left-[16.5%] right-[16.5%] hidden h-0.5 bg-primary/20 sm:block" />
              {[
                {
                  step: "01",
                  title: "Create Your Profile",
                  desc: "Add your business details, photos, and services to showcase what makes you unique.",
                },
                {
                  step: "02",
                  title: "Get Verified",
                  desc: "Our team reviews and verifies your business to build trust with potential clients.",
                },
                {
                  step: "03",
                  title: "Start Receiving Inquiries",
                  desc: "Clients find you and send booking requests — you choose the ones that fit.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-lg">
                    {s.step}
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold text-foreground"
                    style={{ fontStyle: "normal" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground mb-10">
              No surprises. You only pay when you earn.
            </p>

            <div className="space-y-4 mb-10">
              {[
                "Free to list, only pay when you get booked",
                "15% commission on completed bookings",
                "No monthly fees, no hidden costs",
              ].map((line) => (
                <div
                  key={line}
                  className="flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground font-medium">{line}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth?tab=signup&type=PROFESSIONAL"
              className="btn-eva-primary rounded-full inline-flex"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ── Testimonial ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cream/30">
          <div className="mx-auto max-w-3xl">
            <blockquote className="text-center">
              <p className="text-lg text-foreground/90 leading-relaxed italic">
                &ldquo;Since joining EVA Local, my bookings have increased by
                40%. The platform makes it so easy to manage everything — from
                inquiries to payments. I can focus on what I love doing.&rdquo;
              </p>
              <footer className="mt-6 flex items-center justify-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                  alt="Amara Osei"
                  width={48}
                  height={48}
                  unoptimized
                  className="rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Amara Osei</p>
                  <p className="text-sm text-muted-foreground">
                    Photographer · London
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl text-foreground mb-4">
              Ready to grow your business?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join EVA Local today and start connecting with customers in your
              area. It only takes a few minutes to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/auth?tab=signup&type=PROFESSIONAL"
                className="btn-eva-primary rounded-full"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="btn-eva-outline rounded-full"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* ── Minimal Footer ── */}
        <footer className="border-t border-border py-6 px-4">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 EVA Local. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-primary transition">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-primary transition">
                Privacy
              </Link>
              <Link href="/" className="hover:text-primary transition">
                Home
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
