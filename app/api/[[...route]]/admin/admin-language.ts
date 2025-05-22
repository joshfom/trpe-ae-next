import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {createId} from "@paralleldrive/cuid2";
import {languageInsertSchema, languageTable} from "@/db/schema/language-table";

const app = new Hono()
    .get("/", async (c) => {
        const data = await db.query.languageTable.findMany()

        return c.json({data})
    })



    .post("/",
        zValidator("json", languageInsertSchema.omit({
            id: true,
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
                slug,
                icon
            } = c.req.valid('json');

            if (!name || !slug) {
                return c.json({error: "Title, Cover URL and Content are required."}, 400);
            }


            const data = await db.insert(languageTable).values({
                id: createId(),
                slug,
                name,
                icon,
            })

            return c.json({data});
        })



    .post("/:languageId",
        zValidator("param", z.object({
            languageId: z.string().optional()
        })),
        zValidator("json", languageInsertSchema.omit({
            id: true,
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
                icon,
                slug
            } = c.req.valid('json');

            const {languageId} = c.req.param();

            const data = await db.update(languageTable).set({
                slug,
                name,
                icon
            }).where(eq(languageTable.id, languageId))

            return c.json({data});
        })


export default app