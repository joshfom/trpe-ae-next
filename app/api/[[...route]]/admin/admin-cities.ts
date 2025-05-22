import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {createId} from "@paralleldrive/cuid2";
import {employeeCreateSchema, employeeTable} from "@/db/schema/employee-table";
import {AdminCityFormSchema} from "@/lib/types/form-schema/admin-city-form-schema";
import slugify from "slugify";
import {cityTable} from "@/db/schema/city-table";

const app = new Hono()
    .get("/", async (c) => {
        const data = await db.query.cityTable.findMany()
        return c.json({data})
    })

    .post("/",
        zValidator("json", AdminCityFormSchema),
        async (c) => {

            const {
                name
            } = c.req.valid('json');

            const slug = slugify(name);


            const data = await db.insert(cityTable).values({
                id: createId(),
                slug,
                name
            })


            return c.json({data});

        })



export default app