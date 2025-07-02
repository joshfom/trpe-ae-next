import { z } from "zod";

export const CommunityFormSchema = z.object({
    name: z.string(),
    image: z.string(),
    about: z.string(),
    metaTitle: z.string(),
    metaDesc: z.string(),
    featured: z.boolean().default(false),
    displayOrder: z.number().default(0),
    isLuxe: z.boolean().default(false),
})

export type CommunityFormType = z.infer<typeof CommunityFormSchema>;