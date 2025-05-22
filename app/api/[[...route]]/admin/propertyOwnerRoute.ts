import {Hono} from "hono";
import {db} from "@/db/drizzle";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {eq} from "drizzle-orm";
import {createId} from "@paralleldrive/cuid2";
import {employeeCreateSchema, employeeTable} from "@/db/schema/employee-table";
import {PropertyOwnerFormSchema} from "@/lib/types/form-schema/property-owners-form-schema";
import {propertyOwnersTable} from "@/db/schema/property-owners-table";
import {User} from "lucia";

const app = new Hono()
    .get("/", async (c) => {
        const data = await db.query.propertyOwnersTable.findMany()
        return c.json({data})
    })

    .post("/bulk_create",
        zValidator("json", z.array(PropertyOwnerFormSchema)),
        async (c) => {

        const user: User = (c.get as any)("user");

            if (!user) {
                return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            }

            let data


            const values = c.req.valid('json');

            //for each value, create a new property owner
            for (let value of values) {
                if (value.phone) {
                    // format phone number
                    value.phone = value.phone.replace(/\D/g, "");
                    data = await db.insert(propertyOwnersTable).values({
                        name: value.name,
                        buildingName: value.building_name,
                        size: value.size,
                        unitNumber: value.unit_number,
                        phone: value.phone,
                        procedureNumber: value.procedure_number,
                        email: value.email,
                        masterProject: value.master_project,
                        residentCountry: value.resident_country,
                        nationality: value.nationality,
                        secondaryMobile: value.secondary_mobile,
                        secondaryPhone: value.secondary_phone,
                        areaOwned: value.area_owned,
                        plotNumber: value.plot_number,
                        totalArea: value.total_area,
                        usageType: value.usage_type,
                        project: value.project,
                        municipalityNumber: value.municipality_number,
                        commonArea: value.common_area,
                        parkingArea: value.parking_area,
                        balconyArea: value.balcony_area,
                        registrationNumber: value.registration_number,
                        roomType: value.room_type,
                        id: createId()
                    })
                }
            }


            return c.json({data});

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
            // @ts-ignore
            // const user: User = c.get("user");
            //
            // if (!user) {
            //     return c.json({Unauthorized: "Please log in or your session to access resource."}, 401);
            // }

            const values = c.req.valid('json');

            const {agentId} = c.req.param();

            const data = await db.update(employeeTable).set({
                ...values
            }).where(eq(employeeTable.id, agentId))

            return c.json({data});

        })


    .get("/assigned/:agentId/property_owners",
        zValidator("param", z.object({
            agentId: z.string().optional()
        })),
        async (c) => {

            const {agentId} = c.req.param();

            const data = await db.query.assignedOwnersTable.findMany({
                where: eq(employeeTable.id, agentId)
            })

            return c.json({data})
        })


export default app