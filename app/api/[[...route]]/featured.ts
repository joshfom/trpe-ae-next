import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {and, eq} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";

const app = new Hono()



  /**
 * Handles GET requests to fetch properties by offering type ID with a specified limit.
 *
 * @param {string} offeringTypeId - The ID of the offering type to fetch properties for.
 * @param {string} limit - The maximum number of properties to fetch.
 * @returns {Promise<Response>} - A JSON response containing the properties or an error message if the offering type is not found.
 */
.get("/:offeringTypeId",
    zValidator("param", z.object({
        offeringTypeId: z.string().optional()
    })),
    zValidator("query", z.object({
        limit: z.string(),
    })),

    async (c) => {

        // Extract the offeringTypeId parameter from the request
        const {offeringTypeId} = c.req.param();

        // Extract the limit query parameter from the request
        const {
            limit,
        } = c.req.valid('query');

        // Parse the limit to an integer
        const currentLimit = parseInt(limit, 10);

        // Query the database to find the offering type matching the provided ID
        const offeringType = await db.query.offeringTypeTable.findFirst({
            where: and(
                eq(offeringTypeTable.slug, offeringTypeId),
            ),
        });

        // If the offering type is not found, return a 404 error response
        if (!offeringType) {
            return c.json({message: 'Not Found'}, 404);
        }

        // Query the database to find properties associated with the offering type
        const [data] = await db.query.propertyTable.findMany({
            where: and(
                eq(propertyTable.offeringTypeId, offeringType.id),
            ),
            with: {
                community: true,
                subCommunity: true,
                agent: true,
                city: true,
                offeringType: true,
                images: true,
                type: true,
            },
            limit: currentLimit,
        });

        // Return the properties data as a JSON response
        return c.json({data});
    })


export default app