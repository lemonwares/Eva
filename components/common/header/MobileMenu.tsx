"use client";

import Link from "next/link";
import Image from "next/image";
import {
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Heart,
  Search,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "./DesktopNav";

interface MobileMenuProps {
  session: {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  } | null;
  isLoading: boolean;
  dashboardUrl: string;
  onClose: () => void;
  onSignOut: () => void;
  onSearch: () => void;
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name.charAt(0).toUpperCase();
}

export default function MobileMenu({
  session,
  isLoading,
  dashboardUrl,
  onClose,
  onSignOut,
  onSearch,
}: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="md:hidden overflow-hidden border-t border-border bg-background"
    >
      <div className="flex flex-col gap-6 px-4 py-8 max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
        {/* Nav Links Section */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Exploration
          </p>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center justify-between px-4 py-3.5 text-base font-semibold text-foreground hover:bg-accent/5 rounded-2xl transition-all"
              onClick={onClose}
            >
              <span>{item.label}</span>
              <ChevronRight size={18} className="text-muted-foreground/40 group-hover:text-accent transition-colors" />
            </Link>
          ))}
        </div>

        <div className="h-px bg-border/50 mx-4" />

        {/* User/Auth Section */}
        <div>
          {isLoading ? (
            <div className="h-24 rounded-2xl bg-muted animate-pulse mx-2" />
          ) : session?.user ? (
            <div className="space-y-6">
              <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Your Account
              </p>
              
              {/* User Profile Card */}
              <div className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-linear-to-br from-accent/10 to-transparent border border-accent/10 mx-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white font-bold text-lg shadow-lg shadow-accent/20 overflow-hidden shrink-0">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{getInitials(session.user.name)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-foreground truncate">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>

              {/* Account Links */}
              <div className="grid grid-cols-2 gap-2 px-2">
                {[
                  { href: dashboardUrl, icon: LayoutDashboard, label: "Dashboard" },
                  { href: "/profile", icon: User, label: "Profile" },
                  { href: "/favorites", icon: Heart, label: "Favorites" },
                  { href: "/settings", icon: Settings, label: "Settings" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex flex-col gap-2 p-4 text-sm font-bold text-foreground bg-muted/30 hover:bg-accent/5 hover:text-accent border border-transparent hover:border-accent/10 rounded-2xl transition-all"
                    onClick={onClose}
                  >
                    <item.icon size={20} className="text-accent" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <button
                onClick={onSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold text-destructive hover:bg-destructive/5 rounded-2xl transition-colors"
              >
                <LogOut size={18} />
                Sign Out from Account
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 px-2">
              <Link
                href="/auth"
                className="flex items-center justify-center gap-2 w-full py-4 bg-accent text-accent-foreground rounded-2xl font-bold text-base shadow-lg shadow-accent/20 active:scale-[0.98] transition-all"
                onClick={onClose}
              >
                Log In to Account
                <ArrowUpRight size={18} />
              </Link>
              <div className="flex gap-2">
                <Link
                  href="/auth?tab=signup"
                  className="flex-1 py-4 border border-border bg-background rounded-2xl text-center font-bold text-sm hover:bg-muted transition-all"
                  onClick={onClose}
                >
                  Join EVA
                </Link>
                <button
                  onClick={onSearch}
                  className="flex items-center justify-center gap-2 px-6 py-4 border border-border bg-background rounded-2xl font-bold text-sm hover:bg-muted transition-all"
                >
                  <Search size={18} />
                  Find Vendors
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info in menu */}
        <div className="mt-4 px-4 py-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} EVA Local. All rights reserved.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
