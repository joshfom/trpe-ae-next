"use server"
import {db} from "@/db/drizzle";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {eq} from "drizzle-orm";
import {getSession} from "@/actions/auth-session";
import {PageMetaFormSchema} from "@/lib/types/form-schema/page-meta-form-schema";
import {z} from "zod";

type RequestType = z.infer<typeof PageMetaFormSchema>;

/**
 * Server action to update page meta
 * @param id - The ID of the page meta to update
 * @param data - The updated page meta data
 */
export async function updatePageMetaAction(id: string, data: RequestType) {
    try {
        // Check authentication using Better Auth session
        const session = await getSession();
        if (!session) {
            throw new Error(JSON.stringify({Unauthorized: "Please log in or your session to access resource."}));
        }

        // Check if page meta exists
        const pageMeta = await db.query.pageMetaTable.findFirst({
            where: eq(pageMetaTable.id, id)
        });

        if (!pageMeta) {
            throw new Error(JSON.stringify({error: "Page meta not found"}));
        }

        // Check if path already exists and belongs to another page
        const existingPath = await db.query.pageMetaTable.findFirst({
            where: eq(pageMetaTable.path, data.path)
        });

        if (existingPath && existingPath.id !== id) {
            throw new Error(JSON.stringify({error: "Path already exists for another page"}));
        }

        // Update the page meta
        const [updatedData] = await db.update(pageMetaTable).set({
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            title: data.title,
            content: data.content,
            path: data.path,
            noIndex: data.noIndex,
            noFollow: data.noFollow,
            metaKeywords: data.metaKeywords,
            includeInSitemap: data.includeInSitemap,
            updatedAt: new Date().toISOString()
        }).where(eq(pageMetaTable.id, id)).returning();

        return {data: updatedData};
    } catch (error) {
        console.error('Error updating page meta:', error);
        throw error;
    }
}
