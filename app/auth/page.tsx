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
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 relative">
      {/* Top bar */}
      <div className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-border shadow-sm">
             <span className="text-xs">←</span>
          </div>
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-[480px] space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/images/brand/eva-logo-light.png"
              alt="EVA Local"
              width={140}
              height={48}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-black/5">
          <Suspense
            fallback={
              <div className="h-64 animate-pulse bg-secondary/50 rounded-xl"></div>
            }
          >
            {activeTab === "login" ? (
              <LoginForm />
            ) : (
              <SignUpForm defaultType={initialType} />
            )}
          </Suspense>

          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm">
             {activeTab === "login" ? (
                <p className="text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setActiveTab("signup")}
                    className="font-bold text-[#1e2433] hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                   Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                     className="font-bold text-[#1e2433] hover:underline"
                  >
                    Sign in to your account
                  </button>
                </p>
              )}
          </div>
        </div>

        {/* Outer Footer */}
        <div className="text-center">
           {activeTab === "login" && (
             <p className="text-sm text-muted-foreground">
               Are you a vendor?{" "}
               <Link href="/auth?tab=signup&type=PROFESSIONAL" className="font-bold text-[#0097b2] hover:underline">
                 List your business
               </Link>
             </p>
           )}
           {activeTab === "signup" && !initialType && (
              <div className="bg-white inline-flex items-center gap-2 px-6 py-4 rounded-2xl shadow-sm border border-border/40">
                 <p className="text-sm text-muted-foreground">
                   Are you a vendor or service provider?{" "}
                   <Link href="/auth?tab=signup&type=PROFESSIONAL" className="font-bold text-[#0097b2] hover:underline block sm:inline">
                     Create a professional account
                   </Link>
                 </p>
              </div>
           )}
           {activeTab === "signup" && initialType === "PROFESSIONAL" && (
              <div className="bg-white inline-flex items-center gap-2 px-6 py-4 rounded-2xl shadow-sm border border-border/40">
                 <p className="text-sm text-muted-foreground">
                   Looking to book vendors for your event?{" "}
                    <button onClick={() => window.location.href = "/auth?tab=signup"} className="font-bold text-[#0097b2] hover:underline block sm:inline">
                     Create a customer account
                   </button>
                 </p>
              </div>
           )}
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
