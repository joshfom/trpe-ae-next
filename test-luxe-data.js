// Quick test to check if luxe data exists in the database
import { db } from './db/drizzle.ts';
import { insightTable } from './db/schema/insight-table.ts';
import { propertyTable } from './db/schema/property-table.ts';
import { eq, and } from 'drizzle-orm';

async function testLuxeData() {
  try {
    console.log('🔍 Testing luxe data in database...\n');
    
    // Test luxe journals
    const luxeJournals = await db.query.insightTable.findMany({
      where: and(
        eq(insightTable.isLuxe, true),
        eq(insightTable.isPublished, "yes")
      ),
      limit: 5
    });
    
    console.log(`📰 Found ${luxeJournals.length} luxe journals:`);
    luxeJournals.forEach((journal, index) => {
      console.log(`  ${index + 1}. "${journal.title}" - slug: ${journal.slug}`);
    });
    
    // Test luxe properties
    const luxeProperties = await db.query.propertyTable.findMany({
      where: eq(propertyTable.isLuxe, true),
      with: {
        offeringType: true,
      },
      limit: 5
    });
    
    console.log(`\n🏠 Found ${luxeProperties.length} luxe properties:`);
    luxeProperties.forEach((property, index) => {
      console.log(`  ${index + 1}. "${property.title || property.name}" - slug: ${property.slug}`);
      console.log(`      offering: ${property.offeringType?.slug}`);
    });
    
    console.log('\n✅ Test complete!');
    
  } catch (error) {
    console.error('❌ Error testing luxe data:', error);
  }
  
  process.exit(0);
}

testLuxeData();
