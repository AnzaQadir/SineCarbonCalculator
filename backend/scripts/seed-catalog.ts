/**
 * Script to seed the recommendation catalog with full data
 * Run with: npx ts-node scripts/seed-catalog.ts
 */

import { initializeDatabase } from '../src/models';
import { seedFullCatalog } from '../src/services/engagement/seedCatalog';

async function main() {
  try {
    console.log('🚀 Starting catalog seed...');
    
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connected');
    
    // Seed the catalog
    await seedFullCatalog();
    console.log('✅ Catalog seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding catalog:', error);
    process.exit(1);
  }
}

main();




