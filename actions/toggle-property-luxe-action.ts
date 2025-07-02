"use server";

import { db } from "@/db/drizzle";
import { propertyTable } from "@/db/schema/property-table";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

/**
 * Server action to toggle a property's luxe status
 * @param propertyId - The ID of the property to toggle
 * @param isLuxe - Whether the property should be marked as luxe
 */
export async function togglePropertyLuxeAction(propertyId: string, isLuxe: boolean) {
  try {
    await db.update(propertyTable)
      .set({ isLuxe })
      .where(eq(propertyTable.id, propertyId));

    // Revalidate relevant tags
    revalidateTag('properties');
    revalidateTag('luxe-properties');

    return {
      success: true,
      message: `Property ${isLuxe ? 'marked as luxe' : 'removed from luxe collection'} successfully`
    };
  } catch (error) {
    console.error("Error toggling property luxe status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Server action to get properties that can be marked as luxe (for admin purposes)
 */
export async function getPropertiesForLuxeToggle() {
  try {
    const properties = await db.query.propertyTable.findMany({
      columns: {
        id: true,
        title: true,
        name: true,
        isLuxe: true,
        price: true
      },
      with: {
        community: true,
        images: {
          limit: 1
        }
      },
      limit: 50,
      orderBy: (properties, { desc }) => [desc(properties.createdAt)],
    });

    return {
      success: true,
      properties: properties.map(p => ({
        id: p.id,
        title: p.title || p.name || 'Untitled Property',
        isLuxe: p.isLuxe || false,
        price: Number(p.price) || 0,
        community: p.community?.name || 'Unknown',
        imageUrl: p.images?.[0]?.s3Url || null
      }))
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
