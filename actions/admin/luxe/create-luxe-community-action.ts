"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/actions/auth-session";
import { db } from "@/db/drizzle";
import { luxeCommunityTable } from "@/db/schema/luxe-community-table";
import { eq } from "drizzle-orm";

interface LuxeCommunityCreateData {
  communityId: string;
  name: string;
  metaTitle?: string;
  metaDesc?: string;
  about?: string;
  image?: string;
  heroImage?: string;
  featured?: boolean;
  displayOrder?: number;
}

export type CreateLuxeCommunitySuccessResult = {
  success: true;
  data: any;
}

export type CreateLuxeCommunityErrorResult = {
  success: false;
  error: string;
}

export type CreateLuxeCommunityResult = CreateLuxeCommunitySuccessResult | CreateLuxeCommunityErrorResult;

/**
 * Server action to create a new luxe community
 * 
 * This action handles:
 * 1. Luxe community data creation through direct database operations
 * 2. Next.js cache revalidation
 * 
 * @param data - The luxe community data to create
 * @returns Result object with success status and data or error
 */
export async function createLuxeCommunity(data: LuxeCommunityCreateData): Promise<CreateLuxeCommunityResult> {
    try {
        // Check authentication first
        const session = await getSession();
        if (!session) {
            return {
                success: false,
                error: "Please log in or your session to access resource."
            };
        }

        // Check if luxe community already exists for this community
        const existingLuxeCommunity = await db.query.luxeCommunityTable.findFirst({
            where: eq(luxeCommunityTable.communityId, data.communityId)
        });

        if (existingLuxeCommunity) {
            return {
                success: false,
                error: "Luxe community already exists for this community"
            };
        }

        // Create the luxe community
        const [newLuxeCommunity] = await db.insert(luxeCommunityTable).values({
            communityId: data.communityId,
            name: data.name,
            metaTitle: data.metaTitle,
            metaDesc: data.metaDesc,
            about: data.about,
            image: data.image,
            heroImage: data.heroImage,
            featured: data.featured || false,
            displayOrder: data.displayOrder || 0,
        }).returning();
        
        // Revalidate relevant cache tags and paths
        revalidateTag('luxe-communities');
        revalidatePath('/admin/luxe/communities');
        
        return {
            success: true,
            data: newLuxeCommunity
        };
        
    } catch (error) {
        console.error('Error creating luxe community:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred while creating luxe community"
        };
    }
}
