"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, CheckCircle2, MessageSquare } from "lucide-react";

export default function HeroSearchForm() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [ceremony, setCeremony] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("city", location);
    if (ceremony) params.set("ceremony", ceremony);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="card-float !p-0 overflow-hidden rounded-3xl border border-black/5 shadow-2xl">
      <form onSubmit={handleSearch} className="p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          Smart Search
        </p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight text-foreground font-playfair">
          Match by category, postcode, and ceremony focus.
        </h3>

        <div className="mt-8 space-y-5">
          {/* Service */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80 ml-1">
              Service
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Photographer, caterer, planner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/50 px-11 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80 ml-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Postcode or city"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/50 px-11 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Ceremony */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80 ml-1">
              Ceremony focus
            </label>
            <div className="relative">
              <select
                value={ceremony}
                onChange={(e) => setCeremony(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-muted/50 px-5 py-3.5 text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All traditions</option>
                <option value="christian">Christian wedding</option>
                <option value="hindu">Hindu ceremony</option>
                <option value="nikah">Traditional Nikah</option>
                <option value="jewish">Jewish wedding</option>
                <option value="sikh">Sikh ceremony</option>
                <option value="civil">Civil ceremony</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f172a] hover:bg-black text-white font-bold py-4 rounded-2xl mt-4 transition-all active:scale-[0.98]"
          >
            See matches
          </button>
        </div>
      </form>

      {/* Footer info */}
      <div className="bg-white border-t border-border p-6 space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
          <p className="text-sm text-muted-foreground leading-tight">
            All vendors verified for quality and cultural expertise.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
          <p className="text-sm text-muted-foreground leading-tight">
            Collaborate with organisers, family, and friends in one hub.
          </p>
        </div>
      </div>
    </div>
  );
}
