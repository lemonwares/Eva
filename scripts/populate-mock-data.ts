import { PrismaClient, PlanTier, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })),
});

const categories = [
  {
    name: "Venues",
    slug: "venues",
    description: "Stunning locations from grand ballrooms to rustic barns.",
    icon: "Building2",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Photographers",
    slug: "photographers",
    description: "Professional artists to capture every heartbeat of your event.",
    icon: "Camera",
    coverImage: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Caterers",
    slug: "caterers",
    description: "Delectable menus tailored to your cultural traditions.",
    icon: "Utensils",
    coverImage: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Music & DJs",
    slug: "music-djs",
    description: "Live bands and DJs to keep the dance floor alive all night.",
    icon: "Music",
    coverImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Florists",
    slug: "florists",
    description: "Breathtaking floral arrangements for every ceremony.",
    icon: "Flower2",
    coverImage: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Event Planners",
    slug: "event-planners",
    description: "Stress-free coordination from concept to cleanup.",
    icon: "Users",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Bakers",
    slug: "bakers",
    description: "Custom cakes and sweets that look as good as they taste.",
    icon: "Cake",
    coverImage: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Decorators",
    slug: "decorators",
    description: "Bespoke styling to transform any space into a dream.",
    icon: "Sparkles",
    coverImage: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Makeup Artists",
    slug: "makeup-artists",
    description: "Flawless beauty services for brides and guests.",
    icon: "Palette",
    coverImage: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Videographers",
    slug: "videographers",
    description: "Cinematic storytellers for your special day.",
    icon: "Video",
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    isFeatured: true,
  },
];

const cities = [
  { name: "London", slug: "london", lat: 51.5074, lng: -0.1278 },
  { name: "Manchester", slug: "manchester", lat: 53.4808, lng: -2.2426 },
  { name: "Birmingham", slug: "birmingham", lat: 52.4862, lng: -1.8904 },
  { name: "Leeds", slug: "leeds", lat: 53.8008, lng: -1.5491 },
  { name: "Bristol", slug: "bristol", lat: 51.4545, lng: -2.5879 },
];

const vendorNames = [
  "Golden Touch", "Majestic Moments", "Urban Chic", "Evergreen Events", 
  "Royal Jubilee", "Crystal Clear", "Sapphire Skies", "Velvet Rose", 
  "Diamond Decor", "Elite Harmony", "Simply Sweet", "Grand Gala",
  "Heritage Halls", "The Secret Garden", "Luxe Life", "Pure Elegance",
  "Vivid Visions", "Starlight Studios", "Midnight Magic", "Golden Hour",
  "Creative Concepts", "Dream Designs", "Urban Oasis", "Silver Lining",
  "The Grand Venue", "The Party Pro", "Elegant Events", "Modern Muse"
];

async function main() {
  console.log("Starting full data population...");

  // 1. Create or get the seed owner
  const seedOwner = await prisma.user.upsert({
    where: { email: "seed-vendor@evalocal.com" },
    update: {},
    create: {
      email: "seed-vendor@evalocal.com",
      name: "Eva Seed Vendor",
      password: "password123", // Should be hashed in real app
      role: UserRole.PROFESSIONAL,
    },
  });

  // 2. Seed Cities
  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: {
        name: city.name,
        slug: city.slug,
        latitude: city.lat,
        longitude: city.lng,
        country: "UK",
        isFeatured: true,
      },
    });
  }
  console.log("Cities seeded.");

  // 3. Seed/Update Categories in our list
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { coverImage: cat.coverImage },
      create: cat,
    });
  }
  console.log("Base categories seeded.");

  // 4. Clear existing seeded vendors to avoid duplicates
  const deletedVendors = await prisma.provider.deleteMany({
    where: { ownerUserId: seedOwner.id },
  });
  console.log(`Cleared ${deletedVendors.count} previous seed vendors.`);

  // 5. Get ALL categories from DB to ensure EVERY category gets vendors
  const allCategories = await prisma.category.findMany();
  console.log(`Ensuring providers for all ${allCategories.length} categories...`);

  // 6. Generate Vendors
  let vendorCount = 0;
  for (const cat of allCategories) {
    console.log(`Seeding vendors for: ${cat.name}...`);
    // Ensure every category has at least 8 vendors (some might already have 15 if they were in the base list)
    for (let i = 0; i < 8; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const bName = `${vendorNames[Math.floor(Math.random() * vendorNames.length)]} ${cat.name.slice(0, -1)}`;
      const slug = `${bName.toLowerCase().replace(/ /g, "-")}-${Math.floor(Math.random() * 10000)}`;
      
      // Randomly offset coords by small amount to avoid overlaps
      const lat = city.lat + (Math.random() - 0.5) * 0.1;
      const lng = city.lng + (Math.random() - 0.5) * 0.1;

      const provider = await prisma.provider.create({
        data: {
          ownerUserId: seedOwner.id,
          businessName: bName,
          slug,
          description: `We are ${bName}, a premier ${cat.name.toLowerCase()} service based in ${city.name}. We specialize in providing high-quality experiences for weddings, corporate events, and private parties. With over 10 years of experience, our team is dedicated to excellence and making your special day unforgettable.`,
          categories: [cat.slug],
          city: city.name,
          address: `${Math.floor(Math.random() * 200)} High Street`,
          postcode: "M1 1AA", // Mock postcode
          geoLat: lat,
          geoLng: lng,
          serviceRadiusMiles: 25,
          isPublished: true,
          isVerified: true,
          isFeatured: Math.random() > 0.8,
          planTier: PlanTier.PREMIUM,
          priceFrom: 200 + Math.floor(Math.random() * 800),
          averageRating: 4 + Math.random(),
          reviewCount: 10 + Math.floor(Math.random() * 100),
          coverImage: cat.coverImage,
          photos: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
          ],
          
          // Listings (Services)
          listings: {
            create: [
              {
                headline: "Standard Package",
                longDescription: "Our most popular package including all essentials for a perfect day.",
                price: 500 + Math.floor(Math.random() * 500),
                timeEstimate: "Half Day",
              },
              {
                headline: "Premium Experience",
                longDescription: "A full-day immersive experience with all our premium features included.",
                price: 1500 + Math.floor(Math.random() * 1000),
                timeEstimate: "Full Day",
              }
            ]
          },

          // Schedule
          weeklySchedules: {
            create: [
              { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
              { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" },
              { dayOfWeek: 3, startTime: "09:00", endTime: "18:00" },
              { dayOfWeek: 4, startTime: "09:00", endTime: "20:00" },
              { dayOfWeek: 5, startTime: "09:00", endTime: "20:00" },
              { dayOfWeek: 6, startTime: "10:00", endTime: "16:00" },
              { dayOfWeek: 0, isClosed: true, startTime: "00:00", endTime: "00:00" }
            ]
          },

          // Reviews
          reviews: {
            create: [
              {
                rating: 5,
                authorName: "Sarah Johnson",
                authorEmail: "sarah@example.com",
                body: "Absolutely wonderful service! They exceeded all our expectations.",
              },
              {
                rating: 4,
                authorName: "Mark Wilson",
                authorEmail: "mark@example.com",
                body: "Very professional and great quality. Highly recommended.",
              }
            ]
          },

          // Team Members
          teamMembers: {
            create: [
              {
                name: "Alex Smith",
                role: "Lead " + cat.name.slice(0, -1),
                imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
              },
              {
                name: "Maria Garcia",
                role: "Operations Manager",
                imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
              }
            ]
          }
        }
      });
      vendorCount++;
    }
  }

  console.log(`Successfully seeded ${vendorCount} vendors!`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
