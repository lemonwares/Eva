import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

// Map old/simple slugs to new standardized slugs
const slugMap = {
  makeup: "makeup-artists",
  photographers: "photographers",
  videography: "videographers",
  videographers: "videographers",
  dj: "djs",
  djs: "djs",
  music: "musicians",
  decorators: "decorators",
  decoration: "decoration",
  venue: "venues",
  venues: "venues",
  caterers: "caterers",
  florists: "florists",
  bakers: "bakers",
  eventplanners: "event-planners",
  planners: "event-planners",
  "hair stylists": "hair-stylists",
  hairstylists: "hair-stylists",
};

async function run() {
  console.log("Normalizing provider category slugs...");

  const providers = await prisma.provider.findMany({
    select: { id: true, categories: true },
  });

  let updatedCount = 0;

  for (const p of providers) {
    const updatedCategories = (p.categories || []).map((c) => {
      const key = String(c).toLowerCase();
      return slugMap[key] ?? c;
    });

    // Deduplicate
    const deduped = Array.from(new Set(updatedCategories));

    // If changed, persist
    const changed = JSON.stringify(deduped) !== JSON.stringify(p.categories);
    if (changed) {
      await prisma.provider.update({
        where: { id: p.id },
        data: { categories: deduped },
      });
      updatedCount += 1;
    }
  }

  console.log(`Providers updated: ${updatedCount}`);
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
