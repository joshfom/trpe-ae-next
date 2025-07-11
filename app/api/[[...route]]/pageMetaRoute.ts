import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {HTTPException} from "hono/http-exception";
import {User} from "@/lib/auth";
import {PageMetaFormSchema} from "@/lib/types/form-schema/page-meta-form-schema";
import {createId} from "@paralleldrive/cuid2";

// Authentication middleware for write operations
const requireAuth = async (c: any, next: any) => {
    const user: User = (c.get as any)("user");

    if (!user) {
        return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
    }

    return next();
};

const app = new Hono()
    .get("/", async (c) => {
        const data = await db.query.pageMetaTable.findMany({
            orderBy: (pageMetaTable, {desc}) => [desc(pageMetaTable.createdAt)]
        });

        return c.json({data});
    })

    .get("/:path*", 
        async (c) => {
            let path = '/' + c.req.param('path');
            
            // Handle root path
            if (path === '//') {
                path = '/';
            }

            const data = await db.query.pageMetaTable.findFirst({
                where: eq(pageMetaTable.path, path)
            });

            if (!data) {
                return c.json({data: null});
            }

            return c.json({data});
        }
    )

    // Protected routes - require authentication
    .post("/new",
        requireAuth,
        zValidator("json", PageMetaFormSchema),
        async (c) => {
            const {
                metaTitle,
                metaDescription,
                noIndex,
                noFollow,
                title,
                content,
                path,
                metaKeywords,
                includeInSitemap
            } = c.req.valid('json');

            // Check if path already exists
            const existingPath = await db.query.pageMetaTable.findFirst({
                where: eq(pageMetaTable.path, path)
            });

            if (existingPath) {
                return c.json({error: "Path already exists"}, 400);
            }

            const [data] = await db.insert(pageMetaTable).values({
                id: createId(),
                metaTitle,
                metaDescription,
                noIndex,
                noFollow,
                metaKeywords,
                includeInSitemap,
                title,
                content,
                path
            }).returning();

            return c.json({data});
        })

    .patch("/:id",
        requireAuth,
        zValidator("param", z.object({
            id: z.string()
        })),
        zValidator("json", PageMetaFormSchema),
        async (c) => {
            const {id} = c.req.param();

            const pageMeta = await db.query.pageMetaTable.findFirst({
                where: eq(pageMetaTable.id, id)
            });

            if (!pageMeta) {
                throw new HTTPException(404, {message: "Page meta not found"});
            }

            const {
                metaTitle,
                metaDescription,
                title,
                content,
                path,
                noIndex,
                noFollow,
                metaKeywords,
                includeInSitemap
            } = c.req.valid('json');

            // Check if path already exists and belongs to another page
            const existingPath = await db.query.pageMetaTable.findFirst({
                where: eq(pageMetaTable.path, path)
            });

            if (existingPath && existingPath.id !== id) {
                return c.json({error: "Path already exists for another page"}, 400);
            }

            const [data] = await db.update(pageMetaTable).set({
                metaTitle,
                metaDescription,
                title,
                content,
                path,
                noIndex,
                noFollow,
                metaKeywords,
                includeInSitemap,
                updatedAt: new Date().toISOString()
            }).where(eq(pageMetaTable.id, id)).returning();

            return c.json({data});
        })

    .delete("/:id",
        requireAuth,
        zValidator("param", z.object({
            id: z.string()
        })),
        async (c) => {
            const {id} = c.req.param();

            const pageMeta = await db.query.pageMetaTable.findFirst({
                where: eq(pageMetaTable.id, id)
            });

            if (!pageMeta) {
                throw new HTTPException(404, {message: "Page meta not found"});
            }

            await db.delete(pageMetaTable).where(eq(pageMetaTable.id, id));

            return c.json({message: "Page meta deleted successfully"});
        });

export default app;
