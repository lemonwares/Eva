"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  MessageSquare,
  Heart,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Bookings", href: "/dashboard/bookings", icon: CalendarDays },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
  { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface MobileBottomNavProps {
  darkMode: boolean;
}

export default function MobileBottomNav({ darkMode }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t ${
        darkMode
          ? "bg-[#141414]/95 border-white/10"
          : "bg-white/95 border-gray-200"
      } backdrop-blur safe-area-bottom`}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
                active
                  ? "text-accent"
                  : darkMode
                    ? "text-gray-400 active:text-gray-200"
                    : "text-gray-500 active:text-gray-700"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span
                className={`text-[10px] leading-tight ${
                  active ? "font-semibold" : "font-medium"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
