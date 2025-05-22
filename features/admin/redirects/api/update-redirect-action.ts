"use server";

import { db } from "@/db/drizzle";
import { redirectTable } from "@/db/schema/redirect-table";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { RedirectInput, extractPathFromUrl } from "./add-redirect-action";

export async function updateRedirectAction(id: string, data: RedirectInput) {
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
            
            if (existingCircularRedirect.length > 0 && existingCircularRedirect[0].id !== id) {
                return {
                    success: false,
                    message: "Cannot create a circular redirect. The destination URL already exists as a source URL.",
                };
            }
        }

        await db.update(redirectTable)
            .set({
                fromUrl: normalizedFromUrl,
                toUrl: normalizedToUrl,
                statusCode: data.statusCode,
                isActive: data.isActive || "yes",
                updatedAt: new Date().toISOString(),
            })
            .where(eq(redirectTable.id, id));

        revalidatePath("/admin/redirects");
        return { success: true, message: "Redirect updated successfully" };
    } catch (error) {
        console.error("Error updating redirect:", error);
        return { success: false, message: "Failed to update redirect" };
    }
}