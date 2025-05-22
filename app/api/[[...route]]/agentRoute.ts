import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {asc, eq} from "drizzle-orm";
import {employeeCreateSchema, employeeTable} from "@/db/schema/employee-table";

const app = new Hono()

    .get("/", async (c) => {
        const data = await db.query.employeeTable.findMany({
            where: eq(employeeTable.isVisible, true),
            orderBy: [asc(employeeTable.order)]
        })

        return c.json({data})
    })


    .post("/:agentId",
        zValidator("param", z.object({
            agentId: z.string().optional()
        })),
        zValidator("json", employeeCreateSchema.omit({
            id: true,
            slug: true
        })),
        async (c) => {

            const values = c.req.valid('json');

            const {agentId} = c.req.param();

            const data = await db.update(employeeTable).set({
                ...values
            }).where(eq(employeeTable.id, agentId))

            return c.json({data});

        })


export default app