import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {desc, eq, isNull, sql} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";
import {createId} from "@paralleldrive/cuid2";
import slugify from "slugify";
import {addSubCommunityFormSchema} from "@/lib/types/form-schema/add-sub-community-form-schema";
import {subCommunityTable} from "@/db/schema/sub-community-table";
import {HTTPException} from "hono/http-exception";
import {CommunityFormSchema} from "@/features/admin/community/form-schema/community-form-schema";

const app = new Hono()

    .get("/sub_communities",
        async (c) => {

            const data = await db.select().from(subCommunityTable).where(isNull(subCommunityTable.communityId))


            return c.json({data})
        })


    .get("/",
        async (c) => {

            const data = await db.query.communityTable.findMany({
                orderBy: [desc(communityTable.updatedAt)],
            })

            return c.json({data})
        })



    /**
     * Get community details endpoint
     *
     * Retrieves detailed information for a specific community by its ID.
     *
     * @route GET /api/communities/:communityId
     *
     * @param {object} params - URL parameters
     * @param {string} [params.communityId] - The ID of the community to retrieve
     *
     * @returns {object} Response
     * @returns {object} Response.data - The community data if found
     * @returns {null} Response.data - null if no community found
     *
     * @example
     * // Request
     * GET /api/communities/123
     *
     * // Success Response
     * {
     *   "data": {
     *     "id": "123",
     *     "name": "Example Community",
     *     "about": "About text...",
     *     "image": "image-url",
     *     "metaTitle": "Meta title",
     *     "metaDesc": "Meta description",
     *     "createdAt": "2024-01-28T...",
     *     "updatedAt": "2024-01-28T..."
     *   }
     * }
     *
     * @throws {HTTPException}
     * - 404: When community is not found
     * - 400: When communityId is invalid (handled by zValidator)
     */
    .get("/:communityId",
        zValidator("param", z.object({
            communityId: z.string().optional()
        })),
        async (c) => {
            try {
                const {communityId} = c.req.valid('param');

                if (!communityId) {
                    return c.json({
                        error: "Community ID is required"
                    }, 400)
                }

                const data = await db.query.communityTable.findFirst({
                    where: eq(communityTable.id, communityId)
                })

                if (!data) {
                    return c.json({
                        error: "Community not found"
                    }, 404)
                }

                return c.json({
                    data,
                    message: "Community retrieved successfully"
                })

            } catch (error) {
                console.error('Error fetching community:', error)

                if (error instanceof HTTPException) {
                    throw error
                }

                throw new HTTPException(500, {
                    message: "An error occurred while fetching community",
                    cause: error
                })
            }
        })




    /**
     * Update community endpoint
     *
     * Updates a community's information and returns the updated data.
     * Validates both the community ID and the update data using Zod schemas.
     *
     * @route PATCH /api/admin/communities/:communityId
     * @param {string} communityId - The ID of the community to update
     * @body {object} updateData - The data to update the community with
     * @returns {object} Updated community data
     *
     * @throws {HTTPException}
     * - 404: Community not found
     * - 500: Server error during update
     * - 400: Invalid input data (handled by zValidator)
     */

    .patch("/:communityId",
        zValidator("param", z.object({
            communityId: z.string().min(1, "Community ID is required")
        })),
        zValidator("json", CommunityFormSchema, (result, c) => {
            console.log('=== API VALIDATION DEBUG ===');
            console.log('Raw request body:', JSON.stringify(c.req.raw, null, 2));
            
            // Try to get the raw JSON from request
            const requestClone = c.req.raw.clone();
            requestClone.json().then(rawJson => {
                console.log('Raw JSON received:', JSON.stringify(rawJson, null, 2));
                console.log('Raw JSON name field:', rawJson?.name);
                console.log('Raw JSON name type:', typeof rawJson?.name);
                console.log('Raw JSON name length:', rawJson?.name?.length);
            }).catch(e => console.log('Could not parse raw JSON:', e));
            
            console.log('Validation result success:', result.success);
            if (!result.success) {
                console.error('API Validation error for community update:', result.error.flatten());
                console.error('Validation error details:', JSON.stringify(result.error.issues, null, 2));
                console.log('=== END API DEBUG ===');
                return c.json({
                    error: "Validation failed",
                    details: result.error.flatten()
                }, 400);
            }
            console.log('Validation successful, data:', JSON.stringify(result.data, null, 2));
            console.log('=== END API DEBUG ===');
        }),
        async (c) => {
            try {
                // Validate and extract request data
                const {communityId} = c.req.valid('param');
                const validatedData = c.req.valid('json');
                const {name, about, image, metaTitle, metaDesc, featured, displayOrder, isLuxe} = validatedData;

                console.log('Update community request:', {
                    communityId,
                    data: validatedData
                });

                if (!communityId) {
                    return c.json({
                        error: "Community ID is required"
                    }, 400)
                }

                // Check if community exists
                const community = await db.query.communityTable.findFirst({
                    where: eq(communityTable.id, communityId!)
                })

                if (!community) {
                    return c.json({
                            error: "Community not found"
                        },
                        404
                    )
                }

                // Update community data
                const [updatedCommunity] = await db.update(communityTable)
                    .set({
                        name,
                        about: about || null,
                        image: image || null,
                        metaTitle: metaTitle || null,
                        metaDesc: metaDesc || null,
                        featured,
                        displayOrder,
                        isLuxe,
                        updatedAt: sql`now()`
                    })
                    .where(eq(communityTable.id, communityId!))
                    .returning()

                return c.json({
                    data: updatedCommunity,
                    message: "Community updated successfully"
                })

            } catch (error) {
                console.error('Error updating community:', error)

                // Preserve original error if it's already an HTTPException
                if (error instanceof HTTPException) {
                    throw error
                }

                // Convert other errors to HTTPException
                throw new HTTPException(500, {
                    message: "An error occurred while updating community",
                    cause: error
                })
            }
        })


    .get("/:communityId/sub_communities",
        zValidator("param", z.object({
            communityId: z.string().optional()
        })),
        async (c) => {

            const {communityId} = c.req.param();

            const data = await db.query.subCommunityTable.findMany({
                where: eq(subCommunityTable.communityId, communityId)
            })

            return c.json({data})
        })


    .post("/",
        zValidator("json", CommunityFormSchema),
        async (c) => {
            const {
                name,
                about,
                image,
                metaTitle,
                metaDesc
            } = c.req.valid('json');

            const data = await db.insert(communityTable).values({
                id: createId(),
                name,
                about,
                slug: slugify(name),
                image,
                metaTitle,
                metaDesc
            })

            return c.json({data});
        })


    .post("/:communityId",
        zValidator("param", z.object({
            communityId: z.string().optional()
        })),
        zValidator("json", addSubCommunityFormSchema),
        async (c) => {

            const {
                name,
            } = c.req.valid('json');

            const {communityId} = c.req.param();

            //create sub community
            const [data] = await db.insert(subCommunityTable).values({
                id: createId(),
                name,
                slug: slugify(name),
                communityId
            }).returning()


            return c.json({data});

        })


    .post("/:communityId/sub_communities/attach",
        zValidator("param", z.object({
            communityId: z.string().optional(),
        })),
        zValidator("json", z.object({
            subCommunityId: z.string()
        })),
        async (c) => {


            const {communityId} = c.req.param();


            const {subCommunityId} = c.req.valid('json');


            const subCommunity = await db.query.subCommunityTable.findFirst({
                where: eq(subCommunityTable.id, subCommunityId)
            })


            //update sub community
            const data = await db.update(subCommunityTable).set({
                communityId: communityId
            }).where(eq(subCommunityTable.id, subCommunityId)).returning()

            console.log('data', data)

            return c.json({data});

        })


export default app