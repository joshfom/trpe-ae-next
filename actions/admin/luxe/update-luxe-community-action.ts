"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { luxeCommunityTable } from "@/db/schema/luxe-community-table";
import { eq } from "drizzle-orm";

interface LuxeCommunityUpdateData {
  isLuxe?: boolean;
  luxeMetaTitle?: string;
  luxeTitle?: string; // This maps to name in the database
  luxeDescription?: string; // This maps to about in the database
  luxeImageUrl?: string; // This maps to image in the database
  luxeHeroImageUrl?: string; // This maps to heroImage in the database
  luxeFeatured?: boolean; // This maps to featured in the database
  luxeDisplayOrder?: number; // This maps to displayOrder in the database
}

export type UpdateLuxeCommunitySuccessResult = {
  success: true;
  data: any;
}

export type UpdateLuxeCommunityErrorResult = {
  success: false;
  error: string;
}

export type UpdateLuxeCommunityResult = UpdateLuxeCommunitySuccessResult | UpdateLuxeCommunityErrorResult;

/**
 * Server action to update a community's luxe fields
 * 
 * This action handles:
 * 1. Community luxe fields update through direct database operations
 * 2. Next.js cache revalidation
 * 
 * @param communityId - The ID of the community to update
 * @param data - The luxe community data to update
 * @returns Result object with success status and data or error
 */
export async function updateLuxeCommunity(communityId: string, data: LuxeCommunityUpdateData): Promise<UpdateLuxeCommunityResult> {
    try {
        // Check authentication first
        const session = await getSession();
        if (!session) {
            return {
                success: false,
                error: "Please log in or your session to access resource."
            };
        }

        // Check if luxe community exists
        const existingLuxeCommunity = await db.query.luxeCommunityTable.findFirst({
            where: eq(luxeCommunityTable.communityId, communityId)
        });

        if (!existingLuxeCommunity) {
            return {
                success: false,
                error: "Luxe community not found"
            };
        }

        // Update the luxe community
        const [updatedLuxeCommunity] = await db.update(luxeCommunityTable).set({
            name: data.luxeTitle !== undefined ? data.luxeTitle : existingLuxeCommunity.name,
            metaTitle: data.luxeMetaTitle !== undefined ? data.luxeMetaTitle : existingLuxeCommunity.metaTitle,
            metaDesc: existingLuxeCommunity.metaDesc, // No client mapping for this field
            about: data.luxeDescription !== undefined ? data.luxeDescription : existingLuxeCommunity.about,
            image: data.luxeImageUrl !== undefined ? data.luxeImageUrl : existingLuxeCommunity.image,
            heroImage: data.luxeHeroImageUrl !== undefined ? data.luxeHeroImageUrl : existingLuxeCommunity.heroImage,
            featured: data.luxeFeatured !== undefined ? data.luxeFeatured : existingLuxeCommunity.featured,
            displayOrder: data.luxeDisplayOrder !== undefined ? data.luxeDisplayOrder : existingLuxeCommunity.displayOrder,
            updatedAt: new Date()
        }).where(eq(luxeCommunityTable.communityId, communityId)).returning();
        
        // Revalidate relevant cache tags and paths
        revalidateTag('luxe-communities');
        revalidatePath('/admin/luxe/communities');
        
        return {
            success: true,
            data: updatedLuxeCommunity
        };
        
    } catch (error) {
        console.error('Network or parsing error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred while updating luxe community"
        };
    }
}
