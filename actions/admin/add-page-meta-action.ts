"use server"

import { db } from "@/db/drizzle";
import { pageMetaTable } from "@/db/schema/page-meta-table";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { getSession } from "@/actions/auth-session";

interface PageMetaData {
    metaTitle: string;
    metaDescription: string;
    noIndex?: boolean;
    noFollow?: boolean;
    title: string;
    content?: string; // Optional to match schema
    path: string;
    metaKeywords?: string;
    includeInSitemap?: boolean;
}

/**
 * Server action to add page meta - using direct DB access like journal
 * @param data - The page meta data to add
 */
export async function addPageMetaAction(data: PageMetaData) {
    try {
        // Check authentication using Better Auth session like journal does
        const session = await getSession();
        if (!session) {
            return {
                success: false,
                error: "Please log in or your session to access resource.",
                data: null
            };
        }

        // Check if path already exists
        const existingPath = await db.query.pageMetaTable.findFirst({
            where: eq(pageMetaTable.path, data.path)
        });

        if (existingPath) {
            return {
                success: false,
                error: "Path already exists",
                data: null
            };
        }

        // Insert the new page meta
        const [result] = await db.insert(pageMetaTable).values({
            id: createId(),
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            noIndex: data.noIndex || false,
            noFollow: data.noFollow || false,
            metaKeywords: data.metaKeywords || '',
            includeInSitemap: data.includeInSitemap || true,
            title: data.title,
            content: data.content,
            path: data.path
        }).returning();

        return {
            success: true,
            data: result,
            error: null
        };

    } catch (error) {
        console.error('Add page meta error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            data: null
        };
    }
}
