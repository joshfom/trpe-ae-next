"use server";

import { db } from "@/db/drizzle";
import { propertyTable } from "@/db/schema/property-table";
import { eq, and, ne } from "drizzle-orm";
import slugify from "slugify";

export async function validateLuxePropertySlugAction(slug: string, excludeId?: string) {
    try {
        // First, normalize the slug
        const normalizedSlug = slugify(slug, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });

        // Check if slug exists (excluding current property if editing)
        let whereCondition;
        
        if (excludeId) {
            // When editing, exclude the current property from the check
            whereCondition = and(
                eq(propertyTable.slug, normalizedSlug),
                ne(propertyTable.id, excludeId)
            );
        } else {
            // When creating new, just check if slug exists
            whereCondition = eq(propertyTable.slug, normalizedSlug);
        }

        const existingProperty = await db
            .select({ id: propertyTable.id })
            .from(propertyTable)
            .where(whereCondition)
            .limit(1);

        if (existingProperty.length > 0) {
            // Generate unique slug by appending number
            let counter = 1;
            let uniqueSlug = `${normalizedSlug}-${counter}`;
            
            while (true) {
                let checkWhereCondition;
                
                if (excludeId) {
                    checkWhereCondition = and(
                        eq(propertyTable.slug, uniqueSlug),
                        ne(propertyTable.id, excludeId)
                    );
                } else {
                    checkWhereCondition = eq(propertyTable.slug, uniqueSlug);
                }
                
                const checkUnique = await db
                    .select({ id: propertyTable.id })
                    .from(propertyTable)
                    .where(checkWhereCondition)
                    .limit(1);
                
                if (checkUnique.length === 0) {
                    break;
                }
                
                counter++;
                uniqueSlug = `${normalizedSlug}-${counter}`;
            }
            
            return {
                success: true,
                isUnique: false,
                suggestedSlug: uniqueSlug,
                originalSlug: normalizedSlug
            };
        }

        return {
            success: true,
            isUnique: true,
            suggestedSlug: normalizedSlug,
            originalSlug: normalizedSlug
        };
        
    } catch (error) {
        console.error("Error validating slug:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            isUnique: false,
            suggestedSlug: slug,
            originalSlug: slug
        };
    }
}

export async function generateSlugFromTitleAction(title: string, excludeId?: string) {
    try {
        const baseSlug = slugify(title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });

        const validation = await validateLuxePropertySlugAction(baseSlug, excludeId);
        
        return {
            success: true,
            slug: validation.suggestedSlug
        };
        
    } catch (error) {
        console.error("Error generating slug:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            slug: title
        };
    }
}
