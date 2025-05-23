"use client";

import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {toast} from "sonner";
import { useState } from "react";
import { addAmenityAction, AddAmenityRequestData } from "@/actions/admin/add-amenity-action";

type ResponseType = InferResponseType<typeof client.api.admin.amenities.$post>
type RequestType = InferRequestType<typeof client.api.admin.amenities.$post>["json"]

/**
 * React hook to add a new amenity via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useAddAmenity = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (amenityData: AddAmenityRequestData, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await addAmenityAction(amenityData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add amenity");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Amenity added successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while adding amenity');
            
            if (options?.onError) {
                options.onError(errorObj);
            }
        } finally {
            setIsPending(false);
        }
    };
    
    return {
        mutate,
        isLoading: isPending,
        isPending,
        isSuccess,
        isError,
        error,
        data
    };
}