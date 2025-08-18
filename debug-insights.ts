import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { eq, and, desc } from "drizzle-orm";

async function debugLuxeInsights() {
  try {
    console.log("🔍 Debugging Luxe Insights Data Flow...\n");
    
    // Simulate the exact query from getFeaturedLuxeInsights
    const featuredInsights = await db.query.insightTable.findMany({
      where: and(
        eq(insightTable.isLuxe, true),
        eq(insightTable.isPublished, "yes")
      ),
      orderBy: [desc(insightTable.publishedAt), desc(insightTable.createdAt)],
      limit: 3,
      with: {
        author: true
      }
    });
    
    console.log("📰 Featured Insights (exactly as fetched in app/luxe/page.tsx):");
    featuredInsights.forEach((insight, index) => {
      console.log(`  ${index + 1}. Title: ${insight.title}`);
      console.log(`     Author ID: ${insight.authorId || 'NULL'}`);
      console.log(`     Author Object:`, insight.author);
      console.log(`     Author Name: ${insight.author?.name || 'NO AUTHOR'}`);
      
      // Simulate the transformation logic from app/luxe/page.tsx
      const transformedAuthor = insight.author?.name || 'TRPE Luxe Team';
      console.log(`     Transformed Author: ${transformedAuthor}`);
      console.log("");
    });
    
    console.log("---");
    
    // Also check the getLuxeInsightsAction query
    const journalsInsights = await db.query.insightTable.findMany({
      where: and(
        eq(insightTable.isLuxe, true),
        eq(insightTable.isPublished, "yes")
      ),
      orderBy: [desc(insightTable.publishedAt), desc(insightTable.createdAt)],
      limit: 9,
      offset: 0,
      with: {
        author: true
      }
    });
    
    console.log("📋 Journals Insights (exactly as fetched in getLuxeInsightsAction):");
    journalsInsights.slice(0, 3).forEach((insight, index) => {
      console.log(`  ${index + 1}. Title: ${insight.title}`);
      console.log(`     Author ID: ${insight.authorId || 'NULL'}`);
      console.log(`     Author Object:`, insight.author);
      console.log(`     Author Name: ${insight.author?.name || 'NO AUTHOR'}`);
      
      // Simulate the transformation logic from LuxeJournalsClient
      const transformedAuthor = insight.author?.name || 'TRPE Luxe Team';
      console.log(`     Transformed Author: ${transformedAuthor}`);
      console.log("");
    });
    
  } catch (error) {
    console.error("❌ Error debugging insights:", error);
  }
}

debugLuxeInsights();
