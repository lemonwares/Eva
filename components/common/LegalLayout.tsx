"use client";

import Link from "next/link";
import Image from "next/image";

interface LegalLayoutProps {
  children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/images/brand/eva-logo-light.png"
              alt="EVA Local"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12">{children}</main>

      {/* Minimal footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-primary transition"
            >
              Back to top
            </button>
            <span>© 2026 EVA Local. Operated by Sparkpoint Digital.</span>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-primary transition">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-primary transition">
              About Us
            </Link>
            <Link href="/" className="hover:text-primary transition">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
