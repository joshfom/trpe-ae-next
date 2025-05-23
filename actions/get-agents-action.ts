"use server";

import { client } from "@/lib/hono";

/**
 * Server action for fetching all agents
 * 
 * @returns An object with success status and data or error
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
