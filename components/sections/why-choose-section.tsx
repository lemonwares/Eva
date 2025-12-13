import { MapPin, Sparkles, Shield } from "lucide-react";

export default function WhyChooseSection() {
  const features = [
    {
      icon: MapPin,
      title: "Hyper-Local Search",
      description:
        "Focus your search with precise postcode and radius filtering to find vendors right in your community.",
    },
    {
      icon: Sparkles,
      title: "Cultural & Ceremony Matching",
      description:
        "Our core difference. Find specialists who understand the nuances of your traditions.",
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description:
        "Book with confidence. All our listed vendors are vetted for quality and reliability.",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-linear-to-b from-background to-secondary/60 px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-10 top-16 h-80 w-80 rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute right-10 bottom-0 h-96 w-96 rounded-full bg-accent/15 blur-[180px]" />
      </div>

      <div className="relative mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Built for modern celebrations
        </p>
        <h2 className="mt-4 text-balance text-4xl font-semibold text-foreground sm:text-5xl">
          Why couples and organisers rely on EVA
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-balance text-lg text-muted-foreground">
          We connect you with vetted professionals, tailored search filters, and
          collaborative planning tools so you can focus on designing the moments
          that matter.
        </p>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group rounded-[28px] border border-border/70 bg-card/90 p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Icon size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-4 text-base text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="relative mx-auto mt-12 max-w-4xl rounded-4xl border border-border/70 bg-card p-10 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Ready to explore?
        </p>
        <h3 className="mt-4 text-3xl font-semibold text-foreground">
          Book vendors, compare quotes, and manage details in one calm space.
        </h3>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/auth"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5"
          >
            Create free account
          </a>
          <a
            href="/#faq"
            className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
          >
            See how EVA works
          </a>
        </div>
      </div>
    </section>
  );
}

// import { MapPin, Sparkles, Shield, ArrowRight } from "lucide-react";

// export default function WhyChooseSection() {
//   const features = [
//     {
//       icon: MapPin,
//       title: "Hyper-Local Search",
//       description:
//         "Focus your search with precise postcode and radius filtering to find vendors right in your community.",
//       accent: "bg-blue-500",
//       accentLight: "bg-blue-50",
//       iconBg: "bg-blue-100",
//     },
//     {
//       icon: Sparkles,
//       title: "Cultural & Ceremony Matching",
//       description:
//         "Our core differentiator. Find specialists who understand the nuances of your traditions.",
//       accent: "bg-purple-500",
//       accentLight: "bg-purple-50",
//       iconBg: "bg-purple-100",
//     },
//     {
//       icon: Shield,
//       title: "Verified Professionals",
//       description:
//         "Book with confidence. All our listed vendors are vetted for quality and reliability.",
//       accent: "bg-emerald-500",
//       accentLight: "bg-emerald-50",
//       iconBg: "bg-emerald-100",
//     },
//   ];

//   return (
//     <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
//       </div>

//       {/* Grid pattern overlay */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

//       <div className="relative max-w-7xl mx-auto">
//         <div className="text-center mb-20">
//           <div className="inline-block mb-6">
//             <span className="text-sm font-bold tracking-wider text-blue-400 uppercase">
//               Why EVA
//             </span>
//           </div>
//           <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none">
//             Built Different
//           </h2>
//           <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
//             We connect you with verified professionals who are the perfect fit
//             for your specific cultural and ceremonial needs.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//           {features.map((feature, index) => {
//             const Icon = feature.icon;
//             return (
//               <div key={index} className="group relative">
//                 {/* Card background with hover effect */}
//                 <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20"></div>

//                 {/* Accent bar */}
//                 <div
//                   className={`absolute top-0 left-8 w-1 h-0 ${feature.accent} rounded-full transition-all duration-500 group-hover:h-24`}
//                 ></div>

//                 {/* Content */}
//                 <div className="relative p-10">
//                   {/* Icon container with floating animation */}
//                   <div className="mb-8 inline-flex">
//                     <div
//                       className={`relative w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
//                     >
//                       <Icon
//                         className={`${feature.accent.replace(
//                           "bg-",
//                           "text-"
//                         )} transition-all duration-500`}
//                         size={36}
//                         strokeWidth={2.5}
//                       />

//                       {/* Decorative dots */}
//                       <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                       <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75"></div>
//                     </div>
//                   </div>

//                   <h3 className="text-3xl font-bold text-white mb-5 tracking-tight transition-colors duration-300 group-hover:text-blue-300">
//                     {feature.title}
//                   </h3>
//                   <p className="text-slate-400 leading-relaxed text-lg mb-6 transition-colors duration-300 group-hover:text-slate-300">
//                     {feature.description}
//                   </p>

//                   {/* Learn more link */}
//                   <div className="flex items-center text-white/60 group-hover:text-white transition-colors duration-300">
//                     <span className="text-sm font-semibold tracking-wide">
//                       LEARN MORE
//                     </span>
//                     <ArrowRight
//                       className="ml-2 transition-transform duration-300 group-hover:translate-x-2"
//                       size={18}
//                     />
//                   </div>
//                 </div>

//                 {/* Bottom accent on hover */}
//                 <div
//                   className={`absolute bottom-0 left-0 right-0 h-1 ${feature.accent} rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
//                 ></div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Bottom CTA */}
//         <div className="mt-20 text-center">
//           <button className="group px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-blue-400 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 inline-flex items-center">
//             Get Started Today
//             <ArrowRight
//               className="ml-3 transition-transform duration-300 group-hover:translate-x-2"
//               size={22}
//             />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
