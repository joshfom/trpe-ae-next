import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {createId} from "@paralleldrive/cuid2";
import slugify from "slugify";
import {DeveloperFormSchema} from "@/features/admin/developers/schema/developer-form-schema";
import {developerTable} from "@/db/schema/developer-table";
import {User} from "lucia";
import {HTTPException} from "hono/http-exception";

const app = new Hono()

    .get("/", async (c) => {
        const data = await db.query.developerTable.findMany()

        return c.json({data})
    })



    .post("/",
        zValidator("json", DeveloperFormSchema),
        async (c) => {


            // const user: User = (c.get as any)("user");
            //
            // if (!user) {
            //     return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            // }

            const {
                name,
                about,
                logoUrl,
                short_name
            } = c.req.valid('json');


            const slug = slugify(name, {
                lower: true,
                strict: true
            });

            let data

            try {
                [data] = await db.insert(developerTable).values({
                    id: createId(),
                    name,
                    about,
                    logoUrl,
                    short_name,
                    slug
                }).returning();
            } catch (e) {
                console.log('server error', e)
                //return honor http exception
                throw new HTTPException(500, { message: "Server error"});
            }

            return c.json({data});
        })



    .patch("/:developerId",
        zValidator("param", z.object({
            developerId: z.string().optional()
        })),
        zValidator("json", DeveloperFormSchema),
        async (c) => {

            const user: User = (c.get as any)("user");

            if (!user) {
                return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            }

            const {
                name,
                about,
                logoUrl,
                short_name,
                website,
                order
            } = c.req.valid('json');

            const {developerId} = c.req.param();

            const data = await db.update(developerTable).set({
                name,
                about,
                logoUrl,
                short_name,
                website,
                order
            }).where(eq(developerTable.id, developerId))

            return c.json({data});
        })



    .delete("/:developerId/delete",
        zValidator("param", z.object({
            developerId: z.string().optional()
        })),
        zValidator("json", DeveloperFormSchema),
        async (c) => {

            const user: User = (c.get as any)("user");

            if (!user) {
                return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            }

            const {
                name,
                about,
                logoUrl,
                short_name,
                website,
            } = c.req.valid('json');

            const {developerId} = c.req.param();

            const data = await db.update(developerTable).set({
                name,
                about,
                logoUrl,
                short_name,
                website,
            }).where(eq(developerTable.id, developerId))

            return c.json({data});
        })



export default app