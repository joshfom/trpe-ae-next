"use server";

import { db } from "@/db/drizzle";
import { communityTable } from "@/db/schema/community-table";
import { CommunityFormSchema } from "@/features/admin/community/form-schema/community-form-schema";
import { revalidateTag } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { validateRequest } from "@/lib/auth";
import { z } from "zod";
import slugify from "slugify";

// Export the RequestData type for use in other files
export type CreateCommunityRequestData = z.infer<typeof CommunityFormSchema>;

/**
 * Server action to create a new community
 * @param communityData - Community data to be created
 * @returns Object with success status and data or error message
 */
export async function createCommunityAction(communityData: CreateCommunityRequestData) {
  try {
    // Check if user is authenticated
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: Please log in to create communities'
      };
    }

    // Validate the form data
    const validatedData = CommunityFormSchema.parse(communityData);

    // Generate a slug from the name
    let baseSlug = slugify(validatedData.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check if slug already exists and create a unique one
    while (true) {
      const existingCommunity = await db.query.communityTable.findFirst({
        where: (communities, { eq }) => eq(communities.slug, slug)
      });

      if (!existingCommunity) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Insert the new community data into the database
    const newCommunity = await db.insert(communityTable).values({
      id: createId(),
      name: validatedData.name,
      slug: slug,
      image: validatedData.image || null,
      about: validatedData.about || null,
      metaTitle: validatedData.metaTitle || null,
      metaDesc: validatedData.metaDesc || null,
      featured: validatedData.featured,
      displayOrder: validatedData.displayOrder,
      isLuxe: validatedData.isLuxe,
      isPublic: true, // Default to public
    }).returning();
    
    // Revalidate the communities tag
    revalidateTag('admin-communities');
    revalidateTag('communities');
    
    return {
      success: true,
      data: newCommunity[0]
    };
  } catch (error) {
    console.error("Error creating community:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation failed - ${error.message}`,
        validationErrors: error.issues
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
