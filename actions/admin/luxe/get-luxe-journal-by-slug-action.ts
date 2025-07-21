"use server";

import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { insightTable } from "@/db/schema/insight-table";
import { and, eq } from "drizzle-orm";

/**
 * Server action to fetch a single luxe journal entry by slug (for admin use)
 * @param slug - The slug of the journal entry to fetch
 * @returns Object with success status and journal data or error message
 */
export async function getLuxeJournalBySlugAction(slug: string) {
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

    // Fetch luxe journal by slug (includes drafts and published)
    const journal = await db.query.insightTable.findFirst({
      where: and(
        eq(insightTable.slug, slug),
        eq(insightTable.isLuxe, true)
      )
    });

    if (!journal) {
      return {
        success: false,
        error: "Journal entry not found",
        data: null
      };
    }

    return {
      success: true,
      data: journal,
      error: null
    };

  } catch (error: unknown) {
    console.error('Error fetching luxe journal by slug:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return {
      success: false,
      error: `Failed to fetch journal entry: ${errorMessage}`,
      data: null
    };
  }
}
