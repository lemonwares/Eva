import { prisma } from "../lib/prisma";
import { PlanTier, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  {
    name: "Videographers",
    slug: "videographers",
    description: "Cinematic storytellers for your special day",
    icon: "Video",
    coverImage:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
    isFeatured: true,
  },
];

const cities = [
  {
    name: "London",
    slug: "london",
    country: "UK",
    county: "Greater London",
    region: "London",
    latitude: 51.5074,
    longitude: -0.1278,
    isFeatured: true,
    displayOrder: 1,
    metaTitle: "Event Vendors & Services in London | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in London. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in London.",
    seoIntro:
      "Discover the best event services in London. From stunning venues to expert planners, explore our curated list of London's top event professionals.",
  },
  {
    name: "Birmingham",
    slug: "birmingham",
    country: "UK",
    county: "West Midlands",
    region: "West Midlands",
    latitude: 52.4862,
    longitude: -1.8904,
    isFeatured: true,
    displayOrder: 2,
    metaTitle: "Event Vendors & Services in Birmingham | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Birmingham. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Birmingham.",
    seoIntro:
      "Discover the best event services in Birmingham. From stunning venues to expert planners, explore our curated list of Birmingham's top event professionals.",
  },
  {
    name: "Manchester",
    slug: "manchester",
    country: "UK",
    county: "Greater Manchester",
    region: "North West",
    latitude: 53.4808,
    longitude: -2.2426,
    isFeatured: true,
    displayOrder: 3,
    metaTitle: "Event Vendors & Services in Manchester | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Manchester. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Manchester.",
    seoIntro:
      "Discover the best event services in Manchester. From stunning venues to expert planners, explore our curated list of Manchester's top event professionals.",
  },
  {
    name: "Leeds",
    slug: "leeds",
    country: "UK",
    county: "West Yorkshire",
    region: "Yorkshire and the Humber",
    latitude: 53.8008,
    longitude: -1.5491,
    isFeatured: true,
    displayOrder: 4,
    metaTitle: "Event Vendors & Services in Leeds | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Leeds. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Leeds.",
    seoIntro:
      "Discover the best event services in Leeds. From stunning venues to expert planners, explore our curated list of Leeds' top event professionals.",
  },
  {
    name: "Bristol",
    slug: "bristol",
    country: "UK",
    county: "Bristol",
    region: "South West",
    latitude: 51.4545,
    longitude: -2.5879,
    isFeatured: true,
    displayOrder: 5,
    metaTitle: "Event Vendors & Services in Bristol | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Bristol. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Bristol.",
    seoIntro:
      "Discover the best event services in Bristol. From stunning venues to expert planners, explore our curated list of Bristol's top event professionals.",
  },
  {
    name: "Nottingham",
    slug: "nottingham",
    country: "UK",
    county: "Nottinghamshire",
    region: "East Midlands",
    latitude: 52.9548,
    longitude: -1.1581,
    isFeatured: true,
    displayOrder: 6,
    metaTitle: "Event Vendors & Services in Nottingham | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Nottingham. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Nottingham.",
    seoIntro:
      "Discover the best event services in Nottingham. From stunning venues to expert planners, explore our curated list of Nottingham's top event professionals.",
  },
  {
    name: "Sheffield",
    slug: "sheffield",
    country: "UK",
    county: "South Yorkshire",
    region: "Yorkshire and the Humber",
    latitude: 53.3811,
    longitude: -1.4701,
    isFeatured: true,
    displayOrder: 7,
    metaTitle: "Event Vendors & Services in Sheffield | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Sheffield. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Sheffield.",
    seoIntro:
      "Discover the best event services in Sheffield. From stunning venues to expert planners, explore our curated list of Sheffield's top event professionals.",
  },
  {
    name: "Leicester",
    slug: "leicester",
    country: "UK",
    county: "Leicestershire",
    region: "East Midlands",
    latitude: 52.6369,
    longitude: -1.1398,
    isFeatured: true,
    displayOrder: 8,
    metaTitle: "Event Vendors & Services in Leicester | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Leicester. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Leicester.",
    seoIntro:
      "Discover the best event services in Leicester. From stunning venues to expert planners, explore our curated list of Leicester's top event professionals.",
  },
  {
    name: "Coventry",
    slug: "coventry",
    country: "UK",
    county: "West Midlands",
    region: "West Midlands",
    latitude: 52.4068,
    longitude: -1.5197,
    isFeatured: true,
    displayOrder: 9,
    metaTitle: "Event Vendors & Services in Coventry | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Coventry. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Coventry.",
    seoIntro:
      "Discover the best event services in Coventry. From stunning venues to expert planners, explore our curated list of Coventry's top event professionals.",
  },
  {
    name: "Luton",
    slug: "luton",
    country: "UK",
    county: "Bedfordshire",
    region: "East of England",
    latitude: 51.8787,
    longitude: -0.4175,
    isFeatured: true,
    displayOrder: 10,
    metaTitle: "Event Vendors & Services in Luton | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Luton. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Luton.",
    seoIntro:
      "Discover the best event services in Luton. From stunning venues to expert planners, explore our curated list of Luton's top event professionals.",
  },
  {
    name: "Milton Keynes",
    slug: "milton-keynes",
    country: "UK",
    county: "Buckinghamshire",
    region: "South East",
    latitude: 52.0406,
    longitude: -0.7594,
    isFeatured: true,
    displayOrder: 11,
    metaTitle: "Event Vendors & Services in Milton Keynes | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Milton Keynes. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Milton Keynes.",
    seoIntro:
      "Discover the best event services in Milton Keynes. From stunning venues to expert planners, explore our curated list of Milton Keynes' top event professionals.",
  },
  {
    name: "Reading",
    slug: "reading",
    country: "UK",
    county: "Berkshire",
    region: "South East",
    latitude: 51.4543,
    longitude: -0.9781,
    isFeatured: true,
    displayOrder: 12,
    metaTitle: "Event Vendors & Services in Reading | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Reading. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Reading.",
    seoIntro:
      "Discover the best event services in Reading. From stunning venues to expert planners, explore our curated list of Reading's top event professionals.",
  },
  {
    name: "Brighton",
    slug: "brighton",
    country: "UK",
    county: "East Sussex",
    region: "South East",
    latitude: 50.8225,
    longitude: -0.1372,
    isFeatured: true,
    displayOrder: 13,
    metaTitle: "Event Vendors & Services in Brighton | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Brighton. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Brighton.",
    seoIntro:
      "Discover the best event services in Brighton. From stunning venues to expert planners, explore our curated list of Brighton's top event professionals.",
  },
  {
    name: "Oxford",
    slug: "oxford",
    country: "UK",
    county: "Oxfordshire",
    region: "South East",
    latitude: 51.752,
    longitude: -1.2577,
    isFeatured: true,
    displayOrder: 14,
    metaTitle: "Event Vendors & Services in Oxford | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Oxford. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Oxford.",
    seoIntro:
      "Discover the best event services in Oxford. From stunning venues to expert planners, explore our curated list of Oxford's top event professionals.",
  },
  {
    name: "Cambridge",
    slug: "cambridge",
    country: "UK",
    county: "Cambridgeshire",
    region: "East of England",
    latitude: 52.2053,
    longitude: 0.1218,
    isFeatured: true,
    displayOrder: 15,
    metaTitle: "Event Vendors & Services in Cambridge | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Cambridge. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Cambridge.",
    seoIntro:
      "Discover the best event services in Cambridge. From stunning venues to expert planners, explore our curated list of Cambridge's top event professionals.",
  },
  {
    name: "Liverpool",
    slug: "liverpool",
    country: "UK",
    county: "Merseyside",
    region: "North West",
    latitude: 53.4084,
    longitude: -2.9916,
    isFeatured: true,
    displayOrder: 16,
    metaTitle: "Event Vendors & Services in Liverpool | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Liverpool. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Liverpool.",
    seoIntro:
      "Discover the best event services in Liverpool. From stunning venues to expert planners, explore our curated list of Liverpool's top event professionals.",
  },
  {
    name: "Newcastle upon Tyne",
    slug: "newcastle-upon-tyne",
    country: "UK",
    county: "Tyne and Wear",
    region: "North East",
    latitude: 54.9783,
    longitude: -1.6178,
    isFeatured: true,
    displayOrder: 17,
    metaTitle: "Event Vendors & Services in Newcastle | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Newcastle upon Tyne. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Newcastle upon Tyne.",
    seoIntro:
      "Discover the best event services in Newcastle upon Tyne. From stunning venues to expert planners, explore our curated list of Newcastle upon Tyne's top event professionals.",
  },
  {
    name: "Cardiff",
    slug: "cardiff",
    country: "UK",
    county: "South Glamorgan",
    region: "Wales",
    latitude: 51.4816,
    longitude: -3.1791,
    isFeatured: true,
    displayOrder: 18,
    metaTitle: "Event Vendors & Services in Cardiff | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Cardiff. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Cardiff.",
    seoIntro:
      "Discover the best event services in Cardiff. From stunning venues to expert planners, explore our curated list of Cardiff's top event professionals.",
  },
  {
    name: "Edinburgh",
    slug: "edinburgh",
    country: "UK",
    county: "City of Edinburgh",
    region: "Scotland",
    latitude: 55.9533,
    longitude: -3.1883,
    isFeatured: true,
    displayOrder: 19,
    metaTitle: "Event Vendors & Services in Edinburgh | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Edinburgh. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Edinburgh.",
    seoIntro:
      "Discover the best event services in Edinburgh. From stunning venues to expert planners, explore our curated list of Edinburgh's top event professionals.",
  },
  {
    name: "Glasgow",
    slug: "glasgow",
    country: "UK",
    county: "City of Glasgow",
    region: "Scotland",
    latitude: 55.8642,
    longitude: -4.2518,
    isFeatured: true,
    displayOrder: 20,
    metaTitle: "Event Vendors & Services in Glasgow | EVA Marketplace",
    metaDescription:
      "Find top-rated event vendors in Glasgow. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Glasgow.",
    seoIntro:
      "Discover the best event services in Glasgow. From stunning venues to expert planners, explore our curated list of Glasgow's top event professionals.",
  },
];

// ─── Vendor seed data ───────────────────────────────────────────
const SEED_OWNER_EMAIL = "seed-vendor@evalocal.com";

const vendorNames = [
  "Golden Touch",
  "Majestic Moments",
  "Urban Chic",
  "Evergreen Events",
  "Royal Jubilee",
  "Crystal Clear",
  "Sapphire Skies",
  "Velvet Rose",
  "Diamond Decor",
  "Elite Harmony",
  "Simply Sweet",
  "Grand Gala",
  "Heritage Halls",
  "The Secret Garden",
  "Luxe Life",
  "Pure Elegance",
  "Vivid Visions",
  "Starlight Studios",
  "Midnight Magic",
  "Golden Hour",
  "Creative Concepts",
  "Dream Designs",
  "Urban Oasis",
  "Silver Lining",
  "The Grand Venue",
  "The Party Pro",
  "Elegant Events",
  "Modern Muse",
];

const vendorPhotos = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
];

// Postcodes mapped to seed cities for realism
const cityPostcodes: Record<string, string[]> = {
  london: ["E1 6AN", "SW1A 1AA", "WC2N 5DU", "N1 9GU", "SE1 7PB"],
  birmingham: ["B1 1BB", "B2 4QA", "B5 4BU"],
  manchester: ["M1 1AD", "M2 3NW", "M4 1HQ"],
  leeds: ["LS1 1UR", "LS2 7EW"],
  bristol: ["BS1 3XD", "BS2 0JA"],
};

// ─── Seed function ──────────────────────────────────────────────

export default async function seed() {
  console.log("🌱 Running seed (idempotent — upsert, no duplicates)...\n");

  // ── 1. Categories ─────────────────────────────────────────────
  let catCreated = 0;
  let catUpdated = 0;

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    if (existing) catUpdated++;
    else catCreated++;
  }
  console.log(
    `✅ Categories — ${catCreated} created, ${catUpdated} already existed (updated)`,
  );

  // ── 2. Cities ─────────────────────────────────────────────────
  let cityCreated = 0;
  let cityUpdated = 0;

  for (const city of cities) {
    const existing = await prisma.city.findUnique({
      where: { slug: city.slug },
    });
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city,
    });
    if (existing) cityUpdated++;
    else cityCreated++;
  }
  console.log(
    `✅ Cities    — ${cityCreated} created, ${cityUpdated} already existed (updated)`,
  );

  // ── 3. Seed owner + test vendors ─────────────────────────────
  const hashedPassword = await bcrypt.hash("SeedVendor2026!", 10);

  const seedOwner = await prisma.user.upsert({
    where: { email: SEED_OWNER_EMAIL },
    update: {},
    create: {
      email: SEED_OWNER_EMAIL,
      name: "Eva Seed Vendor",
      password: hashedPassword,
      role: UserRole.PROFESSIONAL,
    },
  });

  // Check if vendors already exist for this seed owner
  const existingVendorCount = await prisma.provider.count({
    where: { ownerUserId: seedOwner.id },
  });

  if (existingVendorCount > 0) {
    console.log(
      `✅ Vendors   — skipped (${existingVendorCount} seed vendors already exist)`,
    );
  } else {
    // Get all categories from DB (includes any admin-added ones)
    const allCategories = await prisma.category.findMany();
    // Use the first 5 seeded cities for vendor locations
    const seedCities = await prisma.city.findMany({
      where: {
        slug: {
          in: ["london", "birmingham", "manchester", "leeds", "bristol"],
        },
      },
    });

    let vendorCount = 0;

    for (const cat of allCategories) {
      // 8 vendors per category
      for (let i = 0; i < 8; i++) {
        const city = seedCities[i % seedCities.length];
        const nameBase = vendorNames[(vendorCount + i) % vendorNames.length];
        const bName = `${nameBase} ${cat.name.replace(/s$/, "")}`;
        const slug = `${bName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${String(vendorCount).padStart(3, "0")}`;

        const postcodes = cityPostcodes[city.slug] ?? ["SW1A 1AA"];
        const postcode = postcodes[i % postcodes.length];

        // Small random offset so map pins don't stack
        const geoLat = (city.latitude ?? 51.5) + (Math.random() - 0.5) * 0.08;
        const geoLng = (city.longitude ?? -0.12) + (Math.random() - 0.5) * 0.08;

        await prisma.provider.create({
          data: {
            ownerUserId: seedOwner.id,
            businessName: bName,
            slug,
            description: `We are ${bName}, a premier ${cat.name.toLowerCase()} service based in ${city.name}. We specialise in providing high-quality experiences for weddings, corporate events, and private parties. With over 10 years of experience, our team is dedicated to excellence and making your special day unforgettable.`,
            categories: [cat.slug],
            city: city.name,
            address: `${10 + vendorCount} High Street`,
            postcode,
            geoLat,
            geoLng,
            serviceRadiusMiles: 25,
            isPublished: true,
            isVerified: true,
            isFeatured: i < 2, // first 2 per category are featured
            planTier: PlanTier.PREMIUM,
            priceFrom: 200 + (vendorCount % 8) * 100,
            averageRating: 4 + Math.random(),
            reviewCount: 10 + (vendorCount % 50),
            coverImage: cat.coverImage,
            photos: vendorPhotos,

            // Listings (services)
            listings: {
              create: [
                {
                  headline: "Standard Package",
                  longDescription:
                    "Our most popular package including all essentials for a perfect day.",
                  price: 500 + (vendorCount % 5) * 100,
                  timeEstimate: "Half Day",
                },
                {
                  headline: "Premium Experience",
                  longDescription:
                    "A full-day immersive experience with all our premium features included.",
                  price: 1500 + (vendorCount % 5) * 200,
                  timeEstimate: "Full Day",
                },
              ],
            },

            // Weekly schedule (Mon-Sat open, Sun closed)
            weeklySchedules: {
              create: [
                { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
                { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" },
                { dayOfWeek: 3, startTime: "09:00", endTime: "18:00" },
                { dayOfWeek: 4, startTime: "09:00", endTime: "20:00" },
                { dayOfWeek: 5, startTime: "09:00", endTime: "20:00" },
                { dayOfWeek: 6, startTime: "10:00", endTime: "16:00" },
                {
                  dayOfWeek: 0,
                  isClosed: true,
                  startTime: "00:00",
                  endTime: "00:00",
                },
              ],
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
                },
              ],
            },

            // Team members
            teamMembers: {
              create: [
                {
                  name: "Alex Smith",
                  role: `Lead ${cat.name.replace(/s$/, "")}`,
                  imageUrl:
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
                },
                {
                  name: "Maria Garcia",
                  role: "Operations Manager",
                  imageUrl:
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
                },
              ],
            },
          },
        });
        vendorCount++;
      }
    }

    console.log(
      `✅ Vendors   — ${vendorCount} created across ${allCategories.length} categories`,
    );
  }

  console.log("\n🌱 Seed complete!");
}

// Self-invoke when run as a standalone script (e.g. tsx prisma/seed.ts)
seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
