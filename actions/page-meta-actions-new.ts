import {eq} from "drizzle-orm";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import { Metadata } from "next";
import {db} from "@/db/drizzle";

export async function getPageMetaByPath(path: string) {
    // Ensure path starts with /
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }

    return await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, path)
    });
}

export async function getAllPageMetas() {
    return await db.query.pageMetaTable.findMany({
        orderBy: (pageMetaTable, {desc}) => [desc(pageMetaTable.createdAt)]
    });
}

export async function generateMetadataFromPath(path: string, defaultMetadata: Metadata = {}): Promise<Metadata> {
    const pageMeta = await getPageMetaByPath(path);
    
    if (!pageMeta) {
        return defaultMetadata;
    }
    
    const metadata: Metadata = {
        ...defaultMetadata,
        title: pageMeta.metaTitle || defaultMetadata.title,
        description: pageMeta.metaDescription || defaultMetadata.description,
    };
    
    // Handle robots meta based on noIndex and noFollow settings
    const robotsDirectives: string[] = [];
    if (pageMeta.noIndex) robotsDirectives.push('noindex');
    if (pageMeta.noFollow) robotsDirectives.push('nofollow');
    
    if (robotsDirectives.length > 0) {
        metadata.robots = robotsDirectives.join(', ');
    }
    
    // Add keywords if available
    if (pageMeta.metaKeywords) {
        metadata.keywords = pageMeta.metaKeywords;
    }
    
    return metadata;
}
