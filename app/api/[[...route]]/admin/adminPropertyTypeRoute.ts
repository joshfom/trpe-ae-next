import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq, sql} from "drizzle-orm";
import {HTTPException} from "hono/http-exception";
import {PropertyTypeFormSchema} from "@/features/admin/property-types/form-schema/property-type-form-schema";
import {propertyTypeTable} from "@/db/schema/property-type-table";

const app = new Hono()

    .get("/",
        async (c) => {
            const data = await db.query.propertyTypeTable.findMany()
            return c.json({data})
        })

    /**
     * Get property type details endpoint
     *
     * Retrieves detailed information for a specific property type by its ID.
     *
     * @route GET /api/admin/property-types/:propertyTypeId
     *
     * @param {object} params - URL parameters
     * @param {string} [params.propertyTypeId] - The ID of the property type to retrieve
     *
     * @returns {object} Response
     * @returns {object} Response.data - The property type data if found
     * @returns {null} Response.data - null if no property type found
     *
     * @throws {HTTPException}
     * - 404: When property type is not found
     * - 400: When propertyTypeId is invalid
     */
    .get("/:propertyTypeId",
        zValidator("param", z.object({
            propertyTypeId: z.string().optional()
        })),
        async (c) => {
            try {
                const {propertyTypeId} = c.req.valid('param');

                if (!propertyTypeId) {
                    return c.json({
                        error: "Property Type Id is required"
                    }, 400)
                }

                const data = await db.query.propertyTypeTable.findFirst({
                    where: eq(propertyTypeTable.id, propertyTypeId)
                })

                if (!data) {
                    return c.json({
                        error: "Property Type not found"
                    }, 404)
                }

                return c.json({
                    data,
                    message: "Property Type retrieved successfully"
                })

            } catch (error) {
                console.error('Error fetching property type:', error)

                if (error instanceof HTTPException) {
                    throw error
                }

                throw new HTTPException(500, {
                    message: "An error occurred while fetching property type",
                    cause: error
                })
            }
        })

    /**
     * Update property type endpoint
     *
     * Updates a property type's information and returns the updated data.
     * Validates both the property type ID and the update data using Zod schemas.
     *
     * @route PATCH /api/admin/property-types/:propertyTypeId
     * @param {string} propertyTypeId - The ID of the property type to update
     * @body {object} updateData - The data to update the property type with
     * @returns {object} Updated property type data
     *
     * @throws {HTTPException}
     * - 404: Property Type not found
     * - 500: Server error during update
     * - 400: Invalid input data (handled by zValidator)
     */
    .patch("/:propertyTypeId",
        zValidator("param", z.object({
            propertyTypeId: z.string().optional()
        })),
        zValidator("json", PropertyTypeFormSchema),
        async (c) => {
            try {
                // Validate and extract request data
                const {propertyTypeId} = c.req.valid('param');
                const {
                    name,
                    short_name,
                    slug,
                    rentH1,
                    saleH1,
                    rentMetaTitle,
                    rentMetaDescription,
                    saleMetaTitle,
                    saleMetaDescription,
                    saleContent,
                    rentContent
                } = c.req.valid('json');

                if (!propertyTypeId) {
                    return c.json({
                        error: "Property Type Id is required"
                    }, 400)
                }



                // Check if property type exists
                const propertyType = await db.query.propertyTypeTable.findFirst({
                    where: eq(propertyTypeTable.id, propertyTypeId!)
                })

                if (!propertyType) {
                    return c.json({
                            error: "Property Type not found"
                        },
                        404
                    )
                }

                // Update property type data
                const [updatedPropertyType] = await db.update(propertyTypeTable)
                    .set({
                        name,
                        short_name,
                        rentH1,
                        saleH1,
                        slug,
                        rentMetaTitle,
                        rentMetaDescription,
                        saleMetaTitle,
                        saleMetaDescription,
                        saleContent,
                        rentContent,
                        updatedAt: sql`now()`
                    })
                    .where(eq(propertyTypeTable.id, propertyTypeId!))
                    .returning()

                return c.json({
                    data: updatedPropertyType,
                    message: "Property Type updated successfully"
                })

            } catch (error) {
                console.error('Error updating property type:', error)

                if (error instanceof HTTPException) {
                    throw error
                }

                throw new HTTPException(500, {
                    message: "An error occurred while updating property type",
                    cause: error
                })
            }
        })

export default app
