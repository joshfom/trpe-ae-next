"use client";

import { InferResponseType, InferRequestType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { updateOfferingType } from "@/actions/admin/update-offering-type-action";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin["offering-types"][":offeringTypeId"]["update"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.admin["offering-types"][":offeringTypeId"]["update"]["$patch"]>["json"];

/**
 * Custom hook for updating an offering type via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 *
 * @param offeringTypeId - The ID of the offering type to update
 */
export const useUpdateOfferingType = (offeringTypeId?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (json: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            if (!offeringTypeId) {
                throw new Error('Offering Type ID is required');
            }
            
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await updateOfferingType(offeringTypeId, json);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update offering type");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Offering type updated successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error(errorObj.message || 'An error occurred while updating offering type');
            
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
};