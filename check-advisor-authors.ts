import { db } from "./db/drizzle.js";
import { employeeTable } from "./db/schema/employee-table.js";
import { eq, and } from "drizzle-orm";

async function checkAdvisorAuthors() {
  try {
    console.log("🔍 Checking Luxe Advisors and their Author Relations...\n");
    
    const advisors = await db.query.employeeTable.findMany({
      where: and(
        eq(employeeTable.isLuxe, true),
        eq(employeeTable.isVisible, true)
      ),
      with: {
        author: true
      }
    });

    console.log(`🏢 Found ${advisors.length} luxe advisors:`);
    advisors.forEach(advisor => {
      console.log(`  - ${advisor.firstName} ${advisor.lastName} (slug: ${advisor.slug})`);
      console.log(`    AuthorID: ${advisor.authorId}`);
      console.log(`    Author: ${advisor.author ? advisor.author.name : 'No linked author'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkAdvisorAuthors();
