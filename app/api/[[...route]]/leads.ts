import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {createId} from "@paralleldrive/cuid2";
import { leadTable} from "@/db/schema/lead-table";
import {z} from "zod";

const app = new Hono()

    .post("/contact",
        zValidator("json", z.object({
            firstName: z.string(),
            message: z.string().optional(),
            phone: z.string(),
            email: z.string(),
            requestType: z.string().optional(),
        })),
        async (c) => {
            const {
                firstName,
                message,
                phone,
                email,
                requestType,
            } = c.req.valid('json');



            const [data] = await db.insert(leadTable).values({
                id: createId(),
                firstName,
                message,
                phone,
                email,
                source: 'TRPE.ae Website',
            }).returning();



            return c.json({ data });
        })



.post("/callback",
    zValidator("json", z.object({
        firstName: z.string(),
        phone: z.string(),
        timeToCall: z.string(),
        })),
    async (c) => {
        const {
            firstName,
            phone,
        } = c.req.valid('json');



        const [data] = await db.insert(leadTable).values({
            id: createId(),
            firstName,
            phone,
            source: 'TRPE.ae Website - call back request',
        }).returning();



        return c.json({ data });
    });


export default app;