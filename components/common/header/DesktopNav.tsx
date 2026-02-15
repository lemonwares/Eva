"use client";

import Link from "next/link";

export const navItems = [
  { label: "Browse Vendors", href: "/search" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "For Businesses", href: "/list-your-business" },
];

export default function DesktopNav() {
  return (
    <div className="hidden md:flex items-center gap-8">
      {navItems.map((item) => (
        <Link key={item.label} href={item.href} className="nav-link">
          {item.label}
        </Link>
      ))}
    </div>
  );
}
