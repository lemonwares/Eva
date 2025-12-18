import { prisma } from "../lib/prisma";

const categories = [
  {
    name: "Venues",
    slug: "venues",
    description: "Beautiful spaces for your event",
    icon: "Building2",
    coverImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
    isFeatured: true,
  },
  {
    name: "Photographers",
    slug: "photographers",
    description: "Capture your precious moments",
    icon: "Camera",
    coverImage:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
    isFeatured: true,
  },
  {
    name: "Caterers",
    slug: "caterers",
    description: "Delicious food for every palate",
    icon: "Utensils",
    coverImage:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
    isFeatured: true,
  },
  {
    name: "Music & DJs",
    slug: "music-djs",
    description: "Set the perfect mood",
    icon: "Music",
    coverImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    isFeatured: true,
  },
  {
    name: "Florists",
    slug: "florists",
    description: "Fresh blooms for your celebration",
    icon: "Flower2",
    coverImage:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
    isFeatured: true,
  },
  {
    name: "Event Planners",
    slug: "event-planners",
    description: "Expert coordination & planning",
    icon: "Users",
    coverImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    isFeatured: true,
  },
  {
    name: "Bakers",
    slug: "bakers",
    description: "Custom cakes & desserts",
    icon: "Cake",
    coverImage:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
    isFeatured: true,
  },
  {
    name: "Decorators",
    slug: "decorators",
    description: "Transform your venue",
    icon: "Sparkles",
    coverImage:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
    isFeatured: true,
  },
  {
    name: "Makeup Artists",
    slug: "makeup-artists",
    description: "Look your absolute best",
    icon: "Palette",
    coverImage:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
    isFeatured: true,
  },
];

export default async function seed() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("Categories seeded!");
}
