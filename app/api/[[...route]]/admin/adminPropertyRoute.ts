import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {communityCreateSchema, communityTable} from "@/db/schema/community-table";
import {PropertyFormSchema} from "@/lib/types/form-schema/property-form-schema";

const app = new Hono()
    .get("/", async (c) => {
        const data = await db.query.communityTable.findMany()

        return c.json({data})
    })

    .post("/",
        zValidator("json", PropertyFormSchema),
        async (c) => {
            // @ts-ignore
            // const user: User = c.get("user");
            //
            // if (!user) {
            //     return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            // }

            const values = c.req.valid('json');
            let data

            return c.json({data});

        })


export default app