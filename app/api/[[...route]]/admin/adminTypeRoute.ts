import {Hono} from "hono";
import {db} from "@/db/drizzle";

const app = new Hono()
    .get("/unit_type", async (c) => {
        const data = await db.query.unitTypeTable.findMany()

        return c.json({data})
    })

    .get("/offering_type", async (c) => {
        const data = await db.query.offeringTypeTable.findMany()

        return c.json({data})
    })


export default app