"use server";

import { db } from "@/db/drizzle";
import { redirectTable } from "@/db/schema/redirect-table";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type RedirectInput = {
    fromUrl: string;
    toUrl?: string;
    statusCode: "301" | "410";
    isActive?: string;
};

// Helper function to extract path from URL
export async function extractPathFromUrl(url: string): Promise<string> {
    if (!url) return "";
    
    // Check if this is a full URL with protocol
    if (url.startsWith('http://') || url.startsWith('https://')) {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.pathname;
        } catch (error) {
            console.error("Error parsing URL:", error);
            return url;
        }
    }
    
    // If it's already a path (starts with /), return as is
    if (url.startsWith('/')) {
        return url;
    }
    
    // If no leading slash, add it
    return `/${url}`;
}

export async function addRedirectAction(data: RedirectInput) {
    try {
        // Normalize URLs
        const normalizedFromUrl = await extractPathFromUrl(data.fromUrl.trim());
        let normalizedToUrl = null;
        
        if (data.statusCode === "301") {
            const toUrlPath = await extractPathFromUrl(data.toUrl?.trim() || "");
            normalizedToUrl = toUrlPath.toLowerCase();
            
            // Skip self-redirects (where source and destination are the same)
            if (normalizedFromUrl === normalizedToUrl) {
                return {
                    success: false,
                    message: "Cannot create a redirect that points to itself",
                };
            }
            
            // Check if the destination URL (toUrl) already exists as a source URL (fromUrl)
            // This prevents circular redirects and redirect chains
            const existingCircularRedirect = await db
                .select()
                .from(redirectTable)
                .where(eq(redirectTable.fromUrl, normalizedToUrl))
                .limit(1);
            
            if (existingCircularRedirect.length > 0) {
                return {
                    success: false,
                    message: "Cannot create a circular redirect. The destination URL already exists as a source URL.",
                };
            }
        }

        // Check if the fromUrl already exists
        const existingRedirect = await db
            .select()
            .from(redirectTable)
            .where(eq(redirectTable.fromUrl, normalizedFromUrl))
            .limit(1);

        if (existingRedirect.length > 0) {
            return {
                success: false,
                message: "This URL already exists in the redirects table",
            };
        }

        await db.insert(redirectTable).values({
            id: nanoid(),
            fromUrl: normalizedFromUrl,
            toUrl: normalizedToUrl,
            statusCode: data.statusCode,
            isActive: data.isActive || "yes",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        revalidatePath("/admin/redirects");
        return { success: true, message: "Redirect created successfully" };
    } catch (error) {
        console.error("Error adding redirect:", error);
        return { success: false, message: "Failed to create redirect" };
    }
}