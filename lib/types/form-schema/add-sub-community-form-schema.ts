import {z} from "zod";

export const addSubCommunityFormSchema = z.object({
    name: z.string(),
})
