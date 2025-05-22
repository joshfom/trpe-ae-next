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
        })



        .get("/list",
            async (c) => {

                const rentType = await db.query.offeringTypeTable.findFirst({
                    where: eq(offeringTypeTable.slug, "for-rent"),
                })

                const saleType = await db.query.offeringTypeTable.findFirst({
                    where: eq(offeringTypeTable.slug, "for-sale"),
                })

                const commercialRentType = await db.query.offeringTypeTable.findFirst({
                    where: eq(offeringTypeTable.slug, "commercial-rent"),
                })

                const commercialSaleType = await db.query.offeringTypeTable.findFirst({
                    where: eq(offeringTypeTable.slug, "commercial-sale"),
                })


        
                // Query the database to find all communities with their properties
                const communities = await db.select({
                    name: communityTable.name,
                    slug: communityTable.slug,
                    shortName: communityTable.shortName,
                    propertyCount: db.$count(propertyTable, eq(propertyTable.communityId, communityTable.id)),
                    rentCount: db.$count(propertyTable, and(eq(propertyTable.communityId, communityTable.id), eq(propertyTable.offeringTypeId, rentType?.id!))),
                    saleCount: db.$count(propertyTable, and(eq(propertyTable.communityId, communityTable.id), eq(propertyTable.offeringTypeId, saleType?.id!))),
                    commercialRentCount: db.$count(propertyTable, and(eq(propertyTable.communityId, communityTable.id), eq(propertyTable.offeringTypeId, commercialRentType?.id!))),    
                    commercialSaleCount: db.$count(propertyTable, and(eq(propertyTable.communityId, communityTable.id), eq(propertyTable.offeringTypeId, commercialSaleType?.id!))),
                }).from(communityTable);
              
    
    
                // Return the sorted communities data as a JSON response
                return c.json({communities})
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