import {z} from "zod";

export const OffplanFormSchema = z.object({
    name: z.string(),
    about: z.string(),
    communityId: z.string(),
    fromPrice: z.number().nullable(),
    toPrice: z.number().nullable(),
    paymentTitle: z.string().nullable(),
    toSize: z.number().nullable(),
    developerId: z.string(),
    longitude: z.string(),
    latitude: z.string(),
    floors: z.number().nullable().optional(),
    permitNumber: z.string(),
    fromSize: z.number().nullable(),
    completionStatus: z.string().optional(),
    serviceCharge: z.number().nullable()
})
