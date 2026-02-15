"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Settings, LogOut, LayoutDashboard, Heart } from "lucide-react";

interface UserDropdownProps {
  session: {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  };
  dashboardUrl: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSignOut: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name.charAt(0).toUpperCase();
}

export default function UserDropdown({
  session,
  dashboardUrl,
  isOpen,
  onToggle,
  onClose,
  onSignOut,
  dropdownRef,
}: UserDropdownProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        aria-label="User menu"
      >
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
          <span className="text-sm">{getInitials(session.user.name)}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white shadow-lg overflow-hidden animate-fadeIn">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border bg-teal-light/30">
            <p className="text-sm font-semibold text-foreground">
              {session.user.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session.user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {[
              { href: dashboardUrl, icon: LayoutDashboard, label: "Dashboard" },
              { href: "/profile", icon: User, label: "Profile" },
              { href: "/favorites", icon: Heart, label: "Favorites" },
              { href: "/settings", icon: Settings, label: "Settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-teal-light/40 transition-colors"
                onClick={onClose}
              >
                <item.icon size={16} className="text-primary" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Sign Out */}
          <div className="border-t border-border py-1">
            <button
              onClick={onSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
