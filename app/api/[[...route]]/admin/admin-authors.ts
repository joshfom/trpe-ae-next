import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {createId} from "@paralleldrive/cuid2";
import {HTTPException} from "hono/http-exception";
import {User} from "lucia";
import {authorFormSchema} from "@/features/admin/author/schema/author-form-schema";
import {authorTable} from "@/db/schema/author-table";

const app = new Hono()

    .get("/", async (c) => {
        const data = await db.query.authorTable.findMany()

        return c.json({data})
    })


    .post("/",
        zValidator("json", authorFormSchema),
        async (c) => {

            const user: User = (c.get as any)("user");

            if (!user) {
                throw new HTTPException(401, {message: 'Please log in or your session to access resource.'});
            }

            const {
                name,
                about,
                avatar
            } = c.req.valid('json');


            const data = await db.insert(authorTable).values({
                id: createId(),
                name,
                about,
                avatar
            })

            return c.json({data});
        })


    .patch("/:authorId",

        zValidator("param", z.object({
            authorId: z.string().optional()
        })),

        zValidator("json", authorFormSchema),
        async (c) => {

            const user: User = (c.get as any)("user");

            if (!user) {
                throw new HTTPException(401, {message: 'Please log in or your session to access resource.'});
            }

            const {
                name,
                about,
                avatar
            } = c.req.valid('json');

            const {authorId} = c.req.param();

            const author = await db.query.authorTable.findFirst({
                where: eq(authorTable.id, authorId)
            })

            if (!author) {
                throw new HTTPException(404, {message: 'Author not found.'});
            }

            let newAvatar = author.avatar;

            if (avatar && avatar !== author.avatar) {
                newAvatar = avatar;
            }

            let data = null;

            try {
                await db.update(authorTable).set({
                    name,
                    avatar: newAvatar,
                    about,

                }).where(eq(authorTable.id, authorId))
            } catch (e) {
                console.log('Error updating insight:', e);
                throw new HTTPException(500, {message: 'An error occurred while updating insight.'});
            }

            return c.json({data});
        })


export default app