import {z} from "zod";

export const PageMetaFormSchema = z.object({
    metaTitle: z.string().min(1, {message: "Meta title is required"}).max(100, {message: "Meta title must be less than 100 characters"}),
    metaDescription: z.string().min(1, {message: "Meta description is required"}).max(300, {message: "Meta description must be less than 300 characters"}),
    title: z.string().min(1, {message: "Title is required"}).max(100, {message: "Title must be less than 100 characters"}),
    metaKeywords: z.string().optional(),
    includeInSitemap: z.boolean().optional(),
    noIndex: z.boolean().optional(),
    noFollow: z.boolean().optional(),
    content: z.string().optional(),
    path: z.string().min(1, {message: "Path is required"}).refine((value) => /^\/[a-z0-9\-\/]*$/.test(value), {
        message: "Path must be a valid URL path (start with / and contain only lowercase letters, numbers, hyphens, and slashes)"
    }),
});