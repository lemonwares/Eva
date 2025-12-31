const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
  if (provider.categories) {
    provider.categories.forEach(cat => {
      if (cat) tags.add(cat.toLowerCase());
    });
  }
  
  // Add subcategories as tags
  if (provider.subcategories) {
    provider.subcategories.forEach(subcat => {
      if (subcat) tags.add(subcat.toLowerCase());
    });
  }
  
  // Add cultural tradition tags
  if (provider.cultureTraditionTags) {
    provider.cultureTraditionTags.forEach(tag => {
      if (tag) tags.add(tag.toLowerCase());
    });
  }
  
  // Add city as tag
  if (provider.city) {
    tags.add(provider.city.toLowerCase());
  }
  
  // Extract keywords from business name
  if (provider.businessName) {
    const nameWords = provider.businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2); // Only words longer than 2 chars
    
    nameWords.forEach(word => tags.add(word));
  }
  
  // Extract keywords from description (first 100 words)
  if (provider.description) {
    const descWords = provider.description
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .slice(0, 100) // First 100 words only
      .filter(word => word.length > 3); // Only words longer than 3 chars
    
    // Add only meaningful words (you can expand this list)
    const meaningfulWords = descWords.filter(word => 
      ['wedding', 'photography', 'catering', 'venue', 'music', 'flowers', 
       'planning', 'decoration', 'professional', 'service', 'event', 
       'celebration', 'party', 'corporate', 'birthday', 'anniversary'].includes(word)
    );
    
    meaningfulWords.forEach(word => tags.add(word));
  }
  
  return Array.from(tags);
}

async function migrateProviders() {
  console.log('🚀 Starting migration: Adding slug and tags to providers...');
  
  try {
    // Get all providers
    const providers = await prisma.provider.findMany({
      select: {
        id: true,
        businessName: true,
        description: true,
        categories: true,
        subcategories: true,
        cultureTraditionTags: true,
        city: true,
        slug: true, // Check if already exists
        tags: true, // Check if already exists
      }
    });
    
    console.log(`📊 Found ${providers.length} providers to process`);
    
    let updated = 0;
    let skipped = 0;
    const slugs = new Set(); // Track used slugs
    
    for (const provider of providers) {
      try {
        const updates = {};
        
        // Generate slug if not exists
        if (!provider.slug) {
          let baseSlug = generateSlug(provider.businessName);
          let finalSlug = baseSlug;
          let counter = 1;
          
          // Ensure uniqueness
          while (slugs.has(finalSlug)) {
            finalSlug = `${baseSlug}-${counter}`;
            counter++;
          }
          
          slugs.add(finalSlug);
          updates.slug = finalSlug;
        } else {
          slugs.add(provider.slug);
        }
        
        // Generate tags if not exists or empty
        if (!provider.tags || provider.tags.length === 0) {
          const generatedTags = generateTags(provider);
          updates.tags = generatedTags;
        }
        
        // Update if we have changes
        if (Object.keys(updates).length > 0) {
          await prisma.provider.update({
            where: { id: provider.id },
            data: updates
          });
          updated++;
          
          if (updated % 10 === 0) {
            console.log(`✅ Updated ${updated} providers...`);
          }
        } else {
          skipped++;
        }
        
      } catch (error) {
        console.error(`❌ Error updating provider ${provider.id}:`, error.message);
      }
    }
    
    console.log(`🎉 Migration completed!`);
    console.log(`   ✅ Updated: ${updated} providers`);
    console.log(`   ⏭️  Skipped: ${skipped} providers (already had data)`);
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
if (require.main === module) {
  migrateProviders()
    .then(() => {
      console.log('✨ Migration script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateProviders, generateSlug, generateTags };