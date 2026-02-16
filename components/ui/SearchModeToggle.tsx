"use client";

import { Search, Hash, Link2 } from "lucide-react";

interface SearchModeToggleProps {
  value: "text" | "tags" | "slug" | "all";
  onChange: (mode: "text" | "tags" | "slug" | "all") => void;
  className?: string;
}

const searchModes = [
  {
    value: "all" as const,
    label: "All",
    icon: Search,
    description: "Search everything",
  },
  {
    value: "text" as const,
    label: "Text",
    icon: Search,
    description: "Search names & descriptions",
  },
  {
    value: "tags" as const,
    label: "Tags",
    icon: Hash,
    description: "Search by tags",
  },
  {
    value: "slug" as const,
    label: "Slug",
    icon: Link2,
    description: "Direct vendor lookup",
  },
];

export default function SearchModeToggle({
  value,
  onChange,
  className = "",
}: SearchModeToggleProps) {
  return (
    <div
      className={`flex p-1.5 bg-muted/40 backdrop-blur-sm rounded-2xl gap-1 overflow-x-auto no-scrollbar border border-border/50 ${className}`}
    >
      {searchModes.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`relative flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
              isActive
                ? "bg-white text-accent shadow-lg shadow-accent/5 scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-accent" : "text-muted-foreground/60"}`} />
            <span>{mode.label}</span>
            
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full scale-in duration-300" />
            )}
          </button>
        );
      })}
    </div>
  );
}
