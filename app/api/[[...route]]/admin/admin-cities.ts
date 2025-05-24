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

    .patch("/:cityId",
        zValidator("param", z.object({
            cityId: z.string()
        })),
        zValidator("json", AdminCityFormSchema),
        async (c) => {
            const { cityId } = c.req.param();
            const { name } = c.req.valid('json');
            
            const city = await db.query.cityTable.findFirst({
                where: eq(cityTable.id, cityId)
            });
            
            if (!city) {
                return c.json({ error: "City not found" }, 404);
            }
            
            // Generate a new slug only if the name has changed
            const slug = name !== city.name ? slugify(name) : city.slug;
            
            await db.update(cityTable)
                .set({ name, slug })
                .where(eq(cityTable.id, cityId));
                
            const updatedCity = await db.query.cityTable.findFirst({
                where: eq(cityTable.id, cityId)
            });
            
            return c.json({ data: updatedCity });
        })
        
    .delete("/:cityId",
        zValidator("param", z.object({
            cityId: z.string()
        })),
        async (c) => {
            const { cityId } = c.req.param();
            
            const city = await db.query.cityTable.findFirst({
                where: eq(cityTable.id, cityId)
            });
            
            if (!city) {
                return c.json({ error: "City not found" }, 404);
            }
            
            await db.delete(cityTable)
                .where(eq(cityTable.id, cityId));
                
            return c.json({ success: true });
        })



export default app