import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {and, eq} from "drizzle-orm";
import {User} from "@/lib/auth";
import {OffplanFormSchema} from "@/lib/types/form-schema/offplan-form-schema";
import {offplanTable} from "@/db/schema/offplan-table";
import {createId} from "@paralleldrive/cuid2";
import {developerTable} from "@/db/schema/developer-table";
import slugify from "slugify";
import {faqTable} from "@/db/schema/faq-table";
import {offplanImagesTable} from "@/db/schema/offplan-images-table";
import {HTTPException} from "hono/http-exception";

const app = new Hono()
    .get("/", async (c) => {
        const data = await db.query.communityTable.findMany()

        return c.json({data})
    })

    .get("/:target/list/:targetId",
        zValidator("param", z.object({
            targetId: z.string(),
            target: z.string()
        })),
        async (c) => {

            const {targetId, target} = c.req.param();

            const data = await db.query.faqTable.findMany({
                where: and(
                    eq(faqTable.targetId, targetId),
                    eq(faqTable.targetModel, target)
                )
            })

            return c.json({data});
        }
    )


    .post("/:target/faqs/:targetId/new",
        zValidator("param", z.object({
            target: z.string(),
            targetId: z.string(),
        })),

        zValidator("json", z.object({
            question: z.string(),
            answer: z.string()
        })),
        async (c) => {

            const user: User = (c.get as any)("user");

            if (!user) {
                return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            }

            const {targetId, target} = c.req.param();



            const {question, answer} = c.req.valid('json');

            const [data] = await db.insert(faqTable).values({
                id: createId(),
                targetId: targetId,
                targetModel: target,
                question,
                answer
            }).returning()


            return c.json({data});
        }
    )


    .patch("/faqs/:faqId/update",
        zValidator("param", z.object({
            faqId: z.string()
        })),
        async (c) => {

            const { faqId} = c.req.param();

            const data = await db.query.faqTable.findMany({
                where: eq(faqTable.targetId, faqId)
            })

            return c.json({data});
        }
    )


    .delete("/faqs/:faqId/destroy",
        zValidator("param", z.object({
            faqId: z.string()
        })),
        async (c) => {

            const { faqId} = c.req.param();

            const data = await db.query.faqTable.findMany({
                where: eq(faqTable.id, faqId)
            })

            if (!data) {
                throw new HTTPException(404, {message: "FAQ not found"})
            }

            await db.delete(faqTable).where(eq(faqTable.id, faqId))


            return c.json({data});
        }
    )



export default app