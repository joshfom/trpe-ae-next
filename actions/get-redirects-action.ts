"use server";

import { db } from "@/db/drizzle";
import { redirectTable } from "@/db/schema/redirect-table";
import { and, eq } from "drizzle-orm";

export async function get410UrlsAction() {
  try {
    const redirects = await db
      .select()
      .from(redirectTable)
      .where(and(
        eq(redirectTable.statusCode, "410"),
        eq(redirectTable.isActive, "yes")
      ));
    
    return {
      urls: redirects.map(redirect => redirect.fromUrl),
      success: true
    };
  } catch (error) {
    console.error("Error fetching 410 URLs:", error);
    return { urls: [], success: false };
  }
}

export async function get301RedirectsAction() {
  try {
    const redirects = await db
      .select()
      .from(redirectTable)
      .where(
        and(
          eq(redirectTable.statusCode, "301"),
            eq(redirectTable.isActive, "yes")
      ));
    
    return {
      redirects: redirects.map(redirect => ({
        oldUrl: redirect.fromUrl,
        newUrl: redirect.toUrl,
      })),
      success: true
    };
  } catch (error) {
    console.error("Error fetching 301 redirects:", error);
    return { redirects: [], success: false };
  }
}

export async function getAllRedirectsAction() {
  try {
    const redirects = await db
      .select()
      .from(redirectTable)
      .where(eq(redirectTable.isActive, "yes"));
    
    return {
      redirects,
      success: true
    };
  } catch (error) {
    console.error("Error fetching all redirects:", error);
    return { redirects: [], success: false };
  }
}