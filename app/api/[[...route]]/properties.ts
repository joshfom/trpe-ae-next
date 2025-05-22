import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {and, eq, gte, inArray, isNotNull, lte, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {communityTable} from "@/db/schema/community-table";

const app = new Hono()

    /**
     * Handles GET requests to fetch properties based on various query parameters.
     *
     * @param {string} offeringTypeId - The ID of the offering type to filter properties.
     * @param {number} [limit=10] - The maximum number of properties to return.
     * @param {number} [offset] - The number of properties to skip before starting to collect the result set.
     * @param {string} [lo] - The location to filter properties.
     * @param {string} [minPrice] - The minimum price to filter properties.
     * @param {string} [maxPrice] - The maximum price to filter properties.
     * @param {string} [bed] - The minimum number of bedrooms to filter properties.
     * @param {string} [bath] - The minimum number of bathrooms to filter properties.
     * @param {string} [miArea] - The minimum area to filter properties.
     * @param {string} [mxArea] - The maximum area to filter properties.
     * @param {string} [sortBy] - The field to sort the properties by.
     * @param {string} [sortOrder] - The order to sort the properties (asc or desc).
     * @param {string} [typeSlug] - The slug of the property type to filter properties.
     * @param {string} [page] - The page number for pagination.
     * @returns {Promise<Response>} - A JSON response containing the filtered properties, total count, and a flag indicating if there are more properties.
     */
    .get("/:offerType/listings/search",
        zValidator("param", z.object({
            offerType: z.string().optional()
        })),
        zValidator("query", z.object({
            areas: z.array(z.string()).optional(),
            limit: z.number().optional(),
            offset: z.number().optional(),
            minPrice: z.string().optional(),
            maxPrice: z.string().optional(),
            bed: z.string().optional(),
            bath: z.string().optional(),
            sortBy: z.string().optional(),
            sortOrder: z.string().optional(),
            typeSlug: z.string().optional(),
            page: z.string().optional(),
        })),
        async (c) => {


            const {
                offset,
                minPrice,
                maxPrice,
                bed,
                bath,
                areas,
                sortBy,
                typeSlug,
                page
            } = c.req.valid('query');


            const {offerType} = c.req.param();


            const bedrooms = bed ? parseInt(bed, 10) : undefined;
            const bathrooms = bath ? parseInt(bath, 10) : undefined;
            const startPrice = minPrice ? parseInt(minPrice, 10) : undefined;
            const endPrice = maxPrice ? parseInt(maxPrice, 10) : undefined;


            let offeringType

            if (offerType) {
                offeringType = await db.query.offeringTypeTable.findFirst({
                    where: eq(offeringTypeTable.slug, offerType),
                });
            }


            let communities = []

            if (areas) {
                for (let i = 0; i < areas.length; i++) {
                    const community = await db.query.communityTable.findFirst({
                        where: eq(communityTable.slug, areas[i]),
                    });

                    communities.push(community?.id)
                }
            }

            const pageSize = 15;

            const currentPage = page ? parseInt(page, 10) : 1;


            let unitType

            if (unitType) {
                unitType = await db.query.propertyTypeTable.findFirst({
                    where: eq(propertyTypeTable.slug, unitType),
                });
            }

            // Construct the query for propertyTable, conditionally including the unitType filter if it exists.
            // Step 1: Fetch properties
            const data = await db.query.propertyTable.findMany({
                where: and(
                    offeringType ? eq(propertyTable.offeringTypeId, offeringType.id) : undefined,
                    bedrooms ? gte(propertyTable.bedrooms, bedrooms) : undefined,
                    bathrooms ? lte(propertyTable.bedrooms, bathrooms) : undefined,
                    unitType?.id ? eq(propertyTable.typeId, unitType.id) : undefined,
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
                limit: 15,
                offset: page ? (currentPage - 1) * pageSize : offset
            });

            // Step 2: Get total count of properties matching the conditions
            const totalCount = await db.select({count: sql<number>`count(*)`})
                .from(propertyTable)
                .where(and(
                    offeringType ? eq(propertyTable.offeringTypeId, offeringType.id) : undefined,
                    // minPrice ? gte(propertyTable.price, startPrice) : undefined,
                    // maxPrice ? lte(propertyTable.price, endPrice) : undefined,
                    bedrooms ? gte(propertyTable.bedrooms, bedrooms) : undefined,
                    bathrooms ? lte(propertyTable.bedrooms, bathrooms) : undefined,
                    unitType?.id ? eq(propertyTable.typeId, unitType.id) : undefined,
                ))
                .then(result => result[0].count);

            // Generate pages
            const totalPages = Math.ceil(totalCount / pageSize);
            const pages = Array.from({length: totalPages}, (_, i) => i + 1);

            return c.json({
                data: {
                    properties: data,
                    pages,
                    totalCount,
                    metaLinks: {
                        currentPage: currentPage,
                        totalPages: totalPages - 1,
                        hasNext: currentPage < totalPages - 1,
                        hasPrev: currentPage > 1,
                    }
                }

            });
        }
    )



    /**
     * Handles GET requests to fetch a property by its slug and similar properties.
     *
     * @param {string} slug - The slug of the property to fetch.
     * @returns {Promise<Response>} - A JSON response containing the property and similar properties.
     */
    .get("/:slug",
        zValidator("param", z.object({
                slug: z.string().optional()
            }),
        ),

        async (c) => {

            // Extract the slug parameter from the request
            const {slug} = c.req.param();

            // Query the database to find the property matching the provided slug
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
            })

            // If the property is not found, return a 404 error response
            if (!property) {
                return c.json({error: "Property not found."}, 404)
            }

            // Query the database to find similar properties in the same community
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
                    // amenities: true,
                },
                limit: 3,
            })

            // Return the property and similar properties as a JSON response
            return c.json({data: {property, similarProperties}})
        })



    /**
     * Handles GET requests to fetch featured properties based on the offering type ID.
     *
     * @param {string} offeringTypeId - The ID of the offering type to filter properties.
     * @param {string} limit - The maximum number of properties to return.
     * @returns {Promise<Response>} - A JSON response containing the featured properties.
     */
    .get("/:offeringTypeId/featured_property",
        zValidator("param", z.object({
            offeringTypeId: z.string().optional()
        })),
        zValidator("query", z.object({
            limit: z.string(),
        })),

        async (c) => {

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

            return c.json({data})
        })



    /**
     * Handles GET requests to fetch all property types.
     *
     * @returns {Promise<Response>} - A JSON response containing all property types.
     */
    .get("/unit_type", async (c) => {
        // Query the database to find all property types
        const data = await db.query.propertyTypeTable.findMany({
            where: isNotNull(propertyTypeTable.name),
        });

        // Return the property types data as a JSON response
        return c.json({data});
    })


    /**
     * Handles GET requests to fetch all property types.
     *
     * @returns {Promise<Response>} - A JSON response containing all property types.
     */
    .get("/offer/:offeringTypeId", async (c) => {
        // Query the database to find all property types
        const data = await db.query.propertyTypeTable.findMany();

        // Return the property types data as a JSON response
        return c.json({data});
    })


export default app