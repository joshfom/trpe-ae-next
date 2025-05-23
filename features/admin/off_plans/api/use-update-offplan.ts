"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { updateOffplan } from "@/actions/admin/update-offplan-action";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["update"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["update"]["$patch"]>["json"]

/**
 * React hook to update an offplan via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useUpdateOffplan = (offplanId?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (offplanData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        if (!offplanId) {
            const errorObj = new Error("Offplan ID is required");
            setError(errorObj);
            setIsError(true);
            toast.error('Offplan ID is required');
            
            if (options?.onError) {
                options.onError(errorObj);
            }
            return;
        }
        
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await updateOffplan(offplanId, offplanData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update offplan");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Offplan updated successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while updating offplan');
            
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