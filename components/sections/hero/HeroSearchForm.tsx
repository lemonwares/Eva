"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

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
    <form onSubmit={handleSearch} className="card-float rounded-3xl p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        Smart Search
      </p>
      <h3 className="mt-2 text-xl text-foreground">
        Match by category, postcode, and ceremony focus.
      </h3>

      <div className="mt-6 space-y-4">
        {/* Service */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Service
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Photographer, caterer, planner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-eva pl-11"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Location
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Postcode or city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-eva pl-11"
            />
          </div>
        </div>

        {/* Ceremony */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Ceremony focus
          </label>
          <select
            value={ceremony}
            onChange={(e) => setCeremony(e.target.value)}
            className="input-eva appearance-none"
          >
            <option value="">All traditions</option>
            <option value="christian">Christian wedding</option>
            <option value="hindu">Hindu ceremony</option>
            <option value="nikah">Traditional Nikah</option>
            <option value="jewish">Jewish wedding</option>
            <option value="sikh">Sikh ceremony</option>
            <option value="civil">Civil ceremony</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn-eva-primary w-full rounded-xl mt-2"
        >
          See matches
        </button>
      </div>
    </form>
  );
}
