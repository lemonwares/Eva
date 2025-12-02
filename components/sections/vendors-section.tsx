// "use client";

// import { MapPin, Award, Heart } from "lucide-react";

// interface VendorGalleryItem {
//   id: number;
//   title: string;
//   category: string;
//   image: string;
//   verified: boolean;
// }

// const vendors: VendorGalleryItem[] = [
//   {
//     id: 1,
//     title: "Elegant Wedding Venues",
//     category: "Venues",
//     image:
//       "https://images.unsplash.com/photo-1519167758481-dc80ad014e15?w=500&h=500&fit=crop",
//     verified: true,
//   },
//   {
//     id: 2,
//     title: "Professional Photography",
//     category: "Photography",
//     image:
//       "https://images.unsplash.com/photo-1502764613149-2c02b77f6c60?w=500&h=500&fit=crop",
//     verified: true,
//   },
//   {
//     id: 3,
//     title: "Gourmet Catering Services",
//     category: "Catering",
//     image:
//       "https://images.unsplash.com/photo-1555315721-2ea926bda667?w=500&h=500&fit=crop",
//     verified: true,
//   },
//   {
//     id: 4,
//     title: "Live Music & DJs",
//     category: "Music & DJs",
//     image:
//       "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop",
//     verified: true,
//   },
//   {
//     id: 5,
//     title: "Floral Arrangements",
//     category: "Flowers",
//     image:
//       "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&h=500&fit=crop",
//     verified: true,
//   },
//   {
//     id: 6,
//     title: "Event Planning",
//     category: "Planning",
//     image:
//       "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=500&fit=crop",
//     verified: true,
//   },
//   {
//     id: 7,
//     title: "Cake & Pastry Design",
//     category: "Baking",
//     image:
//       "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
//     verified: true,
//   },
//   {
//     id: 8,
//     title: "Decoration & Styling",
//     category: "Decoration",
//     image:
//       "https://images.unsplash.com/photo-1519048904571-18401c0c3920?w=500&h=500&fit=crop",
//     verified: true,
//   },
// ];

// export default function VendorsSection() {
//   return (
//     <section className="w-full py-20 px-4 bg-background">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
//             Discover Our Trusted Vendors
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
//             Browse our curated collection of verified vendors across different
//             categories
//           </p>
//         </div>

//         {/* Gallery Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {vendors.map((vendor) => (
//             <div key={vendor.id} className="group cursor-pointer">
//               <div className="relative overflow-hidden rounded-lg bg-muted h-64 mb-4 flex flex-col justify-end">
//                 <div
//                   className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
//                   style={{ backgroundImage: `url(${vendor.image})` }}
//                 />

//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                 {/* Content */}
//                 <div className="relative z-10 p-4 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
//                   <h3 className="font-semibold text-lg text-balance">
//                     {vendor.title}
//                   </h3>
//                   <p className="text-sm text-gray-200">{vendor.category}</p>
//                 </div>
//               </div>

//               {/* Card Info */}
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium text-foreground text-sm">
//                     {vendor.category}
//                   </p>
//                   <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
//                     <MapPin className="w-3 h-3" />
//                     <span>Verified</span>
//                   </div>
//                 </div>
//                 {vendor.verified && <Award className="w-5 h-5 text-accent" />}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { MapPin, Award, Heart, ArrowRight, Star, Sparkles } from "lucide-react";
import { useState } from "react";

interface VendorGalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  verified: boolean;
  rating: number;
  reviews: number;
}

const vendors: VendorGalleryItem[] = [
  {
    id: 1,
    title: "Elegant Wedding Venues",
    category: "Venues",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.9,
    reviews: 234,
  },
  {
    id: 2,
    title: "Professional Photography",
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=800&fit=crop",
    verified: true,
    rating: 5.0,
    reviews: 189,
  },
  {
    id: 3,
    title: "Gourmet Catering Services",
    category: "Catering",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.8,
    reviews: 312,
  },
  {
    id: 4,
    title: "Live Music & DJs",
    category: "Music & DJs",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 5,
    title: "Floral Arrangements",
    category: "Flowers",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop",
    verified: true,
    rating: 5.0,
    reviews: 278,
  },
  {
    id: 6,
    title: "Event Planning",
    category: "Planning",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.7,
    reviews: 445,
  },
  {
    id: 7,
    title: "Cake & Pastry Design",
    category: "Baking",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.9,
    reviews: 201,
  },
  {
    id: 8,
    title: "Decoration & Styling",
    category: "Decoration",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop",
    verified: true,
    rating: 4.8,
    reviews: 167,
  },
];

export default function VendorsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section
      id="vendors"
      className="relative w-full overflow-hidden bg-background px-4 py-28"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              FEATURED VENDORS
            </span>
          </div>

          <h2 className="text-balance text-4xl font-semibold text-foreground sm:text-5xl">
            Trusted by couples, planners, and venues alike
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-balance text-lg text-muted-foreground">
            Browse our curated collection of verified vendors across different
            categories
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(vendor.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image Container */}
              <div className="relative mb-5 aspect-square overflow-hidden rounded-[28px] border border-border/70 bg-muted/50 shadow-lg transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${vendor.image})` }}
                />

                {/* Verified Badge */}
                {vendor.verified && (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-card/90 p-2 shadow">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                )}

                {/* Overlay with content */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between bg-foreground/90 p-6 text-background backdrop-blur-sm transition-opacity ${
                    hoveredId === vendor.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div>
                    <span className="mb-3 inline-block rounded-full bg-background/20 px-3 py-1.5 text-xs font-semibold">
                      {vendor.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-2xl font-semibold leading-tight">
                      {vendor.title}
                    </h3>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star
                          className="h-4 w-4 text-accent"
                          fill="currentColor"
                        />
                        <span className="text-sm font-semibold">
                          {vendor.rating}
                        </span>
                      </div>
                      <span className="text-sm text-background/70">
                        {vendor.reviews} reviews
                      </span>
                    </div>

                    <button className="group/btn flex w-full items-center justify-center gap-2 rounded-full bg-background py-3 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground">
                      View Profile
                      <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>

                {/* Bottom color accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent transition duration-300 group-hover:translate-y-0"></div>
              </div>

              {/* Card Info - Visible by default */}
              <div className="px-2">
                <h4 className="mb-2 text-lg font-semibold text-foreground transition group-hover:text-accent">
                  {vendor.title}
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{vendor.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent" fill="currentColor" />
                    <span className="text-sm font-semibold text-foreground">
                      {vendor.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="group inline-flex items-center gap-3 rounded-full bg-foreground px-10 py-4 text-sm font-semibold text-background transition hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground">
            Explore all vendors
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
