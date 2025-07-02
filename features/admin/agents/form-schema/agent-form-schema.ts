import { z } from "zod";

export const AgentFormSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address").or(z.literal('')).optional(),
    phone: z.string().optional(),
    title: z.string().optional(),
    bio: z.string().optional(),
    rera: z.string().optional(),
    avatarUrl: z.string().optional(),
    isVisible: z.boolean().default(false),
    isLuxe: z.boolean().default(false),
    order: z.number().default(100),
});

export type AgentFormType = z.infer<typeof AgentFormSchema>;
