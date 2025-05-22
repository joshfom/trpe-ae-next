import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {createId} from "@paralleldrive/cuid2";
import { amenityTable} from "@/db/schema/amenity-table";



const app = new Hono()
    .get("/", async (c) => {
        const data = await db.query.amenityTable.findMany()
        return c.json({data})
    })

    .post("/",
        zValidator("json", z.object({
            name: z.string(),
            icon: z.string(),
        })),
        async (c) => {
            // @ts-ignore
            // const user: User = c.get("user");
            //
            // if (!user) {
            //     return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            // }

            const {
                name,
                icon
            } = c.req.valid('json');


            const data = await db.insert(amenityTable).values({
                id: createId(),
                name,
                icon,
            })

            return c.json({data});

        })



    .post("/:amenityId",
        zValidator("param", z.object({
            amenityId: z.string().optional()
        })),
        zValidator("json", z.object({
            name: z.string(),
            icon: z.string(),
        })),
        async (c) => {
            // @ts-ignore
            // const user: User = c.get("user");
            //
            // if (!user) {
            //     return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            // }

            const {
                icon,
                name
            } = c.req.valid('json');

            const {amenityId} = c.req.param();

            // const data = await db.update(amenityTable).set({
            //     icon,
            //     name
            // }).where(eq(agentTable.id, amenityTable))

            // return c.json({data});
        })


export default app