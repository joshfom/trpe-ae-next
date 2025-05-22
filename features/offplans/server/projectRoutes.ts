import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {and, asc, desc, eq, gte, inArray, lte, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {communityTable} from "@/db/schema/community-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {propertyImagesTable} from "@/db/schema/property-images-table";
import {offplanTable} from "@/db/schema/offplan-table";

const app = new Hono()
    .get("/",
        async (c) => {
            try {
                // Construct the query for propertyTable, conditionally including the unitType filter if it exists.
                // Step 1: Fetch properties
                const data = await db.query.offplanTable.findMany({
                    orderBy: [desc(offplanTable.createdAt)],
                    with: {
                        developer: true,
                        community: true,
                        images: true,
                    },
                    limit: 15,
                });

                return c.json({
                    data,
                });
            } catch (error) {
                console.error("Error fetching projects:", error);
                // Return empty array instead of error to prevent build failures
                return c.json({
                    data: [],
                }, 200);
            }
        })

    .get("/:slug",
        zValidator("param", z.object({
                slug: z.string().optional()
            }),
        ),

        async (c) => {
            try {
                const {slug} = c.req.param();

                const property = await db.query.propertyTable.findFirst({
                    where: and(
                        eq(propertyTable.slug, slug),
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
                });

                if (!property) {
                    return c.json({error: "Property not found."}, 404);
                }

                // Get similar properties
                const similarProperties = await db.query.propertyTable.findMany({
                    where: and(
                        eq(propertyTable.communityId, property.communityId!),
                    ),
                    with: {
                        community: true,
                        subCommunity: true,
                        agent: true,
                        city: true,
                        offeringType: true,
                        images: true,
                    },
                    limit: 3,
                });

                return c.json({data: {property, similarProperties}});
            } catch (error) {
                console.error("Error fetching property by slug:", error);
                return c.json({error: "Error fetching property"}, 500);
            }
        })

    .get("/:offeringTypeId/featured_property",
        zValidator("param", z.object({
            offeringTypeId: z.string().optional()
        })),
        zValidator("query", z.object({
            limit: z.string(),
        })),

        async (c) => {
            try {
                const {offeringTypeId} = c.req.param();

                const {
                    limit,
                } = c.req.valid('query');

                const currentLimit = parseInt(limit, 10);

                const [data] = await db.query.propertyTable.findMany({
                    where: and(
                        eq(propertyTable.offeringTypeId, offeringTypeId),
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

                return c.json({data});
            } catch (error) {
                console.error("Error fetching featured property:", error);
                return c.json({data: null}, 200);
            }
        })

    .get("/unit_type", async (c) => {
        try {
            const data = await db.query.propertyTypeTable.findMany();
            return c.json({data});
        } catch (error) {
            console.error("Error fetching unit types:", error);
            return c.json({data: []}, 200);
        }
    });

export default app