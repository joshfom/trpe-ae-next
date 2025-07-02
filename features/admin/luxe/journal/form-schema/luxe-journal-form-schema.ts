import {z} from "zod";

export const luxeJournalFormSchema = z.object({
    title: z.string().min(10, 'Title is too short').max(120, 'Title is too long'),
    metaDescription: z.string().optional(),
    metaTitle: z.string().optional(),
    publishedAt: z.string().optional().refine((val) => val === undefined || !isNaN(Date.parse(val)), {
        message: "Pick a valid date",
    }),
    authorId: z.string().optional(),
    content: z.string().min(400, 'Content is too short').max(100000, 'Content is too long'),
    coverUrl: z.string().optional(),
    altText: z.string().optional(),
    isLuxe: z.boolean().default(true), // Always true for luxe journal
});

export type LuxeJournalFormType = z.infer<typeof luxeJournalFormSchema>;
