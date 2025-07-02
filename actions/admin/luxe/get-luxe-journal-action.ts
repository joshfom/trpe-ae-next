"use server";

import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { eq, desc } from "drizzle-orm";

/**
 * Server action to fetch all luxe journal entries (insights marked as luxe)
 * @returns Object with success status and data or error message
 */
export async function getLuxeJournalAction() {
  try {
    // Check authentication first
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: "Please log in or your session to access resource.",
        data: null
      };
    }

    // Fetch all insights where isLuxe is true, ordered by most recent first
    const luxeJournalEntries = await db.query.insightTable.findMany({
      where: eq(insightTable.isLuxe, true),
      orderBy: [desc(insightTable.createdAt)]
    });

    return {
      success: true,
      data: luxeJournalEntries,
      error: null
    };

  } catch (error: unknown) {
    console.error('Error fetching luxe journal entries:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return {
      success: false,
      error: `Failed to fetch luxe journal entries: ${errorMessage}`,
      data: null
    };
  }
}
