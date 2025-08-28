// API route for redirects that runs in Node.js runtime
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { redirectTable } from "@/db/schema/redirect-table";
import { eq } from "drizzle-orm";

// Force this to run in Node.js runtime, not Edge
export const runtime = "nodejs";
// For static export compatibility
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const redirects = await db
      .select()
      .from(redirectTable)
      .where(eq(redirectTable.isActive, "yes"));
    
    return NextResponse.json({ 
      redirects,
      success: true 
    });
  } catch (error) {
    console.error("API Error fetching redirects:", error);
    return NextResponse.json(
      { 
        redirects: [], 
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}