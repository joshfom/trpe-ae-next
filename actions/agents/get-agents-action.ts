"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

/**
 * Server action for fetching all agents
 * 
 * @returns Object with success status and agents data or error message
 */
export async function getAgentsAction() {
  try {
    // Fetch agents through API
    const response = await client.api.agents.$get();

    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    const { data } = await response.json();
    
    // Revalidate the agents tag
    revalidateTag('site-agents');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error fetching agents:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: []
    };
  }
}
