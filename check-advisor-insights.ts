import { db } from "./db/drizzle.js";
import { employeeTable } from "./db/schema/employee-table.js";
import { insightTable } from "./db/schema/insight-table.js";
import { eq, and } from "drizzle-orm";

async function checkAdvisorInsights() {
  try {
    console.log("🔍 Checking Advisor Insights Through Author Relations...\n");
    
    // Check specific advisor
    const advisor = await db.query.employeeTable.findFirst({
      where: and(
        eq(employeeTable.slug, "arya-daryabor"),
        eq(employeeTable.isLuxe, true),
        eq(employeeTable.isVisible, true)
      ),
      with: {
        author: {
          with: {
            insights: {
              where: and(
                eq(insightTable.isLuxe, true),
                eq(insightTable.isPublished, 'true')
              ),
              orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
              limit: 20
            }
          }
        }
      }
    });

    if (advisor) {
      console.log(`👤 Advisor: ${advisor.firstName} ${advisor.lastName}`);
      console.log(`📝 Author: ${advisor.author ? advisor.author.name : 'No author'}`);
      
      if (advisor.author && advisor.author.insights) {
        console.log(`📰 Author has ${advisor.author.insights.length} insights:`);
        advisor.author.insights.forEach(insight => {
          console.log(`  - ${insight.title}`);
          console.log(`    Published: ${insight.isPublished}, Luxe: ${insight.isLuxe}`);
        });
      } else {
        console.log("❌ No insights found through author relationship");
        
        // Check insights directly by authorId
        console.log("\n🔍 Checking insights by direct authorId lookup...");
        const directInsights = await db.query.insightTable.findMany({
          where: and(
            eq(insightTable.isLuxe, true),
            eq(insightTable.isPublished, 'true'),
            eq(insightTable.authorId, advisor.authorId || "")
          ),
          orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
          limit: 20
        });
        
        console.log(`📰 Found ${directInsights.length} insights by direct lookup:`);
        directInsights.forEach(insight => {
          console.log(`  - ${insight.title}`);
          console.log(`    Published: ${insight.isPublished}, Luxe: ${insight.isLuxe}`);
        });
      }
    } else {
      console.log("❌ Advisor not found");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkAdvisorInsights();
