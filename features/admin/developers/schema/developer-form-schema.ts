import {z} from "zod";

export const DeveloperFormSchema = z.object({
    name: z.string(),
    about: z.string(),
    logoUrl: z.string(),
    short_name: z.string().optional(),
    website: z.string().optional(),
    order: z.number().optional(),
})
