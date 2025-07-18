"use server";

import { db } from "@/db/drizzle";
import { employeeTable } from "@/db/schema/employee-table";
import { eq } from "drizzle-orm";

/**
 * Server action for fetching luxe agents
 * 
 * @returns An object with success status and data or error
 */
export async function getLuxeAgentsAction() {
  try {
    // Fetch agents that are marked as luxe
    const agents = await db
      .select({
        id: employeeTable.id,
        firstName: employeeTable.firstName,
        lastName: employeeTable.lastName,
        email: employeeTable.email,
        phone: employeeTable.phone,
        isLuxe: employeeTable.isLuxe,
        avatarUrl: employeeTable.avatarUrl,
        title: employeeTable.title,
        order: employeeTable.order,
        slug: employeeTable.slug
      })
      .from(employeeTable)
      .where(eq(employeeTable.isLuxe, true))
      .orderBy(employeeTable.order, employeeTable.firstName);
    
    return {
      success: true,
      data: agents
    };
  } catch (error) {
    console.error("Error fetching luxe agents:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: []
    };
  }
}
