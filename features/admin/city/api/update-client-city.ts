"use client";

import { updateCity, UpdateCityResult } from "@/actions/admin/update-city-action";
import { z } from "zod";
import { AdminCityFormSchema } from "@/lib/types/form-schema/admin-city-form-schema";

type RequestType = z.infer<typeof AdminCityFormSchema>;

/**
 * Client-side wrapper for the updateCity server action
 */
export const updateClientCity = async (cityId: string, data: RequestType): Promise<UpdateCityResult> => {
  return updateCity(cityId, data);
};
