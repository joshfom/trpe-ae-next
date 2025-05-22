import { NextResponse } from "next/server";
import { get410UrlsAction } from "@/actions/get-redirects-action";

export const dynamic = 'force-dynamic'; // Ensures this is not statically optimized

export async function GET() {
  try {
    // Get the 410 URLs from our database
    const result = await get410UrlsAction();
    
    if (result.success) {
      // Return the URLs as JSON
      return NextResponse.json({ urls: result.urls }, { status: 200 });
    } else {
      throw new Error("Failed to fetch 410 URLs from database");
    }
  } catch (error) {
    console.error('[API] Error fetching 410 URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch 410 URLs' },
      { status: 500 }
    );
  }
}