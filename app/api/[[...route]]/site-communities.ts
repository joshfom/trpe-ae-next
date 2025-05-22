import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";

const app = new Hono()

    /**
     * Handles GET requests to fetch all communities.
     *
     * @returns {Promise<Response>} - A JSON response containing all communities.
     */
    .get("/",
        async (c) => {
            // Query the database to find all communities
            const data = await db.query.communityTable.findMany()

            // Return the communities data as a JSON response
            return c.json({data})
        })


    /**
     * Handles GET requests to fetch properties by community slug.
     *
     * @param {string} slug - The slug of the community to fetch properties for.
     * @returns {Promise<Response>} - A JSON response containing the community properties.
     */
    .get("/:slug/properties",
        zValidator("param", z.object({
            slug: z.string().optional()
        })),
        async (c) => {

            // Extract the slug parameter from the request
            const {slug} = c.req.param();

            // Query the database to find the community matching the provided slug and its properties
            const data = await db.query.communityTable.findFirst({
                where: eq(communityTable.slug, slug),
                with: {
                    properties: {
                        with: {
                            images: true,
                            city: true,
                            community: true,
                            subCommunity: true,
                            agent: true,
                            offeringType: true,
                        }
                    },
                }
            })

            // Return the community properties as a JSON response
            return c.json({data})

        })
export default app