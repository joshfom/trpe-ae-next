import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {User} from "lucia";
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

    .post("/new",
        zValidator("json", OffplanFormSchema),
        async (c) => {

            const user: User = (c.get as any)("user");

            if (!user) {
                return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            }

            const {
                name,
                about,
                floors,
                toSize,
                fromPrice,
                fromSize,
                toPrice,
                developerId,
                serviceCharge,
                paymentTitle,
                communityId,
                longitude,
                latitude,
                permitNumber
            } = c.req.valid('json');

            const developer = await db.query.developerTable.findFirst({
                where:
                    eq(developerTable.id, developerId)
            })


            let slug = slugify(name, {
                lower: true,
                strict: true
            });


            //if developer add by - developer name as prefix to slug

            if (developer) {
                slug = `${slug}-by-${slugify(developer.name!, {
                    lower: true,
                    strict: true
                })}`
            }

            const [data] = await db.insert(offplanTable).values({
                id: createId(),
                slug,
                name,
                about,
                floors,
                paymentTitle,
                // serviceCharge : serviceCharge ? Math.floor(Number(serviceCharge) * 100) : null, // multiply by 100 to make it a whole number
                toSize: toSize ? Math.floor(Number(toSize) * 100) : null, // multiply by 100 to make it a whole number
                fromPrice,
                fromSize: fromSize ? Math.floor(Number(fromSize) * 100) : null, // multiply by 100 to make it a whole number
                toPrice,
                developerId,
                communityId,
                permitNumber
            }).returning()

            return c.json({data});

        })


    //Update offplan
    .patch("/:offplanId/update",
        zValidator("param", z.object({
            offplanId: z.string().optional()
        })),
        zValidator("json", OffplanFormSchema),
        async (c) => {

            const user: User = (c.get as any)("user");

            if (!user) {
                return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            }

            const {offplanId} = c.req.param();

            const offplan = await db.query.offplanTable.findFirst({
                where: eq(offplanTable.id, offplanId)
            })

            if (!offplan) {
                throw new HTTPException(404, {message: "Offplan not found"});
            }

            const {
                name,
                about,
                floors,
                toSize,
                fromPrice,
                fromSize,
                toPrice,
                developerId,
                serviceCharge,
                paymentTitle,
                communityId,
                longitude,
                latitude,
                permitNumber
            } = c.req.valid('json');

            const developer = await db.query.developerTable.findFirst({
                where:
                    eq(developerTable.id, developerId)
            })


            const [data] = await db.update(offplanTable).set({
                name,
                about,
                floors,
                paymentTitle,
                // serviceCharge : serviceCharge ? Math.floor(Number(serviceCharge) * 100) : null, // multiply by 100 to make it a whole number
                toSize: toSize ? Math.floor(Number(toSize) * 100) : null, // multiply by 100 to make it a whole number
                fromPrice,
                fromSize: fromSize ? Math.floor(Number(fromSize) * 100) : null, // multiply by 100 to make it a whole number
                toPrice,
                developerId,
                communityId,
                permitNumber
            }).where(eq(offplanTable.id, offplanId)).returning()

            return c.json({data});
        })

    .get("/:offplanId/faqs",
        zValidator("param", z.object({
            offplanId: z.string()
        })),
        async (c) => {

            const {offplanId} = c.req.param();

            const data = await db.query.faqTable.findMany({
                where: eq(faqTable.targetId, offplanId)
            })

            return c.json({data});
        }
    )


    .post("/:offplanId/faqs/new",
        zValidator("param", z.object({
            offplanId: z.string()
        })),
        zValidator("json", z.object({
            question: z.string(),
            answer: z.string()
        })),
        async (c) => {


            //check if user is logged in

            const user: User = (c.get as any)("user");

            if (!user) {
                return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            }

            const {offplanId} = c.req.param();

            //get offplan
            const offplan = await db.query.offplanTable.findFirst({
                where: eq(offplanTable.id, offplanId)
            })

            if (!offplan) {
                return c.json({error: "Offplan not found"}, 404);
            }

            const {question, answer} = c.req.valid('json');

            const [data] = await db.insert(faqTable).values({
                id: createId(),
                targetId: offplanId,
                targetModel: "offplan",
                question,
                answer
            }).returning()


            return c.json({data});
        }
    )


    .patch("/:offplanId/faqs/:faqId/update",
        zValidator("param", z.object({
            offplanId: z.string(),
            faqId: z.string()
        })),
        async (c) => {

            const {offplanId, faqId} = c.req.param();

            const data = await db.query.faqTable.findMany({
                where: eq(faqTable.targetId, offplanId)
            })

            return c.json({data});
        }
    )


    .delete("/:offplanId/faqs/:faqId/destroy",
        zValidator("param", z.object({
            offplanId: z.string(),
            faqId: z.string()
        })),
        async (c) => {

            const {offplanId, faqId} = c.req.param();

            const data = await db.query.faqTable.findMany({
                where: eq(faqTable.targetId, offplanId)
            })

            return c.json({data});
        }
    )


    //get offplan gallery
    .get("/:offplanId/gallery",
        zValidator("param", z.object({
            offplanId: z.string()
        })),
        async (c) => {

            const {offplanId} = c.req.param();

            const data = await db.query.offplanImagesTable.findMany({
                where: eq(offplanImagesTable.offplanId, offplanId)
            })

            return c.json({data});
        }
    )


    //add image to offplan gallery
    .post("/:offplanId/gallery/upload",
        zValidator("param", z.object({
            offplanId: z.string()
        })),
        zValidator("json", z.object({
            images: z.array(z.string())
        })),
        async (c) => {

            const {offplanId} = c.req.param();

            const {images} = c.req.valid('json');

            // loop through images and add to offplan gallery
            for (const [index, image] of images.entries()) {
                await db.insert(offplanImagesTable).values({
                    id: createId(),
                    offplanId,
                    url: image,
                    order: index
                }).returning()
            }


            return c.json({message: "Images added to gallery"});
        }
    )


    //delete image from offplan gallery
    .delete("/:offplanId/gallery/:imageId/destroy",
        zValidator("param", z.object({
            offplanId: z.string(),
            imageId: z.string()
        })),
        async (c) => {

            const {offplanId, imageId} = c.req.param();

            const data = await db.query.offplanImagesTable.findMany({
                where: eq(offplanImagesTable.offplanId, offplanId)
            })

            return c.json({data});
        }
    )


    //add brochure to offplan
    .post("/:offplanId/brochure/new",
        zValidator("param", z.object({
            offplanId: z.string()
        })),
        async (c) => {

            const {offplanId} = c.req.param();

            const data = await db.query.offplanImagesTable.findMany({
                where: eq(offplanImagesTable.offplanId, offplanId)
            })

            return c.json({data});
        }
    )


    //delete brochure from offplan
    .delete("/:offplanId/brochure/destroy",
        zValidator("param", z.object({
            offplanId: z.string()
        })),
        async (c) => {

            const {offplanId} = c.req.param();

            const data = await db.query.offplanImagesTable.findMany({
                where: eq(offplanImagesTable.offplanId, offplanId)
            })

            return c.json({data});
        }
    )


    //get offplan payment plans
    .get("/:offplanId/payment_plan",
        zValidator("param", z.object({
            offplanId: z.string()
        })),
        async (c) => {

            const {offplanId} = c.req.param();

            const data = await db.query.offplanImagesTable.findMany({
                where: eq(offplanImagesTable.offplanId, offplanId)
            })

            return c.json({data});
        }
    )


export default app