"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, ArrowUpRight } from "lucide-react";

const navItems = [
  { label: "Vendors", href: "/#vendors" },
  { label: "Categories", href: "/#categories" },
  { label: "Inspiration", href: "/#inspiration" },
  { label: "About", href: "/#about" },
  { label: "FAQs", href: "/#faq" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = navItems.map((item) => (
    <Link
      key={item.label}
      href={item.href}
      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      {item.label}
    </Link>
  ));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full bg-card/60 px-4 py-2 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
              EVA
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Event Vendor Atlas
              </p>
              <p className="text-sm font-semibold text-foreground">
                Book with confidence
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">{navLinks}</div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
              <Search size={18} />
            </button>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-foreground px-6 py-2 text-sm font-semibold text-background transition hover:-translate-y-0.5"
            >
              Join EVA
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden rounded-full border border-border p-2 text-foreground"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6">
            <div className="flex flex-col gap-4 border-t border-border/60 pt-6">
              {navLinks}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/auth"
                  className="flex-1 rounded-full bg-foreground px-6 py-3 text-center text-sm font-semibold text-background"
                >
                  Join EVA
                </Link>
                <button className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground">
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
