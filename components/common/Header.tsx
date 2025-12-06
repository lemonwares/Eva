"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Menu,
  X,
  Search,
  ArrowUpRight,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { label: "Vendors", href: "/vendors" },
  { label: "Categories", href: "/categories" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "FAQs", href: "/#faq" },
];

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // Get the correct dashboard URL based on user role
  const dashboardUrl = useMemo(() => {
    if (!session?.user?.role) return "/dashboard";
    switch (session.user.role) {
      case "ADMINISTRATOR":
        return "/admin";
      case "PROFESSIONAL":
        return "/vendor";
      default:
        return "/dashboard";
    }
  }, [session?.user?.role]);

  // console.log("Session data in Header:", session);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleSignOut = async () => {
    // Close menus then force a redirecting sign-out to ensure navigation completes.
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    await signOut({ callbackUrl: "/", redirect: true });
  };

  const handleSearch = () => {
    router.push("/vendors");
  };

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
            <button
              onClick={handleSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="Search vendors"
            >
              <Search size={18} />
            </button>

            {isLoading ? (
              <div className="h-10 w-10 rounded-full border border-border bg-muted animate-pulse" />
            ) : session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent text-accent-foreground font-semibold hover:border-foreground transition-colors"
                  aria-label="User menu"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">
                      {getInitials(session.user.name)}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-background shadow-lg overflow-hidden">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href={dashboardUrl}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Heart size={16} />
                        Favorites
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-border py-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-destructive hover:bg-accent hover:text-white transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-transparent bg-foreground px-6 py-2 text-sm font-semibold text-background transition hover:-translate-y-0.5"
              >
                Join EVA
                <ArrowUpRight size={16} />
              </Link>
            )}
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

              {isLoading ? (
                <div className="h-11 rounded-full border border-border bg-muted animate-pulse" />
              ) : session?.user ? (
                <div className="flex flex-col gap-2 pt-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-accent">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background font-semibold">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">
                          {getInitials(session.user.name)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Menu Links */}
                  <Link
                    href={dashboardUrl}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <Link
                    href="/favorites"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart size={16} />
                    Favorites
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-accent rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>

                  <button
                    onClick={handleSearch}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground self-center mt-2"
                    aria-label="Search vendors"
                  >
                    <Search size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href="/auth"
                    className="flex-1 rounded-full bg-foreground px-6 py-3 text-center text-sm font-semibold text-background"
                  >
                    Join EVA
                  </Link>
                  <button
                    onClick={handleSearch}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground"
                    aria-label="Search vendors"
                  >
                    <Search size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
