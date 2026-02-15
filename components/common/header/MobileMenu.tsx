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
} from "lucide-react";
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
    <div
      className="md:hidden pb-6 animate-fadeIn"
      role="dialog"
      aria-label="Mobile menu"
    >
      <div className="flex flex-col gap-1 border-t border-border pt-4">
        {/* Nav Links */}
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-teal-light/30 rounded-lg transition-colors"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}

        <div className="my-2 border-t border-border" />

        {isLoading ? (
          <div className="h-12 rounded-lg bg-muted animate-pulse mx-4" />
        ) : session?.user ? (
          <div className="flex flex-col gap-1">
            {/* User Info */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-light/40 mx-2 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={40}
                    height={40}
                    className="h-full w-full rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-sm">
                    {getInitials(session.user.name)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {session.user.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* Mobile Menu Links */}
            {[
              { href: dashboardUrl, icon: LayoutDashboard, label: "Dashboard" },
              { href: "/profile", icon: User, label: "Profile" },
              { href: "/favorites", icon: Heart, label: "Favorites" },
              { href: "/settings", icon: Settings, label: "Settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-teal-light/30 rounded-lg transition-colors mx-2"
                onClick={onClose}
              >
                <item.icon size={16} className="text-primary" />
                {item.label}
              </Link>
            ))}

            <button
              onClick={onSignOut}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition-colors mx-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 pt-2">
            <Link
              href="/auth"
              className="flex-1 btn-eva-primary text-center rounded-full"
              onClick={onClose}
            >
              Login
            </Link>
            <button
              onClick={onSearch}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Search vendors"
            >
              <Search size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
