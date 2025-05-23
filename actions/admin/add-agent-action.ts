"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

export type RequestData = {
  [key: string]: any;
};

/**
 * Server action to add a new agent
 * @param agentData - Agent data to be added
 * @returns Object with success status and data or error message
 */
export async function addAgentAction(agentData: RequestData) {
  try {
    const response = await client.api.admin.agents.$post({
      json: agentData
    });

    if (!response.ok) {
      throw new Error('Failed to add agent');
    }

    const data = await response.json();
    
    // Revalidate the agents tag
    revalidateTag('agents');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error adding agent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
