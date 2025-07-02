import { z } from "zod";

export const LuxeCommunityFormSchema = z.object({
    isLuxe: z.boolean().default(false),
    luxeMetaTitle: z.string().optional(),
    luxeTitle: z.string().optional(), // This maps to luxeName in the database
    luxeDescription: z.string().optional(), // This maps to luxeAbout in the database
    luxeImageUrl: z.string().optional(),
    luxeHeroImageUrl: z.string().optional(),
    luxeFeatured: z.boolean().default(false),
    luxeDisplayOrder: z.number().default(0),
});

export type LuxeCommunityFormType = z.infer<typeof LuxeCommunityFormSchema>;
