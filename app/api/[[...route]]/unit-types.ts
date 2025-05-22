import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {propertyTypeTable} from "@/db/schema/property-type-table";

const app = new Hono()

    .get("/", async (c) => {
        const data = await db.query.propertyTypeTable.findMany();
        return c.json({data});
    })


.get("/:slug",
    zValidator('param', z.object({
        slug: z.string().optional()
    }))
    , async (c) => {

    const { slug } = c.req.param();

    const unitType = await db.query.propertyTypeTable.findFirst({
        where: eq(propertyTypeTable.slug, slug)
    });
    return c.json({unitType});
})

export default app