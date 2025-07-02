import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {desc, eq, sql} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";
import {HTTPException} from "hono/http-exception";
import {LuxeCommunityFormSchema} from "@/features/admin/luxe/community/form-schema/luxe-community-form-schema";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()

    // Get only communities where isLuxe is true
    .get("/",
        async (c) => {
            try {
                const data = await db.select()
                    .from(communityTable)
                    .where(eq(communityTable.isLuxe, true))
                    .orderBy(desc(communityTable.updatedAt));

                return c.json({data});
            } catch (error) {
                console.error('Error fetching luxe communities:', error);
                throw new HTTPException(500, {
                    message: "An error occurred while fetching luxe communities",
                    cause: error
                });
            }
        })

    // Get community by ID (can be used for luxe community editing)
    .get("/:communityId",
        zValidator("param", z.object({
            communityId: z.string().min(1, "Community ID is required")
        })),
        async (c) => {
            try {
                const {communityId} = c.req.valid('param');

                const data = await db.select()
                    .from(communityTable)
                    .where(eq(communityTable.id, communityId))
                    .limit(1);

                if (!data.length) {
                    return c.json({
                        error: "Community not found"
                    }, 404);
                }

                return c.json({
                    data: data[0],
                    message: "Community retrieved successfully"
                });

            } catch (error) {
                console.error('Error fetching community:', error);
                throw new HTTPException(500, {
                    message: "An error occurred while fetching community",
                    cause: error
                });
            }
        })

    // Update community luxe fields
    .patch("/:communityId",
        zValidator("param", z.object({
            communityId: z.string().min(1, "Community ID is required")
        })),
        zValidator("json", LuxeCommunityFormSchema),
        async (c) => {
            try {
                const {communityId} = c.req.valid('param');
                const {
                    isLuxe,
                    luxeMetaTitle,
                    luxeTitle,
                    luxeDescription,
                    luxeImageUrl,
                    luxeHeroImageUrl,
                    luxeFeatured,
                    luxeDisplayOrder
                } = c.req.valid('json');

                // Check if community exists
                const community = await db.query.communityTable.findFirst({
                    where: eq(communityTable.id, communityId)
                });

                if (!community) {
                    return c.json({
                        error: "Community not found"
                    }, 404);
                }

                // Update community luxe fields
                const [updatedCommunity] = await db.update(communityTable)
                    .set({
                        isLuxe,
                        luxeMetaTitle,
                        luxeName: luxeTitle, // Map luxeTitle to luxeName
                        luxeAbout: luxeDescription, // Map luxeDescription to luxeAbout
                        luxeImageUrl,
                        luxeHeroImageUrl,
                        luxeFeatured,
                        luxeDisplayOrder,
                        updatedAt: sql`now()`
                    })
                    .where(eq(communityTable.id, communityId))
                    .returning();

                return c.json({
                    data: updatedCommunity,
                    message: "Community luxe content updated successfully"
                });

            } catch (error) {
                console.error('Error updating community luxe content:', error);
                if (error instanceof HTTPException) {
                    throw error;
                }
                throw new HTTPException(500, {
                    message: "An error occurred while updating community luxe content",
                    cause: error
                });
            }
        })

    // Create new luxe community
    .post("/",
        zValidator("json", LuxeCommunityFormSchema),
        async (c) => {
            try {
                const validatedData = c.req.valid('json');

                // Create new community with luxe fields
                const [newCommunity] = await db.insert(communityTable)
                    .values({
                        id: createId(),
                        name: validatedData.luxeTitle,
                        slug: validatedData.luxeTitle?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '',
                        isLuxe: validatedData.isLuxe || true,
                        luxeMetaTitle: validatedData.luxeMetaTitle,
                        luxeName: validatedData.luxeTitle,
                        luxeAbout: validatedData.luxeDescription,
                        luxeImageUrl: validatedData.luxeImageUrl,
                        luxeHeroImageUrl: validatedData.luxeHeroImageUrl,
                        luxeFeatured: validatedData.luxeFeatured,
                        luxeDisplayOrder: validatedData.luxeDisplayOrder,
                        createdAt: sql`now()`,
                        updatedAt: sql`now()`
                    })
                    .returning();

                return c.json({
                    data: newCommunity,
                    message: "Luxe community created successfully"
                });

            } catch (error) {
                console.error('Error creating luxe community:', error);
                if (error instanceof HTTPException) {
                    throw error;
                }
                throw new HTTPException(500, {
                    message: "An error occurred while creating luxe community",
                    cause: error
                });
            }
        });

export default app;
