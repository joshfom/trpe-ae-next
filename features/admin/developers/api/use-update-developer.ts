"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { updateDeveloper } from "@/actions/admin/update-developer-action";

type ResponseType = InferResponseType<typeof client.api.admin.developers[":developerId"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin.developers[":developerId"]["$patch"]>["json"]

/**
 * React hook to update a developer via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useUpdateDeveloper = (developerId?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (developerData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        if (!developerId) {
            const errorObj = new Error("Developer ID is required");
            setError(errorObj);
            setIsError(true);
            toast.error('Developer ID is required');
            
            if (options?.onError) {
                options.onError(errorObj);
            }
            return;
        }
        
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await updateDeveloper(developerId, developerData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update developer");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Developer updated successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while updating developer');
            
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