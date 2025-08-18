import { db } from "@/db/drizzle";
import { authorTable } from "@/db/schema/author-table";
import { insightTable } from "@/db/schema/insight-table";
import { eq, and } from "drizzle-orm";

async function checkAuthorsAndInsights() {
  try {
    console.log("🔍 Checking Authors and Insights...\n");
    
    // Check if there are any authors in the database
    const authors = await db.query.authorTable.findMany({
      limit: 10
    });
    
    console.log(`📝 Found ${authors.length} authors in database:`);
    authors.forEach(author => {
      console.log(`  - ID: ${author.id}, Name: ${author.name}`);
    });
    console.log("");
    
    // Check luxe insights and their author assignments
    const luxeInsights = await db.query.insightTable.findMany({
      where: and(
        eq(insightTable.isLuxe, true),
        eq(insightTable.isPublished, "yes")
      ),
      with: {
        author: true
      },
      limit: 10
    });
    
    console.log(`📰 Found ${luxeInsights.length} luxe insights:`);
    luxeInsights.forEach(insight => {
      console.log(`  - Title: ${insight.title}`);
      console.log(`    AuthorID: ${insight.authorId || 'NULL'}`);
      console.log(`    Author Name: ${insight.author?.name || 'NO AUTHOR ASSIGNED'}`);
      console.log("");
    });
    
  } catch (error) {
    console.error("❌ Error checking database:", error);
  }
}

checkAuthorsAndInsights();
