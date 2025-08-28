import { db } from "./db/drizzle.js";
import { employeeTable } from "./db/schema/employee-table.js";
import { insightTable } from "./db/schema/insight-table.js";
import { eq, and } from "drizzle-orm";

async function testBothAdvisors() {
  try {
    console.log("🔍 Testing Both Advisors...\n");
    
    const advisorSlugs = ["arya-daryabor", "hedieh--tazeh"];
    
    for (const slug of advisorSlugs) {
      console.log(`\n📋 Testing advisor: ${slug}`);
      console.log("=".repeat(50));
      
      const advisor = await db.query.employeeTable.findFirst({
        where: and(
          eq(employeeTable.slug, slug),
          eq(employeeTable.isLuxe, true),
          eq(employeeTable.isVisible, true)
        ),
        with: {
          author: {
            with: {
              insights: {
                where: and(
                  eq(insightTable.isLuxe, true),
                  eq(insightTable.isPublished, 'yes')
                ),
                orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
                limit: 20
              }
            }
          }
        }
      });

      if (!advisor) {
        console.log("❌ Advisor not found");
        continue;
      }

      console.log(`👤 Advisor: ${advisor.firstName} ${advisor.lastName}`);
      console.log(`📝 Author: ${advisor.author ? advisor.author.name : 'No author'}`);
      console.log(`🔗 AuthorID: ${advisor.authorId}`);

      let journalArticles: any[] = [];
      
      if (advisor.author && advisor.author.insights) {
        journalArticles = advisor.author.insights;
        console.log(`✅ Found ${journalArticles.length} insights through author relationship`);
      } else {
        console.log("❌ No insights found through author relationship");
      }

      if (journalArticles.length > 0) {
        console.log(`📰 Journal articles:`);
        journalArticles.forEach((article, index) => {
          console.log(`  ${index + 1}. ${article.title}`);
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testBothAdvisors();
