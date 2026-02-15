import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

const enhancedCategories = [
  {
    name: "Makeup Artists",
    slug: "makeup-artists",
    description: "Professional makeup and beauty services for all occasions",
    icon: "Palette",
    isFeatured: true,
    displayOrder: 1,
    coverImage:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Bridal Makeup",
        slug: "bridal-makeup",
        description: "Specialized bridal makeup services",
        displayOrder: 1,
      },
      {
        name: "Party Makeup",
        slug: "party-makeup",
        description: "Makeup for parties and events",
        displayOrder: 2,
      },
      {
        name: "Beauticians",
        slug: "beauticians",
        description: "General beauty and makeup services",
        displayOrder: 3,
      },
    ],
  },
  {
    name: "Videographers",
    slug: "videographers",
    description: "Professional video recording and production services",
    icon: "Video",
    isFeatured: true,
    displayOrder: 2,
    coverImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Event Videography",
        slug: "event-videography",
        description: "General event video recording",
        displayOrder: 1,
      },
      {
        name: "Wedding Videography",
        slug: "wedding-videography",
        description: "Specialized wedding video services",
        displayOrder: 2,
      },
    ],
  },
  {
    name: "Photographers",
    slug: "photographers",
    description: "Capture your precious moments with professional photography",
    icon: "Camera",
    isFeatured: true,
    displayOrder: 3,
    coverImage:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Event Photography",
        slug: "event-photography",
        description: "General event photography",
        displayOrder: 1,
      },
      {
        name: "Wedding Photography",
        slug: "wedding-photography",
        description: "Specialized wedding photography",
        displayOrder: 2,
      },
      {
        name: "Portrait Photography",
        slug: "portrait-photography",
        description: "Professional portrait sessions",
        displayOrder: 3,
      },
    ],
  },
  {
    name: "Hair Stylists",
    slug: "hair-stylists",
    description: "Professional hair styling and grooming services",
    icon: "Scissors",
    isFeatured: true,
    displayOrder: 4,
    coverImage:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Bridal Hair",
        slug: "bridal-hair",
        description: "Specialized bridal hair styling",
        displayOrder: 1,
      },
      {
        name: "Braiders",
        slug: "braiders",
        description: "Professional hair braiding services",
        displayOrder: 2,
      },
      {
        name: "Barbers",
        slug: "barbers",
        description: "Professional barbering services",
        displayOrder: 3,
      },
    ],
  },
  {
    name: "Caterers",
    slug: "caterers",
    description: "Delicious food and catering services for every palate",
    icon: "Utensils",
    isFeatured: true,
    displayOrder: 5,
    coverImage:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Wedding Catering",
        slug: "wedding-catering",
        description: "Specialized wedding catering services",
        displayOrder: 1,
      },
      {
        name: "Halal Catering",
        slug: "halal-catering",
        description: "Halal-certified catering services",
        displayOrder: 2,
      },
      {
        name: "Kosher Catering",
        slug: "kosher-catering",
        description: "Kosher-certified catering services",
        displayOrder: 3,
      },
      {
        name: "Food Catering",
        slug: "food-catering",
        description: "General food catering services",
        displayOrder: 4,
      },
    ],
  },
  {
    name: "Event Planners",
    slug: "event-planners",
    description: "Expert coordination and planning for seamless events",
    icon: "Users",
    isFeatured: true,
    displayOrder: 6,
    coverImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Wedding Planners",
        slug: "wedding-planners",
        description: "Specialized wedding planning services",
        displayOrder: 1,
      },
      {
        name: "Party Planners",
        slug: "party-planners",
        description: "Party and celebration planning",
        displayOrder: 2,
      },
      {
        name: "Coordinators",
        slug: "coordinators",
        description: "Event coordination services",
        displayOrder: 3,
      },
      {
        name: "On-the-Day Coordinators",
        slug: "on-the-day-coordinators",
        description: "Day-of event coordination",
        displayOrder: 4,
      },
    ],
  },
  {
    name: "Mixologists",
    slug: "mixologists",
    description: "Professional bartending and cocktail services",
    icon: "GlassWater",
    isFeatured: true,
    displayOrder: 7,
    coverImage:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Cocktail Bartenders",
        slug: "cocktail-bartenders",
        description: "Professional cocktail mixing services",
        displayOrder: 1,
      },
      {
        name: "Mobile Bar",
        slug: "mobile-bar",
        description: "Mobile bar setup services",
        displayOrder: 2,
      },
      {
        name: "Drinks Service",
        slug: "drinks-service",
        description: "General drinks and beverage services",
        displayOrder: 3,
      },
    ],
  },
  {
    name: "Decorators",
    slug: "decorators",
    description: "Transform your venue with stunning decorations",
    icon: "Sparkles",
    isFeatured: true,
    displayOrder: 8,
    coverImage:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Venue Decor",
        slug: "venue-decor",
        description: "Complete venue decoration services",
        displayOrder: 1,
      },
      {
        name: "Balloon Decor",
        slug: "balloon-decor",
        description: "Balloon decoration and arrangements",
        displayOrder: 2,
      },
      {
        name: "Table Settings",
        slug: "table-settings",
        description: "Table decoration and setup",
        displayOrder: 3,
      },
      {
        name: "Draping",
        slug: "draping",
        description: "Fabric draping and backdrop services",
        displayOrder: 4,
      },
    ],
  },
  {
    name: "Waiters & Servers",
    slug: "waiters-servers",
    description: "Professional serving and hospitality staff",
    icon: "Users",
    isFeatured: false,
    displayOrder: 9,
    coverImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Waiters",
        slug: "waiters",
        description: "Professional waiting staff",
        displayOrder: 1,
      },
      {
        name: "Ushers",
        slug: "ushers",
        description: "Event ushering services",
        displayOrder: 2,
      },
      {
        name: "Serving Staff",
        slug: "serving-staff",
        description: "General serving staff",
        displayOrder: 3,
      },
      {
        name: "Hospitality Staff",
        slug: "hospitality-staff",
        description: "Complete hospitality services",
        displayOrder: 4,
      },
    ],
  },
  {
    name: "DJs",
    slug: "djs",
    description: "Professional DJ services for all events",
    icon: "Music",
    isFeatured: true,
    displayOrder: 10,
    coverImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Wedding DJ",
        slug: "wedding-dj",
        description: "Specialized wedding DJ services",
        displayOrder: 1,
      },
      {
        name: "Party DJ",
        slug: "party-dj",
        description: "Party and celebration DJs",
        displayOrder: 2,
      },
      {
        name: "Club DJ",
        slug: "club-dj",
        description: "Professional club DJs",
        displayOrder: 3,
      },
    ],
  },
  {
    name: "MCs",
    slug: "mcs",
    description: "Master of Ceremonies and event hosting services",
    icon: "Mic",
    isFeatured: false,
    displayOrder: 11,
    coverImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Master of Ceremonies",
        slug: "master-of-ceremonies",
        description: "Professional MC services",
        displayOrder: 1,
      },
      {
        name: "Hosts",
        slug: "hosts",
        description: "Event hosting services",
        displayOrder: 2,
      },
    ],
  },
  {
    name: "Gele Stylists",
    slug: "gele-stylists",
    description: "Traditional African headwrap and gele styling",
    icon: "Crown",
    isFeatured: false,
    displayOrder: 12,
    coverImage:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Headgear Stylist",
        slug: "headgear-stylist",
        description: "Traditional headgear styling",
        displayOrder: 1,
      },
      {
        name: "Traditional Headwrap",
        slug: "traditional-headwrap",
        description: "Traditional headwrap services",
        displayOrder: 2,
      },
    ],
  },
  {
    name: "Fashion Designers",
    slug: "fashion-designers",
    description: "Custom fashion design and dressmaking services",
    icon: "Shirt",
    isFeatured: false,
    displayOrder: 13,
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Wedding Dressmakers",
        slug: "wedding-dressmakers",
        description: "Specialized wedding dress design",
        displayOrder: 1,
      },
      {
        name: "Outfit Designers",
        slug: "outfit-designers",
        description: "Custom outfit design services",
        displayOrder: 2,
      },
      {
        name: "Bespoke Tailors",
        slug: "bespoke-tailors",
        description: "Bespoke tailoring services",
        displayOrder: 3,
      },
    ],
  },
  {
    name: "Musicians",
    slug: "musicians",
    description: "Live music performances for your event",
    icon: "Music",
    isFeatured: true,
    displayOrder: 14,
    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Live Bands",
        slug: "live-bands",
        description: "Professional live band performances",
        displayOrder: 1,
      },
      {
        name: "Soloists",
        slug: "soloists",
        description: "Solo musical performances",
        displayOrder: 2,
      },
      {
        name: "String Quartet",
        slug: "string-quartet",
        description: "Classical string quartet performances",
        displayOrder: 3,
      },
      {
        name: "Singers",
        slug: "singers",
        description: "Professional vocal performances",
        displayOrder: 4,
      },
    ],
  },
  {
    name: "Bakers",
    slug: "bakers",
    description: "Custom cakes and desserts for your celebration",
    icon: "Cake",
    isFeatured: true,
    displayOrder: 15,
    coverImage:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Cake Designers",
        slug: "cake-designers",
        description: "Custom cake design services",
        displayOrder: 1,
      },
      {
        name: "Cake Makers",
        slug: "cake-makers",
        description: "Professional cake making",
        displayOrder: 2,
      },
      {
        name: "Dessert Table",
        slug: "dessert-table",
        description: "Complete dessert table services",
        displayOrder: 3,
      },
    ],
  },
  {
    name: "Florists",
    slug: "florists",
    description: "Fresh blooms and floral arrangements for your celebration",
    icon: "Flower2",
    isFeatured: true,
    displayOrder: 16,
    coverImage:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Flower Arrangements",
        slug: "flower-arrangements",
        description: "Custom floral arrangements",
        displayOrder: 1,
      },
      {
        name: "Wedding Flowers",
        slug: "wedding-flowers",
        description: "Specialized wedding floristry",
        displayOrder: 2,
      },
      {
        name: "Bouquet Design",
        slug: "bouquet-design",
        description: "Bridal and event bouquets",
        displayOrder: 3,
      },
    ],
  },
  {
    name: "Souvenir Vendors",
    slug: "souvenir-vendors",
    description: "Event favours and keepsakes for your guests",
    icon: "Gift",
    isFeatured: false,
    displayOrder: 17,
    coverImage:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Gift Favours",
        slug: "gift-favours",
        description: "Custom gift favours for events",
        displayOrder: 1,
      },
      {
        name: "Event Favours",
        slug: "event-favours",
        description: "Specialized event favour services",
        displayOrder: 2,
      },
      {
        name: "Keepsakes",
        slug: "keepsakes",
        description: "Memorable keepsake items",
        displayOrder: 3,
      },
    ],
  },
  {
    name: "Entertainment",
    slug: "entertainment",
    description: "Professional entertainment services for all events",
    icon: "Star",
    isFeatured: false,
    displayOrder: 18,
    coverImage:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Dancers",
        slug: "dancers",
        description: "Professional dance performances",
        displayOrder: 1,
      },
      {
        name: "Performers",
        slug: "performers",
        description: "General entertainment performers",
        displayOrder: 2,
      },
      {
        name: "Magicians",
        slug: "magicians",
        description: "Magic and illusion entertainment",
        displayOrder: 3,
      },
      {
        name: "Comedians",
        slug: "comedians",
        description: "Comedy entertainment services",
        displayOrder: 4,
      },
    ],
  },
  {
    name: "Venues",
    slug: "venues",
    description: "Beautiful spaces and locations for your event",
    icon: "Building2",
    isFeatured: true,
    displayOrder: 19,
    coverImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Banquet Halls",
        slug: "banquet-halls",
        description: "Traditional banquet hall venues",
        displayOrder: 1,
      },
      {
        name: "Outdoor Venues",
        slug: "outdoor-venues",
        description: "Outdoor event spaces",
        displayOrder: 2,
      },
      {
        name: "Hotels",
        slug: "hotels",
        description: "Hotel event spaces",
        displayOrder: 3,
      },
      {
        name: "Marquees",
        slug: "marquees",
        description: "Marquee and tent venues",
        displayOrder: 4,
      },
    ],
  },
  {
    name: "Ice Sculptors",
    slug: "ice-sculptors",
    description: "Artistic ice sculptures and carvings for events",
    icon: "Snowflake",
    isFeatured: false,
    displayOrder: 20,
    coverImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    subcategories: [
      {
        name: "Ice Sculpture",
        slug: "ice-sculpture",
        description: "Custom ice sculpture creation",
        displayOrder: 1,
      },
      {
        name: "Ice Carving",
        slug: "ice-carving",
        description: "Artistic ice carving services",
        displayOrder: 2,
      },
    ],
  },
];

export async function POST(request: NextRequest) {
  try {
    logger.info("Starting enhanced category seeding...");

    for (const categoryData of enhancedCategories) {
      const { subcategories, ...categoryInfo } = categoryData;

      // Create or update the main category
      const category = await prisma.category.upsert({
        where: { slug: categoryInfo.slug },
        update: categoryInfo,
        create: categoryInfo,
      });

      logger.debug(`Processed category: ${category.name}`);

      // Create or update subcategories
      if (subcategories && subcategories.length > 0) {
        for (const subcat of subcategories) {
          await prisma.subcategory.upsert({
            where: { slug: subcat.slug },
            update: {
              ...subcat,
              categoryId: category.id,
            },
            create: {
              ...subcat,
              categoryId: category.id,
            },
          });
        }
        logger.debug(`  Added ${subcategories.length} subcategories`);
      }
    }

    const totalCategories = await prisma.category.count();
    const totalSubcategories = await prisma.subcategory.count();

    return NextResponse.json({
      message: "Enhanced categories seeded successfully!",
      stats: {
        categories: totalCategories,
        subcategories: totalSubcategories,
      },
    });
  } catch (error) {
    logger.error("Error seeding enhanced categories:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Error seeding categories", error: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await prisma.subcategory.deleteMany({});
    await prisma.category.deleteMany({});
    return NextResponse.json({
      message: "All categories and subcategories deleted!",
    });
  } catch (error) {
    logger.error("Error deleting categories:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Error deleting categories", error: errorMessage },
      { status: 500 },
    );
  }
}
