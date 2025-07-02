"use server";

import { db } from "@/db/drizzle";
import { employeeTable } from "@/db/schema/employee-table";
import { AgentFormSchema } from "@/features/admin/agents/form-schema/agent-form-schema";
import { revalidateTag } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { z } from "zod";

// Export the RequestData type for use in other files
export type RequestData = z.infer<typeof AgentFormSchema>;

/**
 * Server action to add a new agent
 * @param agentData - Agent data to be added
 * @returns Object with success status and data or error message
 */
export async function addAgentAction(agentData: RequestData) {
  try {
    // Check if user is authenticated
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: Please log in to add agents'
      };
    }

    // Validate the form data
    const validatedData = AgentFormSchema.parse(agentData);

    // Generate a slug from the first and last name
    const slug = `${validatedData.firstName || 'agent'}-${validatedData.lastName || createId()}`.toLowerCase().replace(/\s/g, "-");

    // Insert the new agent data into the database
    const newAgent = await db.insert(employeeTable).values({
      id: createId(),
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      title: validatedData.title,
      bio: validatedData.bio,
      rera: validatedData.rera,
      avatarUrl: validatedData.avatarUrl,
      isVisible: validatedData.isVisible,
      isLuxe: validatedData.isLuxe,
      order: validatedData.order,
      slug: slug,
      type: 'agent',
      isActive: 'true'
    }).returning();
    
    // Revalidate the agents tag
    revalidateTag('agents');
    
    return {
      success: true,
      data: newAgent[0]
    };
  } catch (error) {
    console.error("Error adding agent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
