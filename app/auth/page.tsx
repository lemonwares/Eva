"use client";

import LoginForm from "@/components/auth/login-form";
import SignUpForm from "@/components/auth/signup-form";
import { Home, Check } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function AuthPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const initialType =
    searchParams.get("type") === "PROFESSIONAL" ? "PROFESSIONAL" : undefined;
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Top bar - Hidden on mobile to avoid overlap */}
      <div className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 hidden sm:block">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/images/brand/eva-logo-light.png"
            alt="EVA Local"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:py-20">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card/90 shadow-xl lg:grid-cols-2">
          {/* Mobile brand strip — visible below lg */}
          <div className="flex items-center justify-center gap-3 bg-linear-to-r from-[#0097b2] to-[#007a91] px-6 py-4 text-white lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-lg font-bold">
              E
            </div>
            <div>
              <p className="font-sans text-base font-bold leading-tight">
                EVA Local
              </p>
              <p className="text-xs text-white/70">
                Discover &amp; book event vendors
              </p>
            </div>
          </div>

          {/* Brand panel (desktop) */}
          <div className="relative hidden lg:flex flex-col items-center justify-center bg-linear-to-br from-[#0097b2] via-[#007a91] to-[#005f6b] p-12 text-white overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute top-1/4 right-8 w-24 h-24 rounded-full bg-white/10" />

            {/* Content */}
            <div className="relative z-10 text-center space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm">
                <span className="text-4xl font-bold">E</span>
              </div>

              <div className="space-y-3">
                <h2 className="font-sans text-3xl font-bold tracking-tight">
                  EVA Local
                </h2>
                <p className="text-lg text-white/80 max-w-xs mx-auto leading-relaxed">
                  Your trusted marketplace to discover and book the best local
                  event vendors.
                </p>
              </div>

              {/* Feature bullets */}
              <div className="space-y-4 text-left max-w-xs mx-auto">
                {[
                  "Browse verified vendors near you",
                  "Get instant quotes and book with ease",
                  "Read real reviews from happy clients",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white/90">{text}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-white/50 pt-4">
                Trusted by vendors and clients across the country
              </p>
            </div>
          </div>

          {/* Form panel */}
          <div className="bg-card p-8 sm:p-12 relative">
            {/* Mobile Back to Home - Only visible on small screens */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition mb-6 sm:hidden"
            >
              <Home className="h-3 w-3" />
              Back to Home
            </Link>

            <div className="space-y-2 mb-8">
              <h1 className="font-sans text-3xl font-semibold text-foreground">
                {activeTab === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {activeTab === "login"
                  ? "Sign in to your account to continue"
                  : "Join EVA Local and start discovering vendors"}
              </p>
            </div>

            <Suspense
              fallback={
                <div className="h-40 animate-pulse bg-secondary/50 rounded-xl"></div>
              }
            >
              {activeTab === "login" ? (
                <LoginForm />
              ) : (
                <SignUpForm defaultType={initialType} />
              )}
            </Suspense>

            <div className="mt-8 space-y-3 text-center text-sm">
              {activeTab === "login" ? (
                <p className="text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setActiveTab("signup")}
                    className="text-primary font-medium hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
              <p className="text-muted-foreground">
                Are you a vendor?{" "}
                <Link
                  href="/list-your-business"
                  className="text-primary font-medium hover:underline"
                >
                  List your business
                </Link>
              </p>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
