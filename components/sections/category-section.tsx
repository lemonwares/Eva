// import {
//   Building2,
//   Camera,
//   Utensils,
//   Music,
//   Flower2,
//   Users,
//   Cake,
//   Sparkles,
//   Palette,
//   Video,
//   GlassWater,
//   Shirt,
// } from "lucide-react";

// export default function CategorySection() {
//   const categories = [
//     {
//       name: "Venues",
//       icon: Building2,
//       gradient: "from-blue-500 to-cyan-500",
//       description: "Beautiful spaces for your event",
//       count: "150+ venues",
//     },
//     {
//       name: "Photographers",
//       icon: Camera,
//       gradient: "from-purple-500 to-pink-500",
//       description: "Capture your precious moments",
//       count: "200+ professionals",
//     },
//     {
//       name: "Caterers",
//       icon: Utensils,
//       gradient: "from-orange-500 to-red-500",
//       description: "Delicious food for every palate",
//       count: "180+ caterers",
//     },
//     {
//       name: "Music & DJs",
//       icon: Music,
//       gradient: "from-green-500 to-emerald-500",
//       description: "Set the perfect mood",
//       count: "120+ artists",
//     },
//     {
//       name: "Florists",
//       icon: Flower2,
//       gradient: "from-pink-500 to-rose-500",
//       description: "Fresh blooms for your celebration",
//       count: "90+ florists",
//     },
//     {
//       name: "Event Planners",
//       icon: Users,
//       gradient: "from-indigo-500 to-purple-500",
//       description: "Expert coordination & planning",
//       count: "75+ planners",
//     },
//     {
//       name: "Bakers",
//       icon: Cake,
//       gradient: "from-amber-500 to-yellow-500",
//       description: "Custom cakes & desserts",
//       count: "110+ bakers",
//     },
//     {
//       name: "Decorators",
//       icon: Sparkles,
//       gradient: "from-violet-500 to-fuchsia-500",
//       description: "Transform your venue",
//       count: "95+ decorators",
//     },
//     {
//       name: "Makeup Artists",
//       icon: Palette,
//       gradient: "from-rose-500 to-pink-500",
//       description: "Look your absolute best",
//       count: "140+ artists",
//     },
//     // {
//     //   name: "Videographers",
//     //   icon: Video,
//     //   gradient: "from-teal-500 to-cyan-500",
//     //   description: "Cinematic event coverage",
//     //   count: "85+ videographers",
//     // },
//     // {
//     //   name: "Bartenders",
//     //   icon: GlassWater,
//     //   gradient: "from-blue-500 to-indigo-500",
//     //   description: "Expert drink service",
//     //   count: "65+ bartenders",
//     // },
//     // {
//     //   name: "Fashion Designers",
//     //   icon: Shirt,
//     //   gradient: "from-fuchsia-500 to-purple-500",
//     //   description: "Custom attire & styling",
//     //   count: "70+ designers",
//     // },
//   ];

//   return (
//     <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <Sparkles size={16} />
//             Browse Categories
//           </div>
//           <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
//             Find the Perfect Vendor
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
//             From venues to videographers, discover talented professionals who
//             understand your vision
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {categories.map((category, index) => {
//             const Icon = category.icon;
//             return (
//               <div
//                 key={index}
//                 className="group relative overflow-hidden rounded-3xl bg-card border border-border hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 cursor-pointer"
//               >
//                 {/* Gradient Background */}
//                 <div
//                   className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
//                 />

//                 {/* Content */}
//                 <div className="relative p-6">
//                   {/* Icon */}
//                   <div
//                     className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
//                   >
//                     <Icon className="text-white" size={28} strokeWidth={2} />
//                   </div>

//                   {/* Title */}
//                   <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
//                     {category.name}
//                   </h3>

//                   {/* Description */}
//                   <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
//                     {category.description}
//                   </p>

//                   {/* Count Badge */}
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
//                       {category.count}
//                     </span>
//                     <svg
//                       className="w-5 h-5 text-accent transform group-hover:translate-x-1 transition-transform duration-300"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Shine Effect */}
//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* View All Button */}
//         <div className="text-center mt-12">
//           <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-accent/30 hover:scale-105 transition-all duration-300">
//             View All Categories
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17 8l4 4m0 0l-4 4m4-4H3"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import {
  Building2,
  Camera,
  Utensils,
  Music,
  Flower2,
  Users,
  Cake,
  Sparkles,
  Palette,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export default function CategorySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categories = [
    {
      name: "Venues",
      icon: Building2,
      description: "Beautiful spaces for your event",
      count: "150+ venues",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
      color: "bg-blue-500",
    },
    {
      name: "Photographers",
      icon: Camera,
      description: "Capture your precious moments",
      count: "200+ professionals",
      image:
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
      color: "bg-purple-500",
    },
    {
      name: "Caterers",
      icon: Utensils,
      description: "Delicious food for every palate",
      count: "180+ caterers",
      image:
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
      color: "bg-orange-500",
    },
    {
      name: "Music & DJs",
      icon: Music,
      description: "Set the perfect mood",
      count: "120+ artists",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
      color: "bg-emerald-500",
    },
    {
      name: "Florists",
      icon: Flower2,
      description: "Fresh blooms for your celebration",
      count: "90+ florists",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
      color: "bg-pink-500",
    },
    {
      name: "Event Planners",
      icon: Users,
      description: "Expert coordination & planning",
      count: "75+ planners",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      color: "bg-indigo-500",
    },
    {
      name: "Bakers",
      icon: Cake,
      description: "Custom cakes & desserts",
      count: "110+ bakers",
      image:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
      color: "bg-amber-500",
    },
    {
      name: "Decorators",
      icon: Sparkles,
      description: "Transform your venue",
      count: "95+ decorators",
      image:
        "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
      color: "bg-violet-500",
    },
    {
      name: "Makeup Artists",
      icon: Palette,
      description: "Look your absolute best",
      count: "140+ artists",
      image:
        "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
      color: "bg-rose-500",
    },
  ];

  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-secondary/40 px-4 py-28 sm:px-6 lg:px-8"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Browse categories
            </span>
          </div>

          <h2 className="text-balance text-4xl font-semibold text-foreground sm:text-5xl">
            Every service you need, curated in one place
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-balance text-lg text-muted-foreground">
            From venues to videographers, discover talented professionals who
            understand your vision
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image Background */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-foreground/60 transition duration-500 group-hover:bg-foreground/70"></div>

                  {/* Icon badge */}
                  <div className="absolute left-6 top-6 z-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/20 text-background shadow-lg transition duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon size={26} />
                    </div>
                  </div>

                  {/* Count badge */}
                  <div className="absolute right-6 top-6 z-10">
                    <div className="rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground shadow">
                      <span>{category.count}</span>
                    </div>
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                    <h3 className="text-2xl font-semibold text-background transition">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-background/80">
                      {category.description}
                    </p>

                    {/* View button - appears on hover */}
                    <button
                      className={`group/btn inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-xs font-semibold text-foreground transition ${
                        isHovered
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      Browse {category.name}
                      <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" />
                    </button>
                  </div>

                  {/* Bottom accent bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-foreground transition ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="group inline-flex items-center gap-3 rounded-full bg-foreground px-10 py-4 text-sm font-semibold text-background transition hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground">
            View all categories
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
