import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {desc, eq, isNotNull, sql} from "drizzle-orm";
import {insightTable} from "@/db/schema/insight-table";

/**
 * The `app` instance of the Hono application, handling various GET requests for insights.
 * 
 * Routes:
 * - `GET /`: Fetches paginated insights, ordered by creation date.
 * - `GET /:insightSlug`: Fetches a specific insight by its slug.
 * - `GET /similar/:insightId`: Fetches the three most recent insights.
 * 
 * Middleware:
 * - `zValidator`: Validates request parameters and query strings using zod schemas.
 * 
 * Handlers:
 * - `GET /`: Handles fetching paginated insights with metadata.
 * - `GET /:insightSlug`: Handles fetching a specific insight by its slug.
 * - `GET /similar/:insightId`: Handles fetching the three most recent insights.
 */
const app = new Hono()

    /**
     * Handles GET requests to fetch paginated insights, ordered by creation date.
     * 
     * @param {string} page - The page number for pagination
     * @returns {Promise<Response>} - A JSON response containing paginated insights and metadata
     */
    .get("/",
        zValidator("query", z.object({
            page: z.string().optional(),
        })),
        async (c) => {
            const { page = "1" } = c.req.valid('query');
            
            const pageSize = 9;
            const currentPage = parseInt(page, 10);
            const offset = (currentPage - 1) * pageSize;
            
            // Query the database to find insights for the current page
            const data = await db.query.insightTable.findMany({
                where: isNotNull(insightTable.publishedAt),
                orderBy: [desc(insightTable.publishedAt)],
                limit: pageSize,
                offset: offset
            });
            
            // Get total count of insights
            const totalCount = await db.select({ count: sql<number>`count(*)` })
                .from(insightTable)
                .where(isNotNull(insightTable.publishedAt))
                .then(result => result[0].count);
                
            // Calculate total pages
            const totalPages = Math.ceil(totalCount / pageSize);
            
            return c.json({
                properties: data,
                pages: Array.from({length: totalPages}, (_, i) => i + 1),
                totalCount,
                metaLinks: {
                    currentPage,
                    totalPages,
                    hasNext: currentPage < totalPages,
                    hasPrev: currentPage > 1,
                }
            });
        })

    /**
     * Handles GET requests to fetch a specific insight by its slug.
     *
     * @param {string} insightSlug - The slug of the insight to fetch.
     * @returns {Promise<Response>} - A JSON response containing the insight data.
     */
    .get("/:insightSlug",
        // Validate the request parameter using zod schema
        zValidator("param", z.object({
            insightSlug: z.string().optional()
        })),
        async (c) => {
            // Extract the insightSlug parameter from the request
            const {insightSlug} = c.req.param();

            // Query the database to find the first insight matching the provided slug
            const data = await db.query.insightTable.findFirst({
                where: eq(insightTable.slug, insightSlug)
            });

            // Return the insight data as a JSON response
            return c.json({data});
        })

    /**
     * Handles GET requests to fetch the three most recent insights.
     *
     * @returns {Promise<Response>} - A JSON response containing the three most recent insights.
     */
    .get("/similar/:insightId",
        // Validate the request parameter using zod schema
        zValidator("param", z.object({
            insightId: z.string().optional()
        })),
        async (c) => {
        // Query the database to find the three most recent insights
        const data = await db.query.insightTable.findMany({
            orderBy: [desc(insightTable.createdAt)],
            limit: 3
        });

        // Return the insights data as a JSON response
        return c.json({data});
    })

export default app