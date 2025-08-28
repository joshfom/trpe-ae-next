import { db } from "./db/drizzle.js";
import { employeeTable } from "./db/schema/employee-table.js";
import { insightTable } from "./db/schema/insight-table.js";
import { eq, and } from "drizzle-orm";

async function testAdvisorInsights() {
  try {
    console.log("🔍 Testing Fixed Advisor Insights Logic...\n");
    
    // Test the exact same logic as in the advisor page
    const advisor = await db.query.employeeTable.findFirst({
      where: and(
        eq(employeeTable.slug, "arya-daryabor"),
        eq(employeeTable.isLuxe, true),
        eq(employeeTable.isVisible, true)
      ),
      with: {
        properties: {
          with: {
            images: true,
            agent: true,
            community: true,
            city: true,
            subCommunity: true,
            offeringType: true,
            type: true
          }
        },
        insights: {
          where: and(
            eq(insightTable.isLuxe, true),
            eq(insightTable.isPublished, 'yes')
          ),
          orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
          limit: 20
        },
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
      process.exit(1);
    }

    console.log(`👤 Advisor: ${advisor.firstName} ${advisor.lastName}`);
    console.log(`📝 Author: ${advisor.author ? advisor.author.name : 'No author'}`);

    // Get journal articles from the advisor's linked author
    let journalArticles: any[] = [];
    
    // Primary method: Get journals through the author relationship
    if (advisor.author && advisor.author.insights) {
      journalArticles = advisor.author.insights;
      console.log(`✅ Found ${journalArticles.length} insights through author relationship`);
    }
    
    // Fallback 1: If no author relation but authorId exists, fetch directly
    if (journalArticles.length === 0 && advisor.authorId) {
      console.log("🔄 Trying fallback 1: Direct author lookup...");
      const authorInsights = await db.query.insightTable.findMany({
        where: and(
          eq(insightTable.isLuxe, true),
          eq(insightTable.isPublished, 'yes'),
          eq(insightTable.authorId, advisor.authorId)
        ),
        orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
        limit: 20
      });
      journalArticles = authorInsights;
      console.log(`✅ Found ${journalArticles.length} insights through direct lookup`);
    }
    
    // Fallback 2: Get insights directly associated with this advisor/agent
    if (journalArticles.length === 0 && advisor.insights) {
      journalArticles = advisor.insights;
      console.log(`✅ Found ${journalArticles.length} insights through direct advisor relation`);
    }
    
    // Fallback 3: Search by agentId in insights table
    if (journalArticles.length === 0) {
      console.log("🔄 Trying fallback 3: Agent ID lookup...");
      const agentInsights = await db.query.insightTable.findMany({
        where: and(
          eq(insightTable.isLuxe, true),
          eq(insightTable.isPublished, 'yes'),
          eq(insightTable.agentId, advisor.id)
        ),
        orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
        limit: 20
      });
      journalArticles = agentInsights;
      console.log(`✅ Found ${journalArticles.length} insights through agent ID lookup`);
    }

    console.log(`\n📰 Final result: ${journalArticles.length} journal articles:`);
    journalArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
      console.log(`     Published: ${article.isPublished}, Luxe: ${article.isLuxe}`);
      console.log(`     AuthorID: ${article.authorId}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testAdvisorInsights();
