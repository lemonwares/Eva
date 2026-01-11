"use client";

import LoginForm from "@/components/auth/login-form";
import SignUpForm from "@/components/auth/signup-form";
import { Sparkles, Home } from "lucide-react";
import { useState, Suspense } from "react";
import Link from "next/link";

const tabs: { key: "login" | "signup"; label: string; description: string }[] =
  [
    { key: "login", label: "Sign in", description: "Welcome back" },
    { key: "signup", label: "Create account", description: "Join EVA" },
  ];

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-16 h-72 w-72 rounded-full bg-accent/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-secondary/80 to-transparent" />
      </div>

      {/* Home navigation link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:bg-card hover:text-foreground hover:border-accent/50"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-4xl border border-border bg-card/90 shadow-[0_30px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          {/* Brand / Story panel */}
          <div className="relative hidden bg-linear-to-b from-secondary via-card to-card p-12 lg:flex lg:flex-col lg:justify-between overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                <Sparkles size={16} className="text-accent" />
                Trusted Vendors
              </div>
              <h1 className="mt-8 text-4xl font-semibold leading-tight text-foreground">
                Book incredible vendors with confidence.
              </h1>
              <p className="mt-4 text-base text-muted-foreground">
                EVA connects clients with curated professionals across
                decoration, catering, planning, photography, and beyond. Manage
                every detail in one calm, collaborative workspace.
              </p>
            </div>

            {/* Featured Image */}
            <div className="relative z-10 my-8 rounded-2xl overflow-hidden border border-border shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=300&fit=crop"
                alt="Wedding celebration"
                className="w-full h-48 object-cover"
              />
            </div>

            <div className="relative z-10 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                { stat: "100+", label: "Verified vendors" },
                { stat: "4.9/5", label: "Average review rating" },
                { stat: "24 hrs", label: "Quote turnaround" },
                { stat: "99%", label: "Client satisfaction" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-card/70 p-4"
                >
                  <div className="text-2xl font-semibold text-foreground">
                    {item.stat}
                  </div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form panel */}
          <div className="bg-card p-8 text-foreground sm:p-10">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Access EVA
              </p>
              <h2 className="text-3xl font-semibold text-foreground">
                Plan, collaborate, and book in minutes
              </h2>
              <p className="text-muted-foreground">
                One account unlocks premium tools for both clients and vendors.
              </p>
            </div>

            <div className="mt-8 flex rounded-2xl border border-border bg-secondary/50 p-1 text-sm font-medium">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 rounded-xl px-4 py-3 text-left transition-all ${
                    activeTab === tab.key
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div>{tab.label}</div>
                  <p className="text-xs text-muted-foreground">
                    {tab.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="h-40 animate-pulse bg-secondary/50 rounded-xl"></div>
                }
              >
                {activeTab === "login" ? <LoginForm /> : <SignUpForm />}
              </Suspense>
            </div>

            <p className="mt-10 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-accent hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
