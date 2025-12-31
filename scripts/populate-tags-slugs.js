// Simple script to populate tags and slugs for existing providers
// This runs in the Next.js environment to avoid Prisma client issues

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Initialize Prisma with the same configuration as the app
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

// Helper function to generate slug from business name
function generateSlug(businessName) {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to generate tags from existing data
function generateTags(provider) {
  const tags = new Set();
  
  // Add categories as tags
  if (provider.categories && Array.isArray(provider.categories)) {
    provider.categories.forEach(cat => {
      if (cat && typeof cat === 'string') {
        tags.add(cat.toLowerCase().trim());
      }
    });
  }
  
  // Add subcategories as tags
  if (provider.subcategories && Array.isArray(provider.subcategories)) {
    provider.subcategories.forEach(subcat => {
      if (subcat && typeof subcat === 'string') {
        tags.add(subcat.toLowerCase().trim());
      }
    });
  }
  
  // Add cultural tradition tags
  if (provider.cultureTraditionTags && Array.isArray(provider.cultureTraditionTags)) {
    provider.cultureTraditionTags.forEach(tag => {
      if (tag && typeof tag === 'string') {
        tags.add(tag.toLowerCase().trim());
      }
    });
  }
  
  // Add city as tag
  if (provider.city && typeof provider.city === 'string') {
    tags.add(provider.city.toLowerCase().trim());
  }
  
  // Extract keywords from business name
  if (provider.businessName && typeof provider.businessName === 'string') {
    const nameWords = provider.businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2); // Only words longer than 2 chars
    
    nameWords.forEach(word => {
      if (word) tags.add(word);
    });
  }
  
  return Array.from(tags).filter(tag => tag && tag.length > 0);
}

async function populateTagsAndSlugs() {
  console.log('🚀 Starting to populate tags and slugs...');
  
  try {
    // Get all providers that need updates
    const providers = await prisma.provider.findMany({
      where: {
        OR: [
          { slug: null },
          { tags: { isEmpty: true } }
        ]
      },
      select: {
        id: true,
        businessName: true,
        description: true,
        categories: true,
        subcategories: true,
        cultureTraditionTags: true,
        city: true,
        slug: true,
        tags: true,
      }
    });
    
    console.log(`📊 Found ${providers.length} providers to update`);
    
    if (providers.length === 0) {
      console.log('✅ All providers already have tags and slugs!');
      return;
    }
    
    let updated = 0;
    const usedSlugs = new Set();
    
    // Get existing slugs to avoid duplicates
    const existingSlugs = await prisma.provider.findMany({
      where: { slug: { not: null } },
      select: { slug: true }
    });
    
    existingSlugs.forEach(p => {
      if (p.slug) usedSlugs.add(p.slug);
    });
    
    for (const provider of providers) {
      try {
        const updates = {};
        
        // Generate slug if missing
        if (!provider.slug && provider.businessName) {
          let baseSlug = generateSlug(provider.businessName);
          let finalSlug = baseSlug;
          let counter = 1;
          
          // Ensure uniqueness
          while (usedSlugs.has(finalSlug)) {
            finalSlug = `${baseSlug}-${counter}`;
            counter++;
          }
          
          usedSlugs.add(finalSlug);
          updates.slug = finalSlug;
        }
        
        // Generate tags if missing or empty
        if (!provider.tags || provider.tags.length === 0) {
          const generatedTags = generateTags(provider);
          if (generatedTags.length > 0) {
            updates.tags = generatedTags;
          }
        }
        
        // Update if we have changes
        if (Object.keys(updates).length > 0) {
          await prisma.provider.update({
            where: { id: provider.id },
            data: updates
          });
          updated++;
          
          console.log(`✅ Updated ${provider.businessName}: ${Object.keys(updates).join(', ')}`);
        }
        
      } catch (error) {
        console.error(`❌ Error updating provider ${provider.businessName}:`, error.message);
      }
    }
    
    console.log(`🎉 Successfully updated ${updated} providers!`);
    
  } catch (error) {
    console.error('💥 Error during population:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Export for use in other scripts
module.exports = { populateTagsAndSlugs, generateSlug, generateTags };

// Run if called directly
if (require.main === module) {
  populateTagsAndSlugs()
    .then(() => {
      console.log('✨ Population completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Population failed:', error);
      process.exit(1);
    });
}