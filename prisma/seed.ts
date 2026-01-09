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
    metaDescription: "Find top-rated event vendors in London. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in London.",
    seoIntro: "Discover the best event services in London. From stunning venues to expert planners, explore our curated list of London's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Birmingham. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Birmingham.",
    seoIntro: "Discover the best event services in Birmingham. From stunning venues to expert planners, explore our curated list of Birmingham's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Manchester. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Manchester.",
    seoIntro: "Discover the best event services in Manchester. From stunning venues to expert planners, explore our curated list of Manchester's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Leeds. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Leeds.",
    seoIntro: "Discover the best event services in Leeds. From stunning venues to expert planners, explore our curated list of Leeds' top event professionals."
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
    metaDescription: "Find top-rated event vendors in Bristol. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Bristol.",
    seoIntro: "Discover the best event services in Bristol. From stunning venues to expert planners, explore our curated list of Bristol's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Nottingham. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Nottingham.",
    seoIntro: "Discover the best event services in Nottingham. From stunning venues to expert planners, explore our curated list of Nottingham's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Sheffield. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Sheffield.",
    seoIntro: "Discover the best event services in Sheffield. From stunning venues to expert planners, explore our curated list of Sheffield's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Leicester. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Leicester.",
    seoIntro: "Discover the best event services in Leicester. From stunning venues to expert planners, explore our curated list of Leicester's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Coventry. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Coventry.",
    seoIntro: "Discover the best event services in Coventry. From stunning venues to expert planners, explore our curated list of Coventry's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Luton. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Luton.",
    seoIntro: "Discover the best event services in Luton. From stunning venues to expert planners, explore our curated list of Luton's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Milton Keynes. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Milton Keynes.",
    seoIntro: "Discover the best event services in Milton Keynes. From stunning venues to expert planners, explore our curated list of Milton Keynes' top event professionals."
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
    metaDescription: "Find top-rated event vendors in Reading. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Reading.",
    seoIntro: "Discover the best event services in Reading. From stunning venues to expert planners, explore our curated list of Reading's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Brighton. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Brighton.",
    seoIntro: "Discover the best event services in Brighton. From stunning venues to expert planners, explore our curated list of Brighton's top event professionals."
  },
  {
    name: "Oxford",
    slug: "oxford",
    country: "UK",
    county: "Oxfordshire",
    region: "South East",
    latitude: 51.7520,
    longitude: -1.2577,
    isFeatured: true,
    displayOrder: 14,
    metaTitle: "Event Vendors & Services in Oxford | EVA Marketplace",
    metaDescription: "Find top-rated event vendors in Oxford. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Oxford.",
    seoIntro: "Discover the best event services in Oxford. From stunning venues to expert planners, explore our curated list of Oxford's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Cambridge. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Cambridge.",
    seoIntro: "Discover the best event services in Cambridge. From stunning venues to expert planners, explore our curated list of Cambridge's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Liverpool. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Liverpool.",
    seoIntro: "Discover the best event services in Liverpool. From stunning venues to expert planners, explore our curated list of Liverpool's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Newcastle upon Tyne. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Newcastle upon Tyne.",
    seoIntro: "Discover the best event services in Newcastle upon Tyne. From stunning venues to expert planners, explore our curated list of Newcastle upon Tyne's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Cardiff. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Cardiff.",
    seoIntro: "Discover the best event services in Cardiff. From stunning venues to expert planners, explore our curated list of Cardiff's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Edinburgh. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Edinburgh.",
    seoIntro: "Discover the best event services in Edinburgh. From stunning venues to expert planners, explore our curated list of Edinburgh's top event professionals."
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
    metaDescription: "Find top-rated event vendors in Glasgow. Compare venues, photographers, caterers, and more. Trusted professionals for your perfect event in Glasgow.",
    seoIntro: "Discover the best event services in Glasgow. From stunning venues to expert planners, explore our curated list of Glasgow's top event professionals."
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

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: city,
      create: city, // Removed duplicate 'city' and fixed property access
    });
  }
  console.log("Cities seeded!");
}
