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
                    const [rentType, saleType, commercialRentType, commercialSaleType] = await Promise.all([
                        db.query.offeringTypeTable.findFirst({
                            where: eq(offeringTypeTable.slug, "for-rent"),
                        }),
                        db.query.offeringTypeTable.findFirst({
                            where: eq(offeringTypeTable.slug, "for-sale"),
                        }),
                        db.query.offeringTypeTable.findFirst({
                            where: eq(offeringTypeTable.slug, "commercial-rent"),
                        }),
                        db.query.offeringTypeTable.findFirst({
                            where: eq(offeringTypeTable.slug, "commercial-sale"),
                        })
                    ]);

                    // Get all communities first
                    const baseCommunities = await db.select({
                        name: communityTable.name,
                        slug: communityTable.slug,
                        shortName: communityTable.shortName,
                        id: communityTable.id,
                    }).from(communityTable);

                    // Then calculate counts for each community
                    const communities = await Promise.all(baseCommunities.map(async (community) => {
                        const [propertyCount, rentCount, saleCount, commercialRentCount, commercialSaleCount] = await Promise.all([
                            db.$count(propertyTable, eq(propertyTable.communityId, community.id)),
                            rentType ? db.$count(propertyTable, and(eq(propertyTable.communityId, community.id), eq(propertyTable.offeringTypeId, rentType.id))) : Promise.resolve(0),
                            saleType ? db.$count(propertyTable, and(eq(propertyTable.communityId, community.id), eq(propertyTable.offeringTypeId, saleType.id))) : Promise.resolve(0),
                            commercialRentType ? db.$count(propertyTable, and(eq(propertyTable.communityId, community.id), eq(propertyTable.offeringTypeId, commercialRentType.id))) : Promise.resolve(0),
                            commercialSaleType ? db.$count(propertyTable, and(eq(propertyTable.communityId, community.id), eq(propertyTable.offeringTypeId, commercialSaleType.id))) : Promise.resolve(0),
                        ]);

                        return {
                            name: community.name,
                            slug: community.slug,
                            shortName: community.shortName,
                            propertyCount,
                            rentCount,
                            saleCount,
                            commercialRentCount,
                            commercialSaleCount,
                        };
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