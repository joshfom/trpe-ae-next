"use server";

import { db } from "@/db/drizzle";
import { employeeTable } from "@/db/schema/employee-table";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type UpdateAgentRequestData = {
  [key: string]: any;
};

/**
 * Server action to update an agent
 * @param agentId - ID of the agent to update
 * @param agentData - Agent data to update
 * @returns Object with success status and data or error message
 */
export async function updateAgentAction(agentId: string, agentData: UpdateAgentRequestData) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized: Please log in to update agents'
      };
    }

    // Update the agent directly in the database
    const [updatedAgent] = await db.update(employeeTable)
      .set({
        ...agentData,
        updatedAt: sql`now()`
      })
      .where(eq(employeeTable.id, agentId))
      .returning();

    if (!updatedAgent) {
      return {
        success: false,
        error: 'Agent not found'
      };
    }
    
    // Revalidate the agents tag
    revalidateTag('agents');
    
    return {
      success: true,
      data: updatedAgent
    };
  } catch (error) {
    console.error("Error updating agent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
