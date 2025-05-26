import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {count, desc, eq, sql} from "drizzle-orm";
import {createId} from "@paralleldrive/cuid2";
import {insightTable} from "@/db/schema/insight-table";
import {employeeTable} from "@/db/schema/employee-table";
import slugify from "slugify";
import {HTTPException} from "hono/http-exception";
import {User} from "@/lib/auth";
import {insightFormSchema} from "@/app/crm/schema/insight-form-schema";
import {revalidatePath} from "next/cache";
import { 
    processInsightImage, 
    updateInsightImage,
    ImageProcessingError, 
    ImageFetchError 
} from "@/lib/insights-image-utils";
import { s3Service } from "@/lib/s3Service";

const app = new Hono()
   .get("/", async (c) => {
        const search = c.req.query('search');
        const page = parseInt(c.req.query('page') || '1');
        const limit = parseInt(c.req.query('limit') || '9');
        const offset = (page - 1) * limit;

        let query = db.select().from(insightTable).orderBy(desc(insightTable.createdAt));
        let countQuery = db.select({ value: count() }).from(insightTable);

        if (search) {
            console.log('search:', search);
            const searchCondition = sql`to_tsvector('english', ${insightTable.title}) @@ plainto_tsquery('english', ${search})`;

            //@ts-ignore
            query = query.where(searchCondition);
            //@ts-ignore
            countQuery = countQuery.where(searchCondition);
        }

        // Apply pagination
        //@ts-ignore
        query = query.limit(limit).offset(offset);

        try {
            const [data, totalResult] = await Promise.all([
                query,
                countQuery
            ]);

            const totalCount = totalResult[0]?.value || 0;
            const totalPages = Math.ceil(totalCount / limit);

            return c.json({
                data,
                page,
                limit,
                totalCount,
                totalPages
            });
        } catch (e) {
            console.error('Error fetching insights:', e);
            throw new HTTPException(500, {message: 'An error occurred while fetching insights.'});
        }
    })

    .post("/",
        zValidator("json", insightFormSchema),
        async (c) => {

            const user: User = (c.get as any)("user");

            if (!user) {
                throw new HTTPException(401, {message: 'Please log in or your session to access resource.'});
            }

            const {
                title,
                metaTitle,
                metaDescription,
                publishedAt,
                authorId,
                altText,
                coverUrl,
                content,
            } = c.req.valid('json');

            if (!title || !coverUrl || !content) {
                throw new HTTPException(401, {message: 'Please provide all required fields.'});
            }

            const slug = slugify(title, {
                lower: true,
                strict: true
            });

            let data = null;

           try {
               // Process the cover image to ensure it's WebP format
               const processedCoverUrl = await processInsightImage(coverUrl, { quality: 80 });
               
               data = await db.insert(insightTable).values({
                   id: createId(),
                   slug,
                   title,
                   metaTitle,
                   authorId,
                   publishedAt,
                   metaDescription,
                   altText,
                   coverUrl: processedCoverUrl, // Use the processed WebP image URL
                   content,
               }).returning();
              } catch (e) {
                console.error('Error creating insight:', e);
                
                // Check if it's a specific image processing error
                if (e instanceof ImageProcessingError || e instanceof ImageFetchError) {
                    throw new HTTPException(400, {
                        message: `Image processing failed: ${e.message}` 
                    });
                }
                
                throw new HTTPException(500, {message: 'An error occurred while creating insight.'});
           }
            return c.json({data});
        })


    .patch("/:insightSlug",

        zValidator("param", z.object({
            insightSlug: z.string().optional()
        })),

        zValidator("json", insightFormSchema),
        async (c) => {

            const user: User = (c.get as any)("user");

            if (!user) {
                throw new HTTPException(401, {message: 'Please log in or your session to access resource.'});
            }

            const {
                title,
                coverUrl,
                publishedAt,
                authorId,
                metaTitle,
                altText,
                metaDescription,
                content,
            } = c.req.valid('json');

            const {insightSlug} = c.req.param();

            const insight = await db.query.insightTable.findFirst({
                where: eq(insightTable.slug, insightSlug)
            })

            if (!insight) {
                throw new HTTPException(404, {message: 'Insight not found.'});
            }

            let newCoverUrl = insight.coverUrl;

            try {
                // Process the cover image if it has changed
                if (coverUrl && coverUrl !== insight.coverUrl) {
                    newCoverUrl = await updateInsightImage(coverUrl, insight.coverUrl, {
                        shouldDeleteOld: true,
                        webpOptions: { quality: 80 }
                    });
                }

                const updatedInsight = await db.update(insightTable).set({
                    title,
                    coverUrl: newCoverUrl,
                    altText,
                    content,
                    authorId,
                    publishedAt,
                    metaTitle,
                    metaDescription,
                }).where(eq(insightTable.slug, insightSlug)).returning();


                // Add revalidation here
                revalidatePath(`/insights/${insightSlug}`);
                revalidatePath('/insights'); // If you have a list page that needs updating too

                return c.json({ data: updatedInsight });

            } catch (e) {
                console.error('Error updating insight:', e);
                
                // Check if it's a specific image processing error
                if (e instanceof ImageProcessingError || e instanceof ImageFetchError) {
                    throw new HTTPException(400, {
                        message: `Image processing failed: ${e.message}` 
                    });
                }
                
                throw new HTTPException(500, {message: 'An error occurred while updating insight.'});
            }
        })
    
    .delete("/:insightSlug",
        zValidator("param", z.object({
            insightSlug: z.string().optional()
        })),
        async (c) => {
            const user: User = (c.get as any)("user");

            if (!user) {
                throw new HTTPException(401, {message: 'Please log in to access this resource.'});
            }

            const { insightSlug } = c.req.param();

            if (!insightSlug) {
                throw new HTTPException(400, {message: 'Insight slug is required.'});
            }

            // First, check if the insight exists
            const insight = await db.query.insightTable.findFirst({
                where: eq(insightTable.slug, insightSlug)
            });

            if (!insight) {
                throw new HTTPException(404, {message: 'Insight not found.'});
            }

            try {
                // First try to delete the image from S3 if it exists
                if (insight.coverUrl) {
                    try {
                        await s3Service.deleteFile(insight.coverUrl);
                    } catch (imageError) {
                        // Log but continue with insight deletion
                        console.error('Error deleting insight cover image:', imageError);
                    }
                }
                
                // Delete the insight
                await db.delete(insightTable).where(eq(insightTable.slug, insightSlug));
                
                // Revalidate paths
                revalidatePath(`/insights/${insightSlug}`);
                revalidatePath('/insights');
                
                return c.json({ success: true, message: 'Insight deleted successfully.' });
            } catch (error) {
                console.error('Error deleting insight:', error);
                
                // If the error is related to S3 deletion, we might want to handle it differently
                if (error && typeof error === 'object' && 'name' in error && 
                    error.name === 'S3ServiceError' && 'message' in error) {
                    throw new HTTPException(400, {
                        message: `Error with image deletion: ${error.message}`
                    });
                }
                
                throw new HTTPException(500, {
                    message: 'An error occurred while deleting the insight.'
                });
            }
        })


export default app