"use server";

import { db } from "@/db/drizzle";
import { employeeTable } from "@/db/schema/employee-table";
import { and, eq, asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

/**
 * Server action for fetching all luxe agents with caching
 * 
 * @returns Object with success status and luxe agents data or error message
 */
export const getLuxeAgentsAction = unstable_cache(
  async () => {
    try {
      // Fetch luxe agents directly from database
      const data = await db.query.employeeTable.findMany({
        where: and(
          eq(employeeTable.isLuxe, true)
        ),
        orderBy: [asc(employeeTable.order)]
      });
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error fetching luxe agents:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        data: []
      };
    }
  },
  ['luxe-agents-list'],
  { 
    revalidate: 3600, // Cache for 1 hour since agents don't change frequently
    tags: ['luxe-agents']
  }
);
