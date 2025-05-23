"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action for fetching admin agents
 * 
 * @returns An object with success status and data or error
 */
export async function getAdminAgentsAction() {
  try {
    // Fetch agents through admin API
    const response = await client.api.admin.agents.$get();

    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    const { data } = await response.json();
    
    // Revalidate the agents tag to refresh any cached data
    revalidateTag('agents');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching admin agents:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: []
    };
  }
}
