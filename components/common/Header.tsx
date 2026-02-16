"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

import DesktopNav from "./header/DesktopNav";
import UserDropdown from "./header/UserDropdown";
import MobileMenu from "./header/MobileMenu";
import LoadingOverlay from "../ui/LoadingOverlay";
import SignOutModal from "@/components/modals/sign-out-modal";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // Fetch fresh avatar from database (JWT may be stale after photo change)
  const [freshAvatar, setFreshAvatar] = useState<string | null>(null);
  useEffect(() => {
    if (!session?.user) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user?.avatar) setFreshAvatar(data.user.avatar);
        }
      } catch {}
    };
    fetchProfile();
  }, [session?.user]);

  // Build enriched session with fresh avatar
  const enrichedSession = useMemo(() => {
    if (!session) return session;
    if (!freshAvatar) return session;
    return {
      ...session,
      user: {
        ...session.user,
        image: freshAvatar,
      },
    };
  }, [session, freshAvatar]);

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

  const handleSignOut = () => {
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = async () => {
    setIsSignOutModalOpen(false);
    await signOut({ callbackUrl: "/", redirect: true });
  };

  const handleSearch = () => {
    setIsMenuOpen(false);
    router.push("/search");
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={confirmSignOut}
      />
      {isLoading && <LoadingOverlay />}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/brand/eva-logo-light.png"
                alt="EVA Local"
                width={100}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation & CTAs */}
            <div className="hidden md:flex items-center gap-8">
              <DesktopNav />

              <div className="flex items-center gap-3 border-l border-border pl-8">
                {isLoading || !session?.user ? (
                  <>
                    <Link
                      href="/auth"
                      className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/auth?tab=signup"
                      className="btn-eva-primary rounded-full"
                    >
                      Sign Up
                      <ArrowUpRight size={16} />
                    </Link>
                  </>
                ) : (
                  <UserDropdown
                    session={enrichedSession!}
                    dashboardUrl={dashboardUrl}
                    isOpen={isProfileDropdownOpen}
                    onToggle={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    onClose={() => setIsProfileDropdownOpen(false)}
                    onSignOut={handleSignOut}
                    dropdownRef={dropdownRef}
                  />
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden relative rounded-full border border-border p-2 text-foreground hover:border-primary hover:text-primary transition-all duration-300 active:scale-95"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <div className="relative w-5 h-5">
                <motion.div
                  initial={false}
                  animate={{ 
                    rotate: isMenuOpen ? 90 : 0,
                    opacity: isMenuOpen ? 0 : 1 
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Menu size={20} />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ 
                    rotate: isMenuOpen ? 0 : -90,
                    opacity: isMenuOpen ? 1 : 0 
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <X size={20} />
                </motion.div>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <MobileMenu
                session={enrichedSession}
                isLoading={isLoading}
                dashboardUrl={dashboardUrl}
                onClose={() => setIsMenuOpen(false)}
                onSignOut={handleSignOut}
                onSearch={handleSearch}
              />
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
}
