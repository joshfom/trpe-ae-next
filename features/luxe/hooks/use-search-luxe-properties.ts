import { and, asc, desc, eq, gte, inArray, ilike, lte, or, sql } from "drizzle-orm";
import { extractPathSearchParams } from "@/features/search/hooks/path-search-helper";
import { propertyTable, propertyTableSchema } from "@/db/schema/property-table";
import { communityTable, CommunitySelect, communitySelectSchema } from "@/db/schema/community-table";
import { propertyTypeTable, PropertyTypeSelect, propertyTypeSelectSchema } from "@/db/schema/property-type-table";
import { unitTypeTable, UnitTypeSelect, unitTypeSelectSchema } from "@/db/schema/unit-type-table";
import { offeringTypeTable, OfferingTypeSelect, offeringTypeSelectSchema } from "@/db/schema/offering-type-table";
import { propertyImagesTable, PropertyImagesSelect, propertyImagesSelectSchema } from "@/db/schema/property-images-table";
import { db } from "@/db/drizzle";
import { z } from "zod";
import { notFound } from "next/navigation";

// Define Json type directly in this file to avoid module resolution issues
type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

// Define the interface for function parameters
interface GetPropertiesParams {
    offeringType?: string;
    propertyType?: string;
    searchParams: URLSearchParams;
    pathname: string;
    page?: string
}

// Define the interface for the function response
interface PropertySearchResponse {
    properties: EnrichedProperty[];
    totalCount: number;
    pages: number[];
    metaLinks: {
        currentPage: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    } | null;
    error: string | null;
    notFound?: boolean; // New field to indicate 404 status
}

// Use the Zod schemas to define the enriched property type
type PropertyTableSchema = z.infer<typeof propertyTableSchema>;

// Define the interface for the enriched property with related data
interface EnrichedProperty extends Omit<PropertyTableSchema, 'size'> {
    community: CommunitySelect | null;
    type: PropertyTypeSelect | null;
    unitType: UnitTypeSelect | null;
    offeringType: OfferingTypeSelect | null;
    images: PropertyImagesSelect[];
    size: number | null;
    area: number | null;
}

// Helper interface for query results
interface CountResult {
    count: number;
}

// Luxury property minimum price - constant for easy adjustment
const LUXURY_MIN_PRICE = 18000000;

export async function getLuxePropertiesServer({
                                             offeringType,
                                             propertyType,
                                             searchParams,
                                             pathname,
                                             page = '1'
                                          }: GetPropertiesParams): Promise<PropertySearchResponse> {
    // Validate that only the "page" parameter exists and has a valid numeric value
    // Get all parameter keys from the URL
    const paramKeys = Array.from(searchParams.keys());
    
    // Check if there are any parameters other than "page" or if "page" is misspelled
    const hasInvalidParams = paramKeys.some(key => key !== 'page');
    
    // If there are invalid parameters or the page value is not numeric
    const pageValue = searchParams.get('page');
    if (hasInvalidParams || (pageValue && (!pageValue.match(/^\d+$/) || parseInt(pageValue, 10) < 1))) {
        return {
            properties: [],
            totalCount: 0,
            pages: [],
            metaLinks: null,
            error: null,
            notFound: true
        };
    }
    
    // Extract all search parameters
    const q = searchParams.get('q') || undefined;
    const bed = searchParams.get('bed') ? Number(searchParams.get('bed')) : undefined;
    const bathrooms = searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined;
    const minArea = searchParams.get('min-area') ? Number(searchParams.get('min-area')) : undefined;
    const maxArea = searchParams.get('max-area') ? Number(searchParams.get('max-area')) : undefined;
    const maxPrice = searchParams.get('max-price') ? Number(searchParams.get('max-price')) : undefined;
    const userMinPrice = searchParams.get('min-price') ? Number(searchParams.get('min-price')) : undefined;
    // Always use at least LUXURY_MIN_PRICE, but respect user's choice if higher
    const minPrice = userMinPrice && userMinPrice > LUXURY_MIN_PRICE ? userMinPrice : LUXURY_MIN_PRICE;
    const sortBy = searchParams.get('sort-by') || undefined;
    const typeSlug = (searchParams.get('property-type') || '').replace(/"/g, '');

    // Convert page to number and validate it
    let pageNumber = parseInt(page, 10);
    
    // Handle invalid page numbers (should be caught above, but keeping as a safeguard)
    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
    }
    
    const pageSize = 12;
    let offset = (pageNumber - 1) * pageSize;

    const searchedParams = extractPathSearchParams(pathname);
    const areas = searchedParams.areas;
    const unitType = searchedParams.unitType || propertyType;

    try {
        // First, let's fetch the necessary IDs based on slugs
        let unitTypeId: string | null = null;
        let communityIds: string[] = [];
        let offeringTypeIds: string[] = [];

        // If we have a unit type, get its ID
        if (unitType) {
            const unitTypeResult = await db
                .select({ id: unitTypeTable.id })
                .from(unitTypeTable)
                .where(eq(unitTypeTable.slug, unitType));

            unitTypeId = unitTypeResult.length > 0 ? unitTypeResult[0].id : null;
        }

        // Get community IDs if we have area slugs
        if (areas && areas.length > 0) {
            const communityResults = await db
                .select({ id: communityTable.id })
                .from(communityTable)
                .where(inArray(communityTable.slug, areas));

            communityIds = communityResults.map(c => c.id);
        }

        // Get offering type IDs if we have an offering type
        if (offeringType) {
            const offeringTypeResult = await db
                .select({ id: offeringTypeTable.id })
                .from(offeringTypeTable)
                .where(eq(offeringTypeTable.slug, offeringType));

            offeringTypeIds = offeringTypeResult.length > 0 ? [offeringTypeResult[0].id] : [];
        } else {
            // If no specific offering type, get all offering type IDs
            const allOfferingTypes = await db
                .select({ id: offeringTypeTable.id, slug: offeringTypeTable.slug })
                .from(offeringTypeTable);

            offeringTypeIds = allOfferingTypes.map(ot => ot.id);
        }

        // Build where conditions
        const whereConditions: any[] = [];

        // Filter by unit type
        if (unitTypeId) {
            whereConditions.push(eq(propertyTable.unitTypeId, unitTypeId));
        }

        // Filter by property type
        if (typeSlug) {
            const propertyTypeResult = await db
                .select({ id: propertyTypeTable.id })
                .from(propertyTypeTable)
                .where(eq(propertyTypeTable.slug, typeSlug));

            if (propertyTypeResult.length > 0) {
                whereConditions.push(eq(propertyTable.typeId, propertyTypeResult[0].id));
            }
        }

        // Filter by communities/areas
        if (communityIds.length > 0) {
            whereConditions.push(inArray(propertyTable.communityId, communityIds));
        }

        // Filter by bedrooms
        if (bed !== undefined) {
            whereConditions.push(eq(propertyTable.bedrooms, bed));
        }

        // Filter by bathrooms
        if (bathrooms !== undefined) {
            whereConditions.push(eq(propertyTable.bathrooms, bathrooms));
        }

        // Filter by price range
        whereConditions.push(gte(sql`CAST(${propertyTable.price} AS BIGINT)`, minPrice));
        if (maxPrice !== undefined) {
            whereConditions.push(lte(sql`CAST(${propertyTable.price} AS BIGINT)`, maxPrice));
        }

        // Filter by area/size range
        // Note: The schema indicates size is stored in centi units, so we need to multiply by 100
        if (minArea !== undefined) {
            whereConditions.push(gte(propertyTable.size, minArea * 100));
        }
        if (maxArea !== undefined) {
            whereConditions.push(lte(propertyTable.size, maxArea * 100));
        }

        // Text search condition
        if (q) {
            whereConditions.push(
                or(
                    ilike(propertyTable.title ?? '', `%${q}%`),
                    ilike(propertyTable.description ?? '', `%${q}%`),
                    ilike(propertyTable.name ?? '', `%${q}%`)
                )
            );
        }

        // Determine the sort order
        const orderBy = sortBy === 'price-asc' ? asc(propertyTable.price) :
            sortBy === 'price-desc' ? desc(propertyTable.price) :
                sortBy === 'date-desc' ? desc(propertyTable.createdAt) :
                    sortBy === 'date-asc' ? asc(propertyTable.createdAt) :
                        desc(propertyTable.createdAt); // Default sort order

        // Define sort function for in-memory sorting
        const sortProperties = (properties: PropertyTableSchema[]): PropertyTableSchema[] => {
            if (sortBy === 'price-asc') {
                return [...properties].sort((a, b) => (a.price ?? 0, 10) - (b.price ?? 0 , 10));
            } else if (sortBy === 'price-desc') {
                return [...properties].sort((a, b) => (b.price ?? 0, 10) - (a.price ?? 0, 10));
            } else if (sortBy === 'date-desc') {
                return [...properties].sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
            } else if (sortBy === 'date-asc') {
                return [...properties].sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateA - dateB;
                });
            } else {
                return [...properties].sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
            }
        };

        let resultProperties: PropertyTableSchema[] = [];
        let totalCount = 0;

        // Handle cases with multiple offering types
        if (unitTypeId && !offeringType) {
            // Get the standard offering type slugs
            const offeringTypes = ['for-rent', 'for-sale', 'commercial-sale', 'commercial-rent'];

            // First, get the total count for pagination calculation
            const countPromises = offeringTypes.map(async (typeSlug) => {
                const offeringTypeResult = await db
                    .select({ id: offeringTypeTable.id })
                    .from(offeringTypeTable)
                    .where(eq(offeringTypeTable.slug, typeSlug));

                if (offeringTypeResult.length === 0) return 0;

                const offeringTypeId = offeringTypeResult[0].id;
                const whereWithOfferingType = [...whereConditions, eq(propertyTable.offeringTypeId, offeringTypeId)];

                const countResult = await db.select({ count: sql<number>`count(*)` })
                    .from(propertyTable)
                    .where(and(...whereWithOfferingType)) as unknown as CountResult[];

                return countResult[0].count;
            });

            const counts = await Promise.all(countPromises);
            totalCount = counts.reduce((sum, count) => sum + count, 0);
            
            // Calculate total pages and check if the requested page is valid
            const totalPages = Math.ceil(totalCount / pageSize);
            if (pageNumber > totalPages && totalPages > 0) {
                // Return signal for 404 if page number exceeds total pages
                return {
                    properties: [],
                    totalCount,
                    pages: Array.from({ length: totalPages }, (_, i) => i + 1),
                    metaLinks: {
                        currentPage: pageNumber,
                        totalPages,
                        hasNext: false,
                        hasPrev: true,
                    },
                    error: null,
                    notFound: true // Signal for 404
                };
            }

            // Get all properties across all offering types without pagination initially
            const allPropertiesPromises = offeringTypes.map(async (typeSlug) => {
                const offeringTypeResult = await db
                    .select({ id: offeringTypeTable.id })
                    .from(offeringTypeTable)
                    .where(eq(offeringTypeTable.slug, typeSlug));

                if (offeringTypeResult.length === 0) return [] as PropertyTableSchema[];

                const offeringTypeId = offeringTypeResult[0].id;
                const whereWithOfferingType = [...whereConditions, eq(propertyTable.offeringTypeId, offeringTypeId)];

                // Get properties for this offering type (no pagination yet)
                return db.select()
                    .from(propertyTable)
                    .where(and(...whereWithOfferingType))
                    .orderBy(orderBy);
            });

            const allPropertiesResults = await Promise.all(allPropertiesPromises);

            // Combine all properties from different offering types
            let allProperties: PropertyTableSchema[] = [];
            allPropertiesResults.forEach(properties => {
                allProperties = [...allProperties, ...properties];
            });

            // Sort all properties and then apply pagination
            allProperties = sortProperties(allProperties);

            // Apply pagination to the combined and sorted results
            resultProperties = allProperties.slice(offset, offset + pageSize);
        } else {
            // Single offering type case
            if (offeringType) {
                // Get the offering type ID
                const offeringTypeResult = await db
                    .select({ id: offeringTypeTable.id })
                    .from(offeringTypeTable)
                    .where(eq(offeringTypeTable.slug, offeringType));

                if (offeringTypeResult.length > 0) {
                    whereConditions.push(eq(propertyTable.offeringTypeId, offeringTypeResult[0].id));
                }
            }

            // Get total count for pagination
            const countResult = await db.select({ count: sql<number>`count(*)` })
                .from(propertyTable)
                .where(and(...whereConditions)) as unknown as CountResult[];

            totalCount = countResult[0].count;
            
            // Calculate total pages and check if the requested page is valid
            const totalPages = Math.ceil(totalCount / pageSize);
            if (pageNumber > totalPages && totalPages > 0) {
                // Return signal for 404 if page number exceeds total pages
                return {
                    properties: [],
                    totalCount,
                    pages: Array.from({ length: totalPages }, (_, i) => i + 1),
                    metaLinks: {
                        currentPage: pageNumber,
                        totalPages,
                        hasNext: false,
                        hasPrev: true,
                    },
                    error: null,
                    notFound: true // Signal for 404
                };
            }

            // Fetch only the properties for this page
            resultProperties = await db.select()
                .from(propertyTable)
                .where(and(...whereConditions))
                .orderBy(orderBy)
                .limit(pageSize)
                .offset(offset);
        }

        // Now enrich the properties with related data
        const enrichedProperties: EnrichedProperty[] = await Promise.all(resultProperties.map(async (property) => {
            // Default values for related entities
            let community: CommunitySelect | null = null;
            let propType: PropertyTypeSelect | null = null;
            let unitT: UnitTypeSelect | null = null;
            let offering: OfferingTypeSelect | null = null;
            let images: PropertyImagesSelect[] = [];

            // Get property images
            if (property.id) {
                const propertyImagesResult = await db
                    .select()
                    .from(propertyImagesTable)
                    .where(eq(propertyImagesTable.propertyId, property.id));

                images = propertyImagesResult || [];
            }

            // Only fetch related data if the ID exists
            if (property.communityId) {
                const communityResult = await db
                    .select()
                    .from(communityTable)
                    .where(eq(communityTable.id, property.communityId))
                    .limit(1);
                if (communityResult.length > 0) {
                    // Use the community data as is without trying to access saleContent or rentContent
                    community = communityResult[0];
                }
            }

            if (property.typeId) {
                const propTypeResult = await db
                    .select()
                    .from(propertyTypeTable)
                    .where(eq(propertyTypeTable.id, property.typeId))
                    .limit(1);
                if (propTypeResult.length > 0) {
                    // Cast the saleContent and rentContent fields to Json type
                    propType = {
                        ...propTypeResult[0],
                        saleContent: propTypeResult[0].saleContent as Json,
                        rentContent: propTypeResult[0].rentContent as Json
                    };
                }
            }

            if (property.unitTypeId) {
                const unitTypeResult = await db
                    .select()
                    .from(unitTypeTable)
                    .where(eq(unitTypeTable.id, property.unitTypeId))
                    .limit(1);
                if (unitTypeResult.length > 0) {
                    unitT = unitTypeResult[0];
                }
            }

            if (property.offeringTypeId) {
                const offeringResult = await db
                    .select()
                    .from(offeringTypeTable)
                    .where(eq(offeringTypeTable.id, property.offeringTypeId))
                    .limit(1);
                if (offeringResult.length > 0) {
                    offering = offeringResult[0];
                }
            }

            return {
                ...property,
                community,
                type: propType,
                unitType: unitT,
                offeringType: offering,
                images,
                // Convert size from centi units back to standard units
                size: property.size ? property.size  : null,
                area: property.size ? property.size  : null, // For backward compatibility
            };
        }));

        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            properties: enrichedProperties,
            totalCount,
            pages: Array.from({ length: totalPages }, (_, i) => i + 1),
            metaLinks: {
                currentPage: pageNumber, // This will now be the adjusted page number
                totalPages,
                hasNext: pageNumber < totalPages,
                hasPrev: pageNumber > 1,
            },
            error: null
        };
    } catch (error) {
        console.error("Failed to fetch properties:", error);
        return {
            properties: [],
            totalCount: 0,
            pages: [],
            metaLinks: null,
            error: "Failed to fetch properties"
        };
    }
}