import { prisma } from "../lib/prisma";

// Map old/simple slugs to new standardized slugs
const slugMap: Record<string, string> = {
  makeup: "makeup-artists",
  photographers: "photographers",
  videography: "videographers",
  dj: "djs",
  music: "musicians",
  decorators: "decorators",
  decoration: "decoration",
  venue: "venues",
  caterers: "caterers",
  florists: "florists",
  bakers: "bakers",
  eventplanners: "event-planners",
  planners: "event-planners",
};

async function run() {
  console.log("Normalizing provider category slugs...");

  const providers = await prisma.provider.findMany({
    select: { id: true, categories: true },
  });

  let updatedCount = 0;

  for (const p of providers) {
    const updatedCategories = (p.categories || []).map((c) => {
      const key = c.toLowerCase();
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
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
