"use server";

import { db } from "@/db/drizzle";
import { employeeTable } from "@/db/schema/employee-table";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

/**
 * Server action for fetching a single admin agent by ID
 * 
 * @param agentId - The ID of the agent to fetch (string)
 * @returns An object with success status and data or error
 */
export async function getAdminAgentAction(agentId: string) {
  try {
    // Fetch single agent from database
    const data = await db.query.employeeTable.findFirst({
      where: eq(employeeTable.id, agentId)
    });

    // If no agent found, return error
    if (!data) {
      return {
        success: false,
        error: "Agent not found",
        data: null
      };
    }
    
    // Revalidate the agents tag to refresh any cached data
    revalidateTag('agents');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching admin agent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: null
    };
  }
}
