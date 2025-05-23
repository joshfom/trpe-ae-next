"use server";

import { client } from "@/lib/hono";
import { revalidateTag } from "next/cache";

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
    const response = await client.api.admin.agents[":agentId"].$post({
      param: { agentId },
      json: agentData
    });

    if (!response.ok) {
      throw new Error('Failed to update agent');
    }

    const data = await response.json();
    
    // Revalidate the agents tag
    revalidateTag('agents');
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error updating agent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
