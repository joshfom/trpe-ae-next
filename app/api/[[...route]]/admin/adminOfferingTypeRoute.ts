import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq, sql} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";
import {HTTPException} from "hono/http-exception";
import {CommunityFormSchema} from "@/features/admin/community/form-schema/community-form-schema";
import {OfferingTypeFormSchema} from "@/features/admin/offering/form-schema/offering-type-form-schema";
import {offeringTypeTable} from "@/db/schema/offering-type-table";

const app = new Hono()



    .get("/",
        async (c) => {

        console.log('get offering type')

            const data = await db.query.offeringTypeTable.findMany()

            return c.json({data})
        })



    /**
     * Get community details endpoint
     *
     * Retrieves detailed information for a specific community by its ID.
     *
     * @route GET /api/communities/:offeringTypeId
     *
     * @param {object} params - URL parameters
     * @param {string} [params.offeringTypeId] - The ID of the community to retrieve
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
     * - 400: When offeringTypeId is invalid (handled by zValidator)
     */
    .get("/:offeringTypeId",
        zValidator("param", z.object({
            offeringTypeId: z.string().optional()
        })),
        async (c) => {
            try {
                const {offeringTypeId} = c.req.valid('param');

                if (!offeringTypeId) {
                    return c.json({
                        error: "Offering Type Id is required"
                    }, 400)
                }

                const data = await db.query.communityTable.findFirst({
                    where: eq(communityTable.id, offeringTypeId)
                })

                if (!data) {
                    return c.json({
                        error: "Offering Type not found"
                    }, 404)
                }

                return c.json({
                    data,
                    message: "Offering Type retrieved successfully"
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
     * @route PATCH /api/admin/communities/:offeringTypeId
     * @param {string} offeringTypeId - The ID of the community to update
     * @body {object} updateData - The data to update the community with
     * @returns {object} Updated community data
     *
     * @throws {HTTPException}
     * - 404: Offering Type not found
     * - 500: Server error during update
     * - 400: Invalid input data (handled by zValidator)
     */

    .patch("/:offeringTypeId/update",
        zValidator("param", z.object({
            offeringTypeId: z.string().min(1, "Offering Type Id is required")
        })),
        zValidator("json", OfferingTypeFormSchema),
        async (c) => {
            try {
                // Validate and extract request data
                const {offeringTypeId} = c.req.valid('param');
                const {
                    name,
                    about,
                    pageTitle,
                    metaTitle,
                    metaDesc
                } = c.req.valid('json');

                if (!offeringTypeId) {
                    return c.json({
                        error: "Offering Type Id is required"
                    }, 400)
                }

                console.log('about offering type', about)
                // Check if offeringType exists
                const offeringType = await db.query.offeringTypeTable.findFirst({
                    where: eq(offeringTypeTable.id, offeringTypeId!)
                })

                if (!offeringType) {
                    return c.json({
                            error: "Offering Type not found"
                        },
                        404
                    )
                }

                // Update offeringType data
                const [updatedOfferingType] = await db.update(offeringTypeTable)
                    .set({
                        name,
                        about,
                        pageTitle,
                        metaTitle,
                        metaDesc,
                        updatedAt: sql`now()`
                    })
                    .where(eq(offeringTypeTable.id, offeringTypeId!))
                    .returning()

                return c.json({
                    data: updatedOfferingType,
                    message: "Offering Type updated successfully"
                })

            } catch (error) {
                console.error('Error updating offering type:', error)

                // Preserve original error if it's already an HTTPException
                if (error instanceof HTTPException) {
                    throw error
                }

                // Convert other errors to HTTPException
                throw new HTTPException(500, {
                    message: "An error occurred while updating offering type",
                    cause: error
                })
            }
        })


    .post("/:offeringTypeId",
        zValidator("param", z.object({
            offeringTypeId: z.string().optional()
        })),
        zValidator("json", OfferingTypeFormSchema),
        async (c) => {

            const {
                name,
               about,
                metaTitle,
                metaDesc
            } = c.req.valid('json');

            const {offeringTypeId} = c.req.param();

            //update offering type
            const data = await db.update(offeringTypeTable).set({
                name,
                about,
                metaTitle,
                metaDesc,
            }).where(eq(offeringTypeTable.id, offeringTypeId)).returning()


            return c.json({data});

        })



export default app