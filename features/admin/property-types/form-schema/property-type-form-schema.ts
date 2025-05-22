import {z} from "zod";

export const PropertyTypeFormSchema = z.object({
    name: z.string().optional(),
    short_name: z.string().optional(),
    slug: z.string().optional(),
    rentH1: z.string().optional(),
    saleH1: z.string().optional(),
    rentMetaTitle: z.string().optional(),
    rentMetaDescription: z.string().optional(),
    saleMetaTitle: z.string().optional(),
    saleMetaDescription: z.string().optional(),
    saleContent: z.any().optional(),
    rentContent: z.any().optional()
});

export type PropertyTypeFormValues = z.infer<typeof PropertyTypeFormSchema>;
