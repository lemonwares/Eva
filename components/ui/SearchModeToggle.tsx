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
      className={`flex border border-border rounded-lg overflow-hidden bg-background ${className}`}
    >
      {searchModes.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title={mode.description}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
