'use client';

import { useState } from "react";
import { updateCity, UpdateCityResult } from "@/actions/admin/update-city-action";
import { toast } from "sonner";
import { z } from "zod";
import { AdminCityFormSchema } from "@/lib/types/form-schema/admin-city-form-schema";

type RequestType = z.infer<typeof AdminCityFormSchema>;

/**
 * Client hook to update a city via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useUpdateCity = (cityId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (data: RequestType, options?: { onSuccess?: () => void }) => {
    setIsLoading(true);
    
    try {
      const result = await updateCity(cityId || "", data);
      
      if (result.success === false) {
        throw new Error(result.error || "Failed to update city");
      }
      
      toast.success("City updated successfully");
      setError(null);
      
      if (options?.onSuccess) {
        options.onSuccess();
      }
      
      return result.data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
      toast.error("An error occurred while updating city");
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    mutateAsync: mutate,  // For compatibility with React Query API
    isLoading,
    error,
    isError: !!error,
    reset: () => setError(null)
  };
};
