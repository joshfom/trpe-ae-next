import { db } from "./db/drizzle.js";
import { insightTable } from "./db/schema/insight-table.js";
import { eq } from "drizzle-orm";

async function checkInsightData() {
  try {
    console.log("🔍 Checking Insight Data and Published Status...\n");
    
    // Get insights for Arya's author ID
    const aryaAuthorId = "ya2jdytlpp4fxamuzvkdt8x";
    
    const allInsights = await db.query.insightTable.findMany({
      where: eq(insightTable.authorId, aryaAuthorId),
      limit: 10
    });

    console.log(`📰 Found ${allInsights.length} insights for Arya's author ID:`);
    allInsights.forEach(insight => {
      console.log(`  - Title: ${insight.title}`);
      console.log(`    Published: "${insight.isPublished}"`);
      console.log(`    Luxe: ${insight.isLuxe}`);
      console.log(`    AuthorID: ${insight.authorId}`);
      console.log('');
    });

    // Also check unique published values
    console.log("🔍 Checking all unique isPublished values:");
    const allInsightsGeneral = await db.query.insightTable.findMany({
      limit: 100
    });
    
    const uniquePublished = [...new Set(allInsightsGeneral.map(i => i.isPublished))];
    console.log("Unique isPublished values:", uniquePublished);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkInsightData();
