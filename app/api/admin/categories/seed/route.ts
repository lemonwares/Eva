import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const categories = [
  {
    name: "Makeup Artists",
    slug: "makeup-artists",
    description: "Professional makeup services",
    icon: "Palette",
    coverImage:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["makeup", "beauticians"],
    subTags: ["bridal-makeup", "party-makeup"],
  },
  {
    name: "Videographers",
    slug: "videographers",
    description: "Capture your events on film",
    icon: "Video",
    coverImage:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["videography"],
    subTags: ["event-videography", "wedding-videography"],
  },
  {
    name: "Photographers",
    slug: "photographers",
    description: "Capture your precious moments",
    icon: "Camera",
    coverImage:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["photography"],
    subTags: [
      "event-photography",
      "wedding-photography",
      "portrait-photography",
    ],
  },
  {
    name: "Hair Stylists",
    slug: "hair-stylists",
    description: "Professional hair styling services",
    icon: "Shirt",
    coverImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["hairstylists", "barbers", "braiders"],
    subTags: ["bridal-hair"],
  },
  {
    name: "Caterers",
    slug: "caterers",
    description: "Delicious food for every palate",
    icon: "Utensils",
    coverImage:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["catering", "food-catering"],
    subTags: ["wedding-catering", "halal-catering", "kosher-catering"],
  },
  {
    name: "Event Planners",
    slug: "event-planners",
    description: "Expert coordination & planning",
    icon: "Users",
    coverImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["coordinators", "party-planners"],
    subTags: ["on-the-day-coordinator"],
  },
  {
    name: "Mixologists",
    slug: "mixologists",
    description: "Cocktail bartenders and mobile bars",
    icon: "GlassWater",
    coverImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["bartenders"],
    subTags: ["cocktail-bartenders", "mobile-bar", "drinks-service"],
  },
  {
    name: "Decorators",
    slug: "decorators",
    description: "Transform your venue",
    icon: "Sparkles",
    coverImage:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["venue-decor"],
    subTags: ["balloon-decor", "table-settings", "draping"],
  },
  {
    name: "Ice Sculptors",
    slug: "ice-sculptors",
    description: "Ice sculpture and carving",
    icon: "Wand2",
    coverImage:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop",
    isFeatured: false,
    aliases: ["ice-sculpture"],
    subTags: ["ice-carving"],
  },
  {
    name: "Waiters & Servers",
    slug: "waiters-servers",
    description: "Professional serving and hospitality staff",
    icon: "Users",
    coverImage:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop",
    isFeatured: false,
    aliases: ["waiters", "ushers", "serving-staff", "hospitality-staff"],
    subTags: [],
  },
  {
    name: "DJs",
    slug: "djs",
    description: "Professional DJs for events",
    icon: "Music",
    coverImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["disc-jockey"],
    subTags: ["wedding-dj", "party-dj", "club-dj"],
  },
  {
    name: "MCs",
    slug: "mcs",
    description: "Masters of ceremonies and hosts",
    icon: "Mic",
    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    isFeatured: false,
    aliases: ["master-of-ceremonies", "hosts"],
    subTags: [],
  },
  {
    name: "Gele Stylists",
    slug: "gele-stylists",
    description: "Traditional headwrap styling",
    icon: "Heart",
    coverImage:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop",
    isFeatured: false,
    aliases: ["headgear-stylist"],
    subTags: ["traditional-headwrap"],
  },
  {
    name: "Wedding Planners",
    slug: "wedding-planners",
    description: "Specialist wedding planning",
    icon: "Users",
    coverImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["bridal-planners"],
    subTags: ["wedding-coordinators"],
  },
  {
    name: "Fashion Designers",
    slug: "fashion-designers",
    description: "Bespoke outfits and tailoring",
    icon: "Shirt",
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    isFeatured: false,
    aliases: ["dressmakers", "tailors"],
    subTags: ["wedding-dressmakers", "outfit-designers", "bespoke-tailors"],
  },
  {
    name: "Musicians",
    slug: "musicians",
    description: "Live bands and soloists",
    icon: "Music",
    coverImage:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["bands"],
    subTags: ["live-bands", "soloists", "string-quartet", "singers"],
  },
  {
    name: "Bakers",
    slug: "bakers",
    description: "Custom cakes & desserts",
    icon: "Cake",
    coverImage:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["cake-designers", "cake-makers"],
    subTags: ["dessert-table"],
  },
  {
    name: "Florists",
    slug: "florists",
    description: "Fresh blooms for your celebration",
    icon: "Flower2",
    coverImage:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["flower-arrangements"],
    subTags: ["wedding-flowers", "bouquet-design"],
  },
  {
    name: "Souvenir Vendors",
    slug: "souvenir-vendors",
    description: "Gifts and event favours",
    icon: "Gift",
    coverImage:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop",
    isFeatured: false,
    aliases: ["gift-favours", "event-favours", "keepsakes"],
    subTags: [],
  },
  {
    name: "Entertainment",
    slug: "entertainment",
    description: "Performers and entertainers",
    icon: "Wand2",
    coverImage:
      "https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["performers"],
    subTags: ["musicians", "dancers", "magicians", "comedians"],
  },
  {
    name: "Venues",
    slug: "venues",
    description: "Beautiful spaces for your event",
    icon: "Building2",
    coverImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
    isFeatured: true,
    aliases: ["venue"],
    subTags: ["banquet-halls", "outdoor-venues", "hotels", "marquees"],
  },
  {
    name: "Decoration",
    slug: "decoration",
    description: "Decor rental and props",
    icon: "Sparkles",
    coverImage:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
    isFeatured: false,
    aliases: ["decor"],
    subTags: ["decor-rental", "props", "lighting", "draping"],
  },
];

export async function POST(request: NextRequest) {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  return NextResponse.json({ message: "Categories seeded/updated!" });
}

export async function DELETE(request: NextRequest) {
  await prisma.category.deleteMany({});
  return NextResponse.json({ message: "All categories deleted!" });
}
