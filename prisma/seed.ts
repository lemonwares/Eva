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
const SEED_OWNER_EMAIL = "vendor@evalocal.com";

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

// ─── Category-specific listings ─────────────────────────────────────────────
function getCategoryListings(categorySlug: string, vendorCount: number) {
  const v = vendorCount % 5;
  const listings: Record<string, any[]> = {
    venues: [
      {
        headline: "Half-Day Venue Hire",
        longDescription:
          "Up to 6 hours exclusive use of our main hall, tables, chairs, and basic AV setup. Perfect for intimate gatherings and daytime events.",
        price: 800 + v * 100,
        minPrice: 800,
        maxPrice: 1200,
        timeEstimate: "6 Hours",
        maxGuests: 80,
        category: "venues",
      },
      {
        headline: "Full-Day Venue Hire",
        longDescription:
          "12 hours exclusive use including setup and breakdown time. Includes full AV system, stage, dance floor, and dedicated event coordinator.",
        price: 1800 + v * 200,
        minPrice: 1800,
        maxPrice: 2500,
        timeEstimate: "12 Hours",
        maxGuests: 200,
        category: "venues",
      },
      {
        headline: "Weekend Wedding Package",
        longDescription:
          "Two-day exclusive hire for weddings. Includes bridal suite, ceremony room, reception hall, catering kitchen access, and on-site parking.",
        price: 4500 + v * 300,
        minPrice: 4500,
        maxPrice: 6000,
        timeEstimate: "2 Days",
        maxGuests: 300,
        category: "venues",
      },
    ],
    photographers: [
      {
        headline: "2-Hour Portrait Session",
        longDescription:
          "Professional portrait session at a location of your choice. Includes 30 edited high-resolution digital images delivered within 7 days.",
        price: 250 + v * 30,
        minPrice: 250,
        maxPrice: 350,
        timeEstimate: "2 Hours",
        maxGuests: 10,
        category: "photographers",
      },
      {
        headline: "Wedding Day Coverage",
        longDescription:
          "Full wedding day photography from bridal prep to first dance. Two photographers, 500+ edited images, online gallery, and USB delivery.",
        price: 1800 + v * 200,
        minPrice: 1800,
        maxPrice: 2800,
        timeEstimate: "Full Day",
        maxGuests: 300,
        category: "photographers",
      },
      {
        headline: "Event Photography Package",
        longDescription:
          "Professional coverage of your corporate event, birthday, or celebration. Includes 200+ edited images and same-week delivery.",
        price: 600 + v * 80,
        minPrice: 600,
        maxPrice: 900,
        timeEstimate: "4 Hours",
        maxGuests: 150,
        category: "photographers",
      },
    ],
    caterers: [
      {
        headline: "Canape & Drinks Reception",
        longDescription:
          "Elegant canape selection with 8 varieties, served by uniformed staff. Includes soft drinks, juice, and sparkling water for up to 50 guests.",
        price: 600 + v * 50,
        minPrice: 600,
        maxPrice: 900,
        timeEstimate: "2 Hours",
        maxGuests: 50,
        category: "caterers",
      },
      {
        headline: "3-Course Sit-Down Dinner",
        longDescription:
          "Formal three-course dinner with starter, main, and dessert. Choice of 3 menus including vegetarian and halal options. Includes table service.",
        price: 2200 + v * 200,
        minPrice: 2200,
        maxPrice: 3500,
        timeEstimate: "4 Hours",
        maxGuests: 100,
        category: "caterers",
      },
      {
        headline: "Buffet Package",
        longDescription:
          "Hot and cold buffet with 12 dishes including rice, salads, mains, and desserts. Suitable for all dietary requirements. Includes setup and service staff.",
        price: 1200 + v * 100,
        minPrice: 1200,
        maxPrice: 2000,
        timeEstimate: "3 Hours",
        maxGuests: 150,
        category: "caterers",
      },
    ],
    "music-djs": [
      {
        headline: "4-Hour DJ Set",
        longDescription:
          "Professional DJ with full PA system, lighting rig, and wireless microphone. Plays your requested playlist and takes live requests throughout the event.",
        price: 400 + v * 50,
        minPrice: 400,
        maxPrice: 600,
        timeEstimate: "4 Hours",
        maxGuests: 200,
        category: "music-djs",
      },
      {
        headline: "Full Evening Entertainment",
        longDescription:
          "8-hour DJ package with ceremony music, cocktail hour playlist, and full evening reception. Includes photo booth and LED dance floor.",
        price: 1200 + v * 100,
        minPrice: 1200,
        maxPrice: 1800,
        timeEstimate: "8 Hours",
        maxGuests: 300,
        category: "music-djs",
      },
      {
        headline: "Live Band + DJ Combo",
        longDescription:
          "3-piece live band for 2 hours followed by DJ for the rest of the evening. Perfect for weddings and milestone celebrations.",
        price: 2500 + v * 200,
        minPrice: 2500,
        maxPrice: 3500,
        timeEstimate: "6 Hours",
        maxGuests: 250,
        category: "music-djs",
      },
    ],
    florists: [
      {
        headline: "Bridal Bouquet & Buttonholes",
        longDescription:
          "Hand-tied bridal bouquet with matching bridesmaid posies and 6 buttonholes. Seasonal flowers in your chosen colour palette.",
        price: 350 + v * 40,
        minPrice: 350,
        maxPrice: 500,
        timeEstimate: "Delivery",
        maxGuests: 1,
        category: "florists",
      },
      {
        headline: "Full Wedding Floral Package",
        longDescription:
          "Complete wedding florals including bridal party flowers, ceremony arch, top table centrepiece, and 10 guest table arrangements.",
        price: 1800 + v * 200,
        minPrice: 1800,
        maxPrice: 2800,
        timeEstimate: "Full Day Setup",
        maxGuests: 200,
        category: "florists",
      },
      {
        headline: "Event Table Centrepieces",
        longDescription:
          "Bespoke floral centrepieces for your event tables. Price per table includes vase, foam, and seasonal flowers. Minimum 5 tables.",
        price: 85 + v * 10,
        minPrice: 85,
        maxPrice: 150,
        timeEstimate: "Per Table",
        maxGuests: 10,
        category: "florists",
      },
    ],
    "event-planners": [
      {
        headline: "Day-Of Coordination",
        longDescription:
          "Professional coordinator manages your event on the day. Includes vendor liaison, timeline management, and problem-solving so you can enjoy your day.",
        price: 800 + v * 100,
        minPrice: 800,
        maxPrice: 1200,
        timeEstimate: "Full Day",
        maxGuests: 300,
        category: "event-planners",
      },
      {
        headline: "Full Event Planning Package",
        longDescription:
          "End-to-end event planning from concept to execution. Includes venue sourcing, vendor management, budget tracking, and on-the-day coordination.",
        price: 3500 + v * 300,
        minPrice: 3500,
        maxPrice: 5000,
        timeEstimate: "3-6 Months",
        maxGuests: 300,
        category: "event-planners",
      },
      {
        headline: "Partial Planning Consultation",
        longDescription:
          "3 planning sessions plus email support to help you organise your event. Ideal if you've started planning but need expert guidance.",
        price: 500 + v * 50,
        minPrice: 500,
        maxPrice: 800,
        timeEstimate: "3 Sessions",
        maxGuests: 1,
        category: "event-planners",
      },
    ],
    bakers: [
      {
        headline: "2-Tier Celebration Cake",
        longDescription:
          "Custom 2-tier cake serving 40-60 guests. Choice of sponge, filling, and fondant or buttercream finish. Includes delivery and setup.",
        price: 280 + v * 30,
        minPrice: 280,
        maxPrice: 400,
        timeEstimate: "Delivery",
        maxGuests: 60,
        category: "bakers",
      },
      {
        headline: "3-Tier Wedding Cake",
        longDescription:
          "Elegant 3-tier wedding cake serving 80-120 guests. Fully bespoke design consultation included. Flavours include vanilla, lemon, chocolate, and red velvet.",
        price: 650 + v * 60,
        minPrice: 650,
        maxPrice: 900,
        timeEstimate: "Delivery",
        maxGuests: 120,
        category: "bakers",
      },
      {
        headline: "Dessert Table Package",
        longDescription:
          "Full dessert table setup including mini cakes, macarons, cake pops, brownies, and cupcakes. Serves 80 guests. Includes display stands and signage.",
        price: 900 + v * 80,
        minPrice: 900,
        maxPrice: 1300,
        timeEstimate: "Setup Included",
        maxGuests: 80,
        category: "bakers",
      },
    ],
    decorators: [
      {
        headline: "Balloon Arch & Backdrop",
        longDescription:
          "Organic balloon arch in your chosen colours with matching backdrop. Perfect for photo opportunities. Includes setup and collection.",
        price: 350 + v * 40,
        minPrice: 350,
        maxPrice: 500,
        timeEstimate: "Half Day",
        maxGuests: 200,
        category: "decorators",
      },
      {
        headline: "Full Venue Transformation",
        longDescription:
          "Complete venue styling including ceiling draping, table linen, centrepieces, chair covers, lighting, and entrance decor. Includes setup and breakdown.",
        price: 2500 + v * 250,
        minPrice: 2500,
        maxPrice: 4000,
        timeEstimate: "Full Day",
        maxGuests: 200,
        category: "decorators",
      },
      {
        headline: "Table Centrepiece Hire",
        longDescription:
          "Luxury centrepiece hire per table. Options include candelabras, mirror balls, floral arrangements, and lanterns. Minimum 5 tables.",
        price: 65 + v * 10,
        minPrice: 65,
        maxPrice: 120,
        timeEstimate: "Per Table",
        maxGuests: 10,
        category: "decorators",
      },
    ],
    "makeup-artists": [
      {
        headline: "Bridal Makeup",
        longDescription:
          "Full bridal makeup application using premium products. Includes trial session, on-the-day application, and touch-up kit. Lasts all day.",
        price: 280 + v * 30,
        minPrice: 280,
        maxPrice: 400,
        timeEstimate: "3 Hours",
        maxGuests: 1,
        category: "makeup-artists",
      },
      {
        headline: "Bridal Party Package",
        longDescription:
          "Makeup for bride and up to 4 bridesmaids. Includes trial for bride, morning-of application for all, and touch-up products.",
        price: 750 + v * 80,
        minPrice: 750,
        maxPrice: 1100,
        timeEstimate: "Full Morning",
        maxGuests: 5,
        category: "makeup-artists",
      },
      {
        headline: "Glam Event Makeup",
        longDescription:
          "Professional makeup for parties, proms, and special occasions. Includes lashes and setting spray for long-lasting wear.",
        price: 120 + v * 15,
        minPrice: 120,
        maxPrice: 180,
        timeEstimate: "1.5 Hours",
        maxGuests: 1,
        category: "makeup-artists",
      },
    ],
    videographers: [
      {
        headline: "Highlight Reel Package",
        longDescription:
          "3-5 minute cinematic highlight video of your event. Delivered within 4 weeks. Includes drone footage where permitted.",
        price: 800 + v * 100,
        minPrice: 800,
        maxPrice: 1200,
        timeEstimate: "Full Day",
        maxGuests: 300,
        category: "videographers",
      },
      {
        headline: "Full Wedding Film",
        longDescription:
          "Full wedding day videography including ceremony, speeches, and reception. Delivered as feature film (60-90 min) plus highlight reel. 4K quality.",
        price: 2200 + v * 200,
        minPrice: 2200,
        maxPrice: 3200,
        timeEstimate: "Full Day",
        maxGuests: 300,
        category: "videographers",
      },
      {
        headline: "Social Media Content Package",
        longDescription:
          "Short-form video content optimised for Instagram and TikTok. Includes 3 reels and 10 story clips delivered within 48 hours.",
        price: 400 + v * 50,
        minPrice: 400,
        maxPrice: 600,
        timeEstimate: "4 Hours",
        maxGuests: 50,
        category: "videographers",
      },
    ],
  };

  return (
    listings[categorySlug] || [
      {
        headline: "Essential Package",
        longDescription:
          "Our entry-level service covering all the basics for your event.",
        price: 400 + v * 50,
        minPrice: 400,
        maxPrice: 600,
        timeEstimate: "Half Day",
        maxGuests: 50,
        category: categorySlug,
      },
      {
        headline: "Standard Package",
        longDescription:
          "Our most popular service with everything you need for a great event.",
        price: 800 + v * 100,
        minPrice: 800,
        maxPrice: 1200,
        timeEstimate: "Full Day",
        maxGuests: 100,
        category: categorySlug,
      },
      {
        headline: "Premium Package",
        longDescription:
          "The full experience — our most comprehensive service for unforgettable events.",
        price: 1800 + v * 200,
        minPrice: 1800,
        maxPrice: 2500,
        timeEstimate: "Full Day",
        maxGuests: 200,
        category: categorySlug,
      },
    ]
  );
}

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

  // ── 3. Seed admin + vendor accounts ─────────────────────────
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@evalocal.com" },
    update: {},
    create: {
      email: "admin@evalocal.com",
      name: "EVA Admin",
      password: hashedPassword,
      role: UserRole.ADMINISTRATOR,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`✅ Admin     — admin@evalocal.com ready`);

  await prisma.user.upsert({
    where: { email: "client@evalocal.com" },
    update: {},
    create: {
      email: "client@evalocal.com",
      name: "Test Client",
      password: hashedPassword,
      role: UserRole.CLIENT,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`✅ Client    — client@evalocal.com ready`);

  // ── 4. Seed owner + test vendors ─────────────────────────────
  const seedOwner = await prisma.user.upsert({
    where: { email: SEED_OWNER_EMAIL },
    update: { emailVerifiedAt: new Date() },
    create: {
      email: SEED_OWNER_EMAIL,
      name: "Eva Seed Vendor",
      password: hashedPassword,
      role: UserRole.PROFESSIONAL,
      emailVerifiedAt: new Date(),
    },
  });

  const allCategories = await prisma.category.findMany();
  const seedCities = await prisma.city.findMany({
    where: {
      slug: { in: ["london", "birmingham", "manchester", "leeds", "bristol"] },
    },
  });

  let vendorCount = 0;
  let vendorsCreated = 0;
  let listingsUpserted = 0;

  for (const cat of allCategories) {
    for (let i = 0; i < 8; i++) {
      const city = seedCities[i % seedCities.length];
      const nameBase = vendorNames[(vendorCount + i) % vendorNames.length];
      const bName = `${nameBase} ${cat.name.replace(/s$/, "")}`;
      const slug = `${bName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${String(vendorCount).padStart(3, "0")}`;
      const postcodes = cityPostcodes[city.slug] ?? ["SW1A 1AA"];
      const postcode = postcodes[i % postcodes.length];
      const geoLat = (city.latitude ?? 51.5) + (Math.random() - 0.5) * 0.08;
      const geoLng = (city.longitude ?? -0.12) + (Math.random() - 0.5) * 0.08;

      let provider = await prisma.provider.findUnique({ where: { slug } });

      if (!provider) {
        provider = await prisma.provider.create({
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
            isFeatured: i < 2,
            planTier: PlanTier.PREMIUM,
            priceFrom: 200 + (vendorCount % 8) * 100,
            averageRating: 4 + Math.random(),
            reviewCount: 10 + (vendorCount % 50),
            coverImage: cat.coverImage,
            photos: vendorPhotos,
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
        vendorsCreated++;
      }


      // Listings — always replace with category-specific ones
      await prisma.listing.deleteMany({ where: { providerId: provider.id } });
      const listingData = getCategoryListings(cat.slug, vendorCount);
      await prisma.listing.createMany({
        data: listingData.map((l) => ({ ...l, providerId: provider!.id })),
      });
      listingsUpserted += listingData.length;

      // Reviews — create if none, approve all existing
      const existingReviews = await prisma.review.count({ where: { providerId: provider.id } });
      if (existingReviews === 0) {
        await prisma.review.createMany({
          data: [
            { providerId: provider.id, rating: 5, authorName: "Sarah Johnson", authorEmail: "sarah@example.com", body: "Absolutely wonderful service! They exceeded all our expectations and made our day truly special.", isApproved: true, isVerifiedBooking: true },
            { providerId: provider.id, rating: 4, authorName: "Mark Wilson", authorEmail: "mark@example.com", body: "Very professional and great quality. Highly recommended for any event.", isApproved: true, isVerifiedBooking: true },
            { providerId: provider.id, rating: 5, authorName: "Aisha Patel", authorEmail: "aisha@example.com", body: "Outstanding experience from start to finish. Will definitely book again!", isApproved: true },
          ],
        });
      } else {
        await prisma.review.updateMany({
          where: { providerId: provider.id, isApproved: false },
          data: { isApproved: true },
        });
      }

      vendorCount++;
    }
  }

  console.log(
    `✅ Vendors   — ${vendorsCreated} created, ${vendorCount - vendorsCreated} already existed`,
  );
  console.log(`✅ Listings  — ${listingsUpserted} created across vendors`);

  console.log("\n🌱 Seed complete!");
}

// Self-invoke when run as a standalone script (e.g. tsx prisma/seed.ts)
seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
