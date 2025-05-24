"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { addCity, AddCityResult, AddCitySuccessResult } from "@/actions/admin/add-city-action";

type ResponseType = InferResponseType<typeof client.api.admin.cities.$post>
type RequestType = InferRequestType<typeof client.api.admin.cities.$post>["json"]

export const useAddCity = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<ResponseType | null>(null);
    
    const mutate = async (cityData: RequestType, options?: { 
        onSuccess?: (data: ResponseType) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await addCity(cityData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add city");
            }
            
            // TypeScript now knows this is an AddCitySuccessResult
            const successResult = result as AddCitySuccessResult;
            setData(successResult.data);
            setIsSuccess(true);
            toast.success('City added successfully');
            
            if (options?.onSuccess) {
                options.onSuccess(successResult.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while adding city');
            
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
        error,
        data
    };
}
