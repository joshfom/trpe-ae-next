import { SQL, SQLWrapper, and, asc, desc, eq, gte, inArray, ilike, lte, or, sql } from "drizzle-orm";
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

// Cache for offering type IDs to avoid repeated lookups
const offeringTypeCache = new Map<string, string>();
const propertyTypeCache = new Map<string, string>();
const unitTypeCache = new Map<string, string>();
const communityCache = new Map<string, string>();

export async function getPropertiesServer({
    offeringType,
    propertyType,
    searchParams,
    pathname,
    page = '1'
}: GetPropertiesParams): Promise<PropertySearchResponse> {
    // Validate that only the "page" parameter exists and has a valid numeric value
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
    const minPrice = searchParams.get('min-price') ? Number(searchParams.get('min-price')) : undefined;
    const sortBy = searchParams.get('sort-by') || undefined;
    const typeSlug = (searchParams.get('property-type') || '').replace(/"/g, '');

    // Convert page to number and validate it
    let pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
    }
    
    const pageSize = 12;
    const offset = (pageNumber - 1) * pageSize;

    const searchedParams = extractPathSearchParams(pathname);
    const areas = searchedParams.areas;
    const unitType = searchedParams.unitType || propertyType;

    try {
        // Prepare SQL conditions array
        const whereConditions: any[] = [];
        
        // Run all ID lookups in parallel for better performance
        const [unitTypeIdPromise, communityIdsPromise, offeringTypeIdsPromise, propertyTypeIdPromise] = await Promise.all([
            // Get unitType ID if needed
            unitType ? getUnitTypeId(unitType) : Promise.resolve(null),
            
            // Get community IDs if we have area slugs
            areas && areas.length > 0 ? getCommunityIds(areas) : Promise.resolve([]),
            
            // Get offering type IDs
            offeringType ? getSingleOfferingTypeId(offeringType) : getAllOfferingTypeIds(),
            
            // Get property type ID if needed
            typeSlug ? getPropertyTypeId(typeSlug) : Promise.resolve(null)
        ]);
        
        const unitTypeId = unitTypeIdPromise;
        const communityIds = communityIdsPromise;
        const offeringTypeIds = offeringTypeIdsPromise;
        const propertyTypeId = propertyTypeIdPromise;

        // Build where conditions
        if (unitTypeId) {
            whereConditions.push(eq(propertyTable.unitTypeId, unitTypeId));
        }

        if (propertyTypeId) {
            whereConditions.push(eq(propertyTable.typeId, propertyTypeId));
        }

        if (communityIds.length > 0) {
            whereConditions.push(inArray(propertyTable.communityId, communityIds));
        }

        if (bed !== undefined) {
            whereConditions.push(eq(propertyTable.bedrooms, bed));
        }

        if (bathrooms !== undefined) {
            whereConditions.push(eq(propertyTable.bathrooms, bathrooms));
        }

        if (minPrice !== undefined) {
            whereConditions.push(gte(sql`CAST(${propertyTable.price} AS INTEGER)`, minPrice));
        }
        
        if (maxPrice !== undefined) {
            whereConditions.push(lte(sql`CAST(${propertyTable.price} AS INTEGER)`, maxPrice));
        }

        if (minArea !== undefined) {
            whereConditions.push(gte(propertyTable.size, minArea * 100));
        }
        
        if (maxArea !== undefined) {
            whereConditions.push(lte(propertyTable.size, maxArea * 100));
        }

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

        // Process properties based on offering types
        let totalCount = 0;
        let resultProperties: PropertyTableSchema[] = [];

        // Handle cases with unit type but no specific offering type (multiple offering types)
        if (unitTypeId && !offeringType) {
            // Instead of separate queries per offering type, use a single query with WHERE IN clause
            whereConditions.push(inArray(propertyTable.offeringTypeId, offeringTypeIds));
            
            // Get count in a single query
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
                    notFound: true
                };
            }
            
            // Fetch properties with pagination directly in the database
            resultProperties = await db.select()
                .from(propertyTable)
                .where(and(...whereConditions))
                .orderBy(orderBy)
                .limit(pageSize)
                .offset(offset);
                
        } else {
            // Single offering type case - add offering type condition if specified
            if (offeringType && offeringTypeIds.length > 0) {
                whereConditions.push(eq(propertyTable.offeringTypeId, offeringTypeIds[0]));
            } else if (offeringTypeIds.length > 0) {
                // If we have multiple offering types, use IN operator
                whereConditions.push(inArray(propertyTable.offeringTypeId, offeringTypeIds));
            }

            // Get total count for pagination
            const countResult = await db.select({ count: sql<number>`count(*)` })
                .from(propertyTable)
                .where(and(...whereConditions)) as unknown as CountResult[];

            totalCount = countResult[0].count;
            
            // Calculate total pages and check if the requested page is valid
            const totalPages = Math.ceil(totalCount / pageSize);
            if (pageNumber > totalPages && totalPages > 0) {
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
                    notFound: true
                };
            }

            // Fetch only the properties for this page with the adjusted offset
            resultProperties = await db.select()
                .from(propertyTable)
                .where(and(...whereConditions))
                .orderBy(orderBy)
                .limit(pageSize)
                .offset(offset);
        }

        // Early return if no properties found
        if (resultProperties.length === 0) {
            const totalPages = Math.ceil(totalCount / pageSize);
            return {
                properties: [],
                totalCount,
                pages: Array.from({ length: totalPages }, (_, i) => i + 1),
                metaLinks: {
                    currentPage: pageNumber,
                    totalPages,
                    hasNext: pageNumber < totalPages,
                    hasPrev: pageNumber > 1,
                },
                error: null
            };
        }

        // Batch load related entities for all properties at once
        const propertyIds = resultProperties.map(p => p.id);
        const relatedCommunityIds = resultProperties.map(p => p.communityId).filter(Boolean) as string[];
        const typeIds = resultProperties.map(p => p.typeId).filter(Boolean) as string[];
        const unitTypeIds = resultProperties.map(p => p.unitTypeId).filter(Boolean) as string[];
        const relatedOfferingTypeIds = resultProperties.map(p => p.offeringTypeId).filter(Boolean) as string[];
        
        // Fetch all related data in parallel for maximum performance
        const [imagesMap, communitiesMap, propertyTypesMap, unitTypesMap, offeringTypesMap] = await Promise.all([
            // Get all property images in one batch query
            fetchPropertyImages(propertyIds),
            
            // Get all communities in one batch query
            fetchCommunities(relatedCommunityIds),
            
            // Get all property types in one batch query
            fetchPropertyTypes(typeIds),
            
            // Get all unit types in one batch query  
            fetchUnitTypes(unitTypeIds),
            
            // Get all offering types in one batch query
            fetchOfferingTypes(relatedOfferingTypeIds)
        ]);

        // Map the properties with their related entities
        const enrichedProperties: EnrichedProperty[] = resultProperties.map((property) => {
            return {
                ...property,
                community: (property.communityId && communitiesMap.get(property.communityId)) || null,
                type: (property.typeId && propertyTypesMap.get(property.typeId)) || null,
                unitType: (property.unitTypeId && unitTypesMap.get(property.unitTypeId)) || null,
                offeringType: (property.offeringTypeId && offeringTypesMap.get(property.offeringTypeId)) || null,
                images: (imagesMap.get(property.id) || []),
                size: property.size,
                area: property.size // For backward compatibility
            };
        });

        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            properties: enrichedProperties,
            totalCount,
            pages: Array.from({ length: totalPages }, (_, i) => i + 1),
            metaLinks: {
                currentPage: pageNumber,
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

// Helper functions for batch loading and caching

// Get unit type ID by slug, with caching
async function getUnitTypeId(slug: string): Promise<string | null> {
    // Check cache first
    if (unitTypeCache.has(slug)) {
        return unitTypeCache.get(slug) || null;
    }
    
    const result = await db
        .select({ id: unitTypeTable.id })
        .from(unitTypeTable)
        .where(eq(unitTypeTable.slug, slug));
        
    const id = result.length > 0 ? result[0].id : null;
    
    // Cache the result
    if (id) unitTypeCache.set(slug, id);
    
    return id;
}

// Get community IDs by slugs, with caching
async function getCommunityIds(slugs: string[]): Promise<string[]> {
    // Check which slugs we already have cached
    const uncachedSlugs = slugs.filter(slug => !communityCache.has(slug));
    
    // If all slugs are cached, return from cache
    if (uncachedSlugs.length === 0) {
        return slugs.map(slug => communityCache.get(slug)!).filter(Boolean);
    }
    
    // Fetch the uncached slugs
    if (uncachedSlugs.length > 0) {
        const results = await db
            .select({ id: communityTable.id, slug: communityTable.slug })
            .from(communityTable)
            .where(inArray(communityTable.slug, uncachedSlugs));
            
        // Update the cache
        results.forEach(item => {
            communityCache.set(item.slug, item.id);
        });
    }
    
    // Now get all IDs from cache
    return slugs.map(slug => communityCache.get(slug)).filter(Boolean) as string[];
}

// Get single offering type ID by slug, with caching
async function getSingleOfferingTypeId(slug: string): Promise<string[]> {
    // Check cache first
    if (offeringTypeCache.has(slug)) {
        return [offeringTypeCache.get(slug)!];
    }
    
    const result = await db
        .select({ id: offeringTypeTable.id })
        .from(offeringTypeTable)
        .where(eq(offeringTypeTable.slug, slug));
        
    if (result.length === 0) return [];
    
    // Cache the result
    offeringTypeCache.set(slug, result[0].id);
    
    return [result[0].id];
}

// Get all offering type IDs
async function getAllOfferingTypeIds(): Promise<string[]> {
    const allTypes = await db
        .select({ id: offeringTypeTable.id, slug: offeringTypeTable.slug })
        .from(offeringTypeTable);
        
    // Update the cache
    allTypes.forEach(item => {
        offeringTypeCache.set(item.slug, item.id);
    });
    
    return allTypes.map(ot => ot.id);
}

// Get property type ID by slug, with caching
async function getPropertyTypeId(slug: string): Promise<string | null> {
    // Check cache first
    if (propertyTypeCache.has(slug)) {
        return propertyTypeCache.get(slug) || null;
    }
    
    const result = await db
        .select({ id: propertyTypeTable.id })
        .from(propertyTypeTable)
        .where(eq(propertyTypeTable.slug, slug));
        
    const id = result.length > 0 ? result[0].id : null;
    
    // Cache the result
    if (id) propertyTypeCache.set(slug, id);
    
    return id;
}

// Fetch property images for multiple properties at once
async function fetchPropertyImages(propertyIds: string[]): Promise<Map<string, PropertyImagesSelect[]>> {
    if (!propertyIds.length) return new Map();
    
    const images = await db
        .select()
        .from(propertyImagesTable)
        .where(inArray(propertyImagesTable.propertyId, propertyIds));
        
    // Group images by propertyId
    const imagesMap = new Map<string, PropertyImagesSelect[]>();
    
    for (const image of images) {
        const propertyId = image.propertyId;
        if (!propertyId) continue; // Skip images without propertyId
        
        if (!imagesMap.has(propertyId)) {
            imagesMap.set(propertyId, []);
        }
        imagesMap.get(propertyId)!.push(image);
    }
    
    return imagesMap;
}

// Fetch communities for multiple properties at once
async function fetchCommunities(communityIds: string[]): Promise<Map<string, CommunitySelect>> {
    if (!communityIds.length) return new Map();
    
    const communities = await db
        .select()
        .from(communityTable)
        .where(inArray(communityTable.id, communityIds));
        
    // Create a map of id -> community
    const communitiesMap = new Map<string, CommunitySelect>();
    
    for (const community of communities) {
        communitiesMap.set(community.id, community);
    }
    
    return communitiesMap;
}

// Fetch property types for multiple properties at once
async function fetchPropertyTypes(typeIds: string[]): Promise<Map<string, PropertyTypeSelect>> {
    if (!typeIds.length) return new Map();
    
    const types = await db
        .select()
        .from(propertyTypeTable)
        .where(inArray(propertyTypeTable.id, typeIds));
        
    // Create a map of id -> property type and cast saleContent and rentContent to Json
    const typesMap = new Map<string, PropertyTypeSelect>();
    
    for (const type of types) {
        typesMap.set(type.id, {
            ...type,
            saleContent: type.saleContent as Json,
            rentContent: type.rentContent as Json
        });
    }
    
    return typesMap;
}

// Fetch unit types for multiple properties at once
async function fetchUnitTypes(unitTypeIds: string[]): Promise<Map<string, UnitTypeSelect>> {
    if (!unitTypeIds.length) return new Map();
    
    const unitTypes = await db
        .select()
        .from(unitTypeTable)
        .where(inArray(unitTypeTable.id, unitTypeIds));
        
    // Create a map of id -> unit type
    const unitTypesMap = new Map<string, UnitTypeSelect>();
    
    for (const unitType of unitTypes) {
        unitTypesMap.set(unitType.id, unitType);
    }
    
    return unitTypesMap;
}

// Fetch offering types for multiple properties at once
async function fetchOfferingTypes(offeringTypeIds: string[]): Promise<Map<string, OfferingTypeSelect>> {
    if (!offeringTypeIds.length) return new Map();
    
    const offeringTypes = await db
        .select()
        .from(offeringTypeTable)
        .where(inArray(offeringTypeTable.id, offeringTypeIds));
        
    // Create a map of id -> offering type
    const offeringTypesMap = new Map<string, OfferingTypeSelect>();
    
    for (const offeringType of offeringTypes) {
        offeringTypesMap.set(offeringType.id, offeringType);
    }
    
    return offeringTypesMap;
}