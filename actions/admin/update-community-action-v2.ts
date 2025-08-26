"use server";

import { db } from "@/db/drizzle";
import { communityTable } from "@/db/schema/community-table";
import { CommunityFormSchema } from "@/features/admin/community/form-schema/community-form-schema";
import { revalidateTag } from "next/cache";
import { validateRequest } from "@/lib/auth";
import { z } from "zod";
import { eq } from "drizzle-orm";
import slugify from "slugify";

// Export the RequestData type for use in other files
export type UpdateCommunityRequestData = z.infer<typeof CommunityFormSchema>;

/**
 * Server action to update an existing community
 * @param communityId - ID of the community to update
 * @param communityData - Community data to be updated
 * @returns Object with success status and data or error message
 */
export async function updateCommunityAction(communityId: string, communityData: UpdateCommunityRequestData) {
  try {
    // Check if user is authenticated
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: Please log in to update communities'
      };
    }

    // Validate the form data
    const validatedData = CommunityFormSchema.parse(communityData);

    // Check if community exists
    const existingCommunity = await db.query.communityTable.findFirst({
      where: eq(communityTable.id, communityId)
    });

    if (!existingCommunity) {
      return {
        success: false,
        error: 'Community not found'
      };
    }

    // Generate a new slug if the name has changed
    let slug = existingCommunity.slug;
    if (validatedData.name !== existingCommunity.name) {
      let baseSlug = slugify(validatedData.name, { lower: true, strict: true });
      slug = baseSlug;
      let counter = 1;

      // Check if slug already exists and create a unique one
      while (true) {
        const communityWithSlug = await db.query.communityTable.findFirst({
          where: (communities, { eq, and, ne }) => and(
            eq(communities.slug, slug),
            ne(communities.id, communityId)
          )
        });

        if (!communityWithSlug) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Update the community data in the database
    const updatedCommunity = await db.update(communityTable)
      .set({
        name: validatedData.name,
        slug: slug,
        image: validatedData.image || null,
        about: validatedData.about || null,
        metaTitle: validatedData.metaTitle || null,
        metaDesc: validatedData.metaDesc || null,
        featured: validatedData.featured,
        displayOrder: validatedData.displayOrder,
        isLuxe: validatedData.isLuxe,
      })
      .where(eq(communityTable.id, communityId))
      .returning();
    
    // Revalidate the communities tag
    revalidateTag('admin-communities');
    revalidateTag('communities');
    
    return {
      success: true,
      data: updatedCommunity[0]
    };
  } catch (error) {
    console.error("Error updating community:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation failed - ${error.message}`,
        validationErrors: error.errors
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
