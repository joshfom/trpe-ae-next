"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { luxeCommunityTable } from "@/db/schema/luxe-community-table";
import { eq } from "drizzle-orm";

interface LuxeCommunityUpdateData {
  name?: string;
  metaTitle?: string;
  metaDesc?: string;
  about?: string;
  image?: string;
  heroImage?: string;
  featured?: boolean;
  displayOrder?: number;
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
            name: data.name !== undefined ? data.name : existingLuxeCommunity.name,
            metaTitle: data.metaTitle !== undefined ? data.metaTitle : existingLuxeCommunity.metaTitle,
            metaDesc: data.metaDesc !== undefined ? data.metaDesc : existingLuxeCommunity.metaDesc,
            about: data.about !== undefined ? data.about : existingLuxeCommunity.about,
            image: data.image !== undefined ? data.image : existingLuxeCommunity.image,
            heroImage: data.heroImage !== undefined ? data.heroImage : existingLuxeCommunity.heroImage,
            featured: data.featured !== undefined ? data.featured : existingLuxeCommunity.featured,
            displayOrder: data.displayOrder !== undefined ? data.displayOrder : existingLuxeCommunity.displayOrder,
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
