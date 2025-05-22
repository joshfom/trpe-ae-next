import { z } from "zod";

export const OfferingTypeFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    slug: z.string().optional(),
    metaTitle: z.string().optional(),
    pageTitle: z.string().optional(),
    about: z.any().optional(),
    metaDesc: z.string().optional(),
});