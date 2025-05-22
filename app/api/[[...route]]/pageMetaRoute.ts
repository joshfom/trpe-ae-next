import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {HTTPException} from "hono/http-exception";

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
    );

export default app;
