"use client";

import { MapPin, Search, Sparkles, ShieldCheck, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-linear-to-b from-secondary/70 via-background to-background pt-32 pb-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-24 right-12 h-72 w-72 rounded-full bg-accent/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            <Sparkles size={16} className="text-accent" />
            Verified vendors only
          </div>
          <div className="space-y-6">
            <h1 className="text-balance text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl">
              Find vendors who honor every tradition you celebrate.
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              EVA maps trusted photographers, planners, caterers, and more to
              your postcode, culture, and ceremony details—so every moment feels
              personal.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="/auth"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5"
            >
              Start planning
            </a>
            <a
              href="/#vendors"
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
            >
              Explore vendors
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: "Vetted vendors", value: "1,200+" },
              { label: "Cultures supported", value: "80+" },
              { label: "Avg. review", value: "4.9/5" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/70 bg-card/70 px-5 py-4"
              >
                <p className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-[32px] border border-border/80 bg-card/80 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.1)] backdrop-blur">
          <div className="rounded-3xl border border-border/70 bg-background/70 p-6 shadow-inner">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Smart search
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">
              Match by category, postcode, and ceremony focus.
            </h3>
            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Service
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Photographer, caterer, planner..."
                    className="w-full rounded-2xl border border-border bg-input/60 px-12 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Postcode or city"
                    className="w-full rounded-2xl border border-border bg-input/60 px-12 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Ceremony focus
                </label>
                <select className="w-full rounded-2xl border border-border bg-input/60 px-4 py-3 text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/30">
                  <option>All traditions</option>
                  <option>Christian wedding</option>
                  <option>Hindu ceremony</option>
                  <option>Traditional Nikah</option>
                </select>
              </div>
              <button className="mt-4 w-full rounded-2xl bg-foreground py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5">
                See matches
              </button>
            </div>
            <div className="mt-8 grid gap-4 rounded-2xl border border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-foreground" />
                <p>All vendors verified for quality & cultural expertise.</p>
              </div>
              <div className="flex items-center gap-3">
                <Users size={18} className="text-foreground" />
                <p>
                  Collaborate with planners, family, and friends in one hub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// "use client";

// import { Search, MapPin, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
// import { useState } from "react";

// export default function HeroSection() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [location, setLocation] = useState("");

//   const popularSearches = [
//     "Wedding Photographer",
//     "Indian Catering",
//     "DJ Services",
//     "Event Venues",
//   ];

//   return (
//     <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
//         <div
//           className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "1s" }}
//         ></div>
//         <div
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "2s" }}
//         ></div>
//       </div>

//       {/* Grid pattern */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

//       <div className="relative max-w-7xl mx-auto w-full py-20">
//         {/* Badge */}
//         <div className="text-center mb-8 animate-fade-in">
//           <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
//             <Sparkles className="w-4 h-4 text-yellow-400" fill="currentColor" />
//             <span className="text-sm font-bold text-white tracking-wide">
//               YOUR EVENT, YOUR CULTURE
//             </span>
//           </div>
//         </div>

//         {/* Main Heading */}
//         <div className="text-center max-w-5xl mx-auto mb-12">
//           <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none tracking-tight">
//             Find Vendors Who
//             <span className="block mt-2 bg-clip-text text-transparent bg-white">
//               Get Your Traditions
//             </span>
//           </h1>
//           <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto font-light">
//             Discover local professionals for your event. Search by postcode,
//             culture, and ceremony to find the perfect fit.
//           </p>

//           {/* Trust indicators */}
//           <div className="flex items-center justify-center gap-8 text-slate-400 text-sm font-medium">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
//               <span>10K+ Happy Couples</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//               <span>5K+ Verified Vendors</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
//               <span>100+ Cultures</span>
//             </div>
//           </div>
//         </div>

//         {/* Search Box */}
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-3xl shadow-2xl p-3 backdrop-blur-sm border-2 border-white/20">
//             <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-3">
//               {/* Search Input */}
//               <div className="relative group">
//                 <Search
//                   className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors duration-300"
//                   size={22}
//                   strokeWidth={2.5}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Photographer, venue, caterer..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-14 pr-5 py-5 rounded-2xl focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-400 font-medium text-lg transition-all duration-300 hover:bg-slate-100 focus:bg-white focus:shadow-lg"
//                 />
//               </div>

//               {/* Location Input */}
//               <div className="relative group">
//                 <MapPin
//                   className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors duration-300"
//                   size={22}
//                   strokeWidth={2.5}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Postcode or city"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   className="w-full pl-14 pr-5 py-5 rounded-2xl focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-400 font-medium text-lg transition-all duration-300 hover:bg-slate-100 focus:bg-white focus:shadow-lg"
//                 />
//               </div>

//               {/* Search Button */}
//               <button className="group bg-blue-500 text-white py-5 px-10 rounded-2xl hover:bg-blue-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3 whitespace-nowrap">
//                 Search
//                 <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
//               </button>
//             </div>
//           </div>

//           {/* Additional options */}
//           <div className="mt-6 text-center">
//             <p className="text-slate-400 text-sm mb-4">
//               For a tailored search, you can also{" "}
//               <a
//                 href="#"
//                 className="text-blue-400 hover:text-blue-300 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-300"
//               >
//                 specify culture or ceremony type
//               </a>
//             </p>

//             {/* Popular searches */}
//             <div className="flex items-center justify-center gap-3 flex-wrap">
//               <div className="flex items-center gap-2 text-slate-500 text-sm">
//                 <TrendingUp className="w-4 h-4" />
//                 <span className="font-medium">Popular:</span>
//               </div>
//               {popularSearches.map((search, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSearchQuery(search)}
//                   className="px-4 py-2 bg-white/5 backdrop-blur-sm text-slate-300 rounded-full text-sm font-medium hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20"
//                 >
//                   {search}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom stats */}
//         <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
//             <div className="text-4xl font-black text-white mb-2">100%</div>
//             <div className="text-slate-400 text-sm font-medium">
//               Verified Vendors
//             </div>
//           </div>
//           <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
//             <div className="text-4xl font-black text-white mb-2">24/7</div>
//             <div className="text-slate-400 text-sm font-medium">
//               Customer Support
//             </div>
//           </div>
//           <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
//             <div className="text-4xl font-black text-white mb-2">Free</div>
//             <div className="text-slate-400 text-sm font-medium">
//               For All Users
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scroll indicator */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
//         <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
//           <div className="w-1.5 h-2 bg-white/50 rounded-full"></div>
//         </div>
//       </div>
//     </section>
//   );
// }
