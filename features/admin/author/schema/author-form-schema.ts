import { z } from "zod";

export const authorFormSchema = z.object({
    name: z.string().min(3, 'Name is too short').max(100, 'Name is too long'),
    about: z.string().min(10, 'About is too short').max(500, 'About is too long'),
    avatar: z.string().optional(),
});