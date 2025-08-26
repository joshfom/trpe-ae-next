import { z } from "zod";

export const CommunityFormSchema = z.object({
    name: z.string().min(1, "Community name is required"),
    image: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
    about: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val), 
    metaTitle: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
    metaDesc: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
    featured: z.boolean().default(false),
    displayOrder: z.number().default(0),
    isLuxe: z.boolean().default(false),
})

export type CommunityFormType = z.infer<typeof CommunityFormSchema>;