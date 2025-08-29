import { db } from "@/db/drizzle";
import { employeeTable } from "@/db/schema/employee-table";
import { eq, and } from "drizzle-orm";

async function debugAgents() {
    try {
        console.log("Fetching agents data...");
        
        const agents = await db
            .select({
                id: employeeTable.id,
                firstName: employeeTable.firstName,
                lastName: employeeTable.lastName,
                slug: employeeTable.slug,
                avatarUrl: employeeTable.avatarUrl,
                title: employeeTable.title,
                isVisible: employeeTable.isVisible,
                type: employeeTable.type,
            })
            .from(employeeTable)
            .where(
                and(
                    eq(employeeTable.isVisible, true),
                    eq(employeeTable.type, 'agent')
                )
            )
            .orderBy(employeeTable.order);

        console.log(`Found ${agents.length} agents:`);
        
        agents.forEach((agent, index) => {
            console.log(`\nAgent ${index + 1}:`);
            console.log(`  Name: ${agent.firstName || ''} ${agent.lastName || ''}`);
            console.log(`  Slug: ${agent.slug}`);
            console.log(`  Avatar URL: ${agent.avatarUrl || 'NULL'}`);
            console.log(`  Title: ${agent.title || 'NULL'}`);
            console.log(`  Is Visible: ${agent.isVisible}`);
            console.log(`  Type: ${agent.type}`);
        });

        if (agents.length === 0) {
            console.log("\n❌ No visible agents found!");
            console.log("Checking all agents (including hidden ones)...");
            
            const allAgents = await db
                .select({
                    id: employeeTable.id,
                    firstName: employeeTable.firstName,
                    lastName: employeeTable.lastName,
                    isVisible: employeeTable.isVisible,
                    type: employeeTable.type,
                })
                .from(employeeTable)
                .where(eq(employeeTable.type, 'agent'));
                
            console.log(`Total agents in database: ${allAgents.length}`);
            allAgents.forEach(agent => {
                console.log(`  ${agent.firstName} ${agent.lastName} - Visible: ${agent.isVisible}`);
            });
        }

    } catch (error) {
        console.error("Error fetching agents:", error);
    }
}

debugAgents().then(() => {
    console.log("\nDebug complete!");
    process.exit(0);
}).catch(console.error);
