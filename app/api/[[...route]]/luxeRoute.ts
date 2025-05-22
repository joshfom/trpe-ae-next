import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {and, arrayOverlaps, eq, gte, lte, sql} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {communityTable} from "@/db/schema/community-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {propertyImagesTable} from "@/db/schema/property-images-table";

const app = new Hono()


    .get("/",
        zValidator("query", z.object({
            areas: z.array(z.string()).optional(),
            minPrice: z.string().optional(),
            maxPrice: z.string().optional(),
            beds: z.string().optional(),
            baths: z.string().optional(),
            sortBy: z.string().optional(),
            offeringType: z.string().optional(),
            page: z.string().optional(),
        })),
        async (c) => {

            console.log('hello here')

            const {
                areas,
                minPrice,
                maxPrice,
                beds,
                baths,
                sortBy,
                offeringType,
                page ,
            } = c.req.valid('query');


            let minimumPrice = minPrice ? parseInt(minPrice, 10) : 15000000;
            let maximumPrice = maxPrice ? parseInt(maxPrice, 10) : undefined;
            let bedrooms = beds ? parseInt(beds, 10) : undefined;
            let bathrooms = baths ? parseInt(baths, 10) : undefined;
            const pageSize = 10;
            const currentPage = parseInt(page || '1', 10) ;



            if (minimumPrice < 15000000) {
                minimumPrice = 15000000;
            }

            const data = await db.query.propertyTable.findMany({
                where: and(
                    minimumPrice ? gte(sql`CAST(${propertyTable.price} AS INTEGER)`, minimumPrice) : undefined,
                    // areas && areas.length > 0 ? arrayOverlaps(propertyTable.communityId, areas) : undefined,
                    maximumPrice ? lte(sql`CAST(${propertyTable.price} AS INTEGER)`, maximumPrice) : undefined,
                    bedrooms ? gte(propertyTable.bedrooms, bedrooms) : undefined,
                    bathrooms ? lte(propertyTable.bathrooms, bathrooms) : undefined,
                    offeringType ? eq(propertyTable.offeringTypeId, offeringType) : undefined,
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
                limit: pageSize,
                offset: currentPage * pageSize,
            });

            // Get total count of properties
            const totalCount = await db.select({count: sql<number>`count(*)`})
                .from(propertyTable)
                .where(and(
                    minimumPrice ? gte(sql`CAST(${propertyTable.price} AS INTEGER)`, minimumPrice) : undefined,
                    maximumPrice ? lte(sql`CAST(${propertyTable.price} AS INTEGER)`, maximumPrice) : undefined,
                    bedrooms ? gte(propertyTable.bedrooms, bedrooms) : undefined,
                    bathrooms ? lte(propertyTable.bathrooms, bathrooms) : undefined,
                    offeringType ? eq(propertyTable.offeringTypeId, offeringType) : undefined,
                ))
                .then(result => result[0].count);

            // Generate pages
            const totalPages = Math.ceil(totalCount / pageSize);
            const pages = Array.from({length: totalPages}, (_, i) => i + 1);

            // Return the properties data as a JSON response
            return c.json({
                data : {
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
        })


    /**
     * Handles GET requests to fetch properties based on various query parameters.
     *
     * @param {string} offeringTypeId - The ID of the offering type to filter properties.
     * @param {number} [limit=10] - The maximum number of properties to return.
     * @param {number} [offset] - The number of properties to skip before starting to collect the result set.
     * @param {string} [lo] - The location to filter properties.
     * @param {string} [miPrice] - The minimum price to filter properties.
     * @param {string} [mxPrice] - The maximum price to filter properties.
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
    .get("/:offeringTypeId",
        zValidator("param", z.object({
            offeringTypeId: z.string().optional()
        })),
        zValidator("query", z.object({
            limit: z.number().optional(),
            offset: z.number().optional(),
            lo: z.string().optional(),
            miPrice: z.string().optional(),
            mxPrice: z.string().optional(),
            bed: z.string().optional(),
            bath: z.string().optional(),
            miArea: z.string().optional(),
            mxArea: z.string().optional(),
            sortBy: z.string().optional(),
            sortOrder: z.string().optional(),
            typeSlug: z.string().optional(),
            page: z.string().optional(),
        })),
        async (c) => {
            const {offeringTypeId} = c.req.param();

            const {
                limit = 10,
                offset,
                miPrice,
                mxPrice,
                bed,
                bath,
                lo: location,
                miArea,
                mxArea,
                sortBy,
                typeSlug,
                page
            } = c.req.valid('query');

            const bedrooms = bed ? parseInt(bed, 10) : undefined;
            const bathrooms = bath ? parseInt(bath, 10) : undefined;
            const minPrice = miPrice ? parseInt(miPrice, 10) : undefined;
            const maxPrice = mxPrice ? parseInt(mxPrice, 10) : undefined;
            const minArea = miArea ? parseInt(miArea, 10) : undefined;
            const maxArea = mxArea ? parseInt(mxArea, 10) : undefined;

            // Retrieve unitType based on typeId. If typeId is not provided or no matching type is found, unitType will be undefined.
            const unitType = await db.query.propertyTypeTable.findFirst({
                where: typeSlug ? eq(propertyTypeTable.slug, typeSlug) : undefined,
            });

            // Construct the query for propertyTable, conditionally including the unitType filter if it exists.
            // Step 1: Fetch properties
            const data = await db.query.propertyTable.findMany({
                where: and(
                    eq(propertyTable.offeringTypeId, offeringTypeId),
                    location ? eq(propertyTable.communityId, location) : undefined,
                    minPrice ? gte(sql`CAST(${propertyTable.price} AS INTEGER)`, minPrice) : undefined,
                    minArea ? gte(propertyTable.size, minArea) : undefined,
                    maxPrice ? lte(sql`CAST(${propertyTable.price} AS INTEGER)`, maxPrice) : undefined,
                    bedrooms ? gte(propertyTable.bedrooms, bedrooms) : undefined,
                    bathrooms ? lte(propertyTable.bedrooms, bathrooms) : undefined,
                    maxArea ? lte(propertyTable.size, maxArea) : undefined,
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
                // if page is provided, offset is calculated based on the page number and limit
                //@ts-ignore
                offset: page ? (page - 1) * limit : offset
            });

            // Step 2: Get total count of properties matching the conditions
            const totalCount = await db.select({count: sql<number>`count(*)`})
                .from(propertyTable)
                .where(and(
                    eq(propertyTable.offeringTypeId, offeringTypeId),
                    location ? eq(propertyTable.communityId, location) : undefined,
                    minPrice ? gte(sql`CAST(${propertyTable.price} AS INTEGER)`, minPrice) : undefined,
                    minArea ? gte(propertyTable.size, minArea) : undefined,
                    maxPrice ? lte(sql`CAST(${propertyTable.price} AS INTEGER)`, maxPrice) : undefined,
                    bedrooms ? gte(propertyTable.bedrooms, bedrooms) : undefined,
                    bathrooms ? lte(propertyTable.bedrooms, bathrooms) : undefined,
                    maxArea ? lte(propertyTable.size, maxArea) : undefined,
                    unitType?.id ? eq(propertyTable.typeId, unitType.id) : undefined,
                ))
                .then(result => result[0].count);

            return c.json({
                data,
                totalCount,
                hasMore: data.length < totalCount,
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
        const data = await db.query.propertyTypeTable.findMany();

        // Return the property types data as a JSON response
        return c.json({data});
    })


export default app