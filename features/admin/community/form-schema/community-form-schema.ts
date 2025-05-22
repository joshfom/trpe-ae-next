import { z } from "zod";

export const CommunityFormSchema = z.object({
    name: z.string(),
    image: z.string(),
    about: z.string(),
    metaTitle: z.string(),
    metaDesc: z.string(),
})