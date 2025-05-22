import {z} from "zod";

export const AdminCityFormSchema = z.object({
    name: z.string({message: "City name is required"}),
})
