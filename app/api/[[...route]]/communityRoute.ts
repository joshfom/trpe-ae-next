import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {and, eq} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";
import {propertyTable} from "@/db/schema/property-table";
import { offeringTypeTable } from "@/db/schema/offering-type-table";

const app = new Hono()

    /**
     * Handles GET requests to fetch all communities and sorts them by the number of properties in descending order.
     *
     * @returns {Promise<Response>} - A JSON response containing all communities sorted by the number of properties.
     */
    .get("/",
        async (c) => {
            try {
                // Query the database to find all communities with their properties
                const communities = await db.query.communityTable.findMany({
                    with: {
                        properties: true,
                    }
                })

                // Sort the communities by the number of properties in descending order
                const data = communities.sort((a, b) => a.properties.length - b.properties.length).reverse()

                // Return the sorted communities data as a JSON response
                return c.json({data})
            } catch (error) {
                console.error('Error fetching communities:', error);
                return c.json({error: "Internal server error"}, 500);
            }
        })



        .get("/list",
            async (c) => {
                try {
                    // Set response headers for caching
                    c.header('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // 5 min cache, 10 min stale
                    
                    // Step 1: Get all communities (simple query first)
                    const allCommunities = await db.select({
                        id: communityTable.id,
                        name: communityTable.name,
                        slug: communityTable.slug,
                        shortName: communityTable.shortName,
                    }).from(communityTable);

                    if (allCommunities.length === 0) {
                        return c.json({communities: []});
                    }

                    // Step 2: Get offering types (optimized to only fetch IDs)
                    const [rentType, saleType, commercialRentType, commercialSaleType] = await Promise.all([
                        db.query.offeringTypeTable.findFirst({
                            where: eq(offeringTypeTable.slug, "for-rent"),
                            columns: { id: true }
                        }),
                        db.query.offeringTypeTable.findFirst({
                            where: eq(offeringTypeTable.slug, "for-sale"),
                            columns: { id: true }
                        }),
                        db.query.offeringTypeTable.findFirst({
                            where: eq(offeringTypeTable.slug, "commercial-rent"),
                            columns: { id: true }
                        }),
                        db.query.offeringTypeTable.findFirst({
                            where: eq(offeringTypeTable.slug, "commercial-sale"),
                            columns: { id: true }
                        })
                    ]);

                    // Step 3: Get property counts separately for each type to avoid complex subqueries
                    const [totalCounts, rentCounts, saleCounts, commercialRentCounts, commercialSaleCounts] = await Promise.all([
                        // Total property counts per community
                        db.select({
                            communityId: propertyTable.communityId,
                            count: db.$count(propertyTable)
                        })
                        .from(propertyTable)
                        .groupBy(propertyTable.communityId),
                        
                        // Rent property counts
                        rentType ? db.select({
                            communityId: propertyTable.communityId,
                            count: db.$count(propertyTable)
                        })
                        .from(propertyTable)
                        .where(eq(propertyTable.offeringTypeId, rentType.id))
                        .groupBy(propertyTable.communityId) : [],
                        
                        // Sale property counts
                        saleType ? db.select({
                            communityId: propertyTable.communityId,
                            count: db.$count(propertyTable)
                        })
                        .from(propertyTable)
                        .where(eq(propertyTable.offeringTypeId, saleType.id))
                        .groupBy(propertyTable.communityId) : [],
                        
                        // Commercial rent property counts
                        commercialRentType ? db.select({
                            communityId: propertyTable.communityId,
                            count: db.$count(propertyTable)
                        })
                        .from(propertyTable)
                        .where(eq(propertyTable.offeringTypeId, commercialRentType.id))
                        .groupBy(propertyTable.communityId) : [],
                        
                        // Commercial sale property counts
                        commercialSaleType ? db.select({
                            communityId: propertyTable.communityId,
                            count: db.$count(propertyTable)
                        })
                        .from(propertyTable)
                        .where(eq(propertyTable.offeringTypeId, commercialSaleType.id))
                        .groupBy(propertyTable.communityId) : []
                    ]);

                    // Step 4: Create lookup maps for efficient data access
                    const totalCountsMap = new Map(totalCounts.map(item => [item.communityId, item.count || 0]));
                    const rentCountsMap = new Map(rentCounts.map(item => [item.communityId, item.count || 0]));
                    const saleCountsMap = new Map(saleCounts.map(item => [item.communityId, item.count || 0]));
                    const commercialRentCountsMap = new Map(commercialRentCounts.map(item => [item.communityId, item.count || 0]));
                    const commercialSaleCountsMap = new Map(commercialSaleCounts.map(item => [item.communityId, item.count || 0]));

                    // Step 5: Build final communities array
                    const communities = allCommunities.map(community => ({
                        name: community.name,
                        slug: community.slug,
                        shortName: community.shortName,
                        propertyCount: totalCountsMap.get(community.id) || 0,
                        rentCount: rentCountsMap.get(community.id) || 0,
                        saleCount: saleCountsMap.get(community.id) || 0,
                        commercialRentCount: commercialRentCountsMap.get(community.id) || 0,
                        commercialSaleCount: commercialSaleCountsMap.get(community.id) || 0,
                    }));
                  
                    // Return the communities data as a JSON response
                    return c.json({communities})
                } catch (error) {
                    console.error('Error fetching communities:', error);
                    return c.json({error: "Internal server error"}, 500);
                }
            })
    
    
    
            




    /**
     * Handles GET requests to fetch properties by community ID.
     *
     * @param {string} communityId - The ID of the community to fetch properties for.
     * @returns {Promise<Response>} - A JSON response containing the community properties or an error message if the community is not found.
     */
    .get("/:communityId",
        zValidator("param", z.object({
            communityId: z.string().optional()
        })),
        async (c) => {

            // Extract the communityId parameter from the request
            const {communityId} = c.req.param();

            // Query the database to find the community matching the provided ID
            const community = await db.query.communityTable.findFirst({
                where: eq(communityTable.id, communityId),
            })

            // If the community is not found, return a 404 error response
            if (!community) {
                return c.json({error: "Community not found"}, 404)
            }

            // Query the database to find properties associated with the community
            const data = await db.query.propertyTable.findMany({
                where: eq(propertyTable.id, community?.id),
                with: {
                    images: true,
                    city: true,
                    community: true,
                    subCommunity: true,
                    agent: true,
                    offeringType: true,
                }
            })

            // If no properties are found, return a 404 error response
            if (!data) {
                return c.json({error: "Community not found"}, 404)
            }

            // Return the community properties as a JSON response
            return c.json({
                data
            })

        })



    /**
     * Handles GET requests to fetch properties by community ID.
     *
     * @param {string} communityId - The ID of the community to fetch properties for.
     * @returns {Promise<Response>} - A JSON response containing the community properties or an error message if the community is not found.
     */
    .get("/:communityId/similar",
        zValidator("param", z.object({
            communityId: z.string().optional()
        })),
        async (c) => {

            // Extract the communityId parameter from the request
            const {communityId} = c.req.param();

            // Query the database to find the community matching the provided ID
            const community = await db.query.communityTable.findFirst({
                where: eq(communityTable.id, communityId),
            })

            // If the community is not found, return a 404 error response
            if (!community) {
                return c.json({error: "Community not found"}, 404)
            }

            // Query the database to find properties associated with the community
            const data = await db.query.propertyTable.findMany({
                where: eq(propertyTable.id, community?.id),
                with: {
                    images: true,
                    city: true,
                    community: true,
                    subCommunity: true,
                    agent: true,
                    offeringType: true,
                }
            })

            // If no properties are found, return a 404 error response
            if (!data) {
                return c.json({error: "Community not found"}, 404)
            }

            // Return the community properties as a JSON response
            return c.json({
                data
            })

        })

export default app