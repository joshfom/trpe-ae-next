"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateClientCity } from "./update-client-city";
import { UpdateCityResult } from "@/actions/admin/update-city-action";
import { AdminCityFormSchema } from "@/lib/types/form-schema/admin-city-form-schema";
import { z } from "zod";

type RequestType = z.infer<typeof AdminCityFormSchema>;

export const useUpdateCity = (cityId?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const mutate = async (data: RequestType, options?: { 
        onSuccess?: () => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            if (!cityId) {
                throw new Error("City ID is required");
            }
            
            const result = await updateClientCity(cityId, data);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update city");
            }
            
            setIsSuccess(true);
            toast.success('City updated successfully');
            
            if (options?.onSuccess) {
                options.onSuccess();
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while updating city');
            
            if (options?.onError) {
                options.onError(errorObj);
            }
        } finally {
            setIsPending(false);
        }
    };
    
    return {
        mutate,
        isPending,
        isLoading: isPending,
        isSuccess,
        isError,
        error
    }
}