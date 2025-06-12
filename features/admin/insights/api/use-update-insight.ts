"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { updateInsight } from "@/actions/admin/update-insight-action";

type ResponseType = InferResponseType<typeof client.api.admin.insights[":insightSlug"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.admin.insights[":insightSlug"]["$patch"]>["json"]

/**
 * React hook to update an insight via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useUpdateInsight = (insightSlug?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (insightData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }): Promise<void> => {
        if (!insightSlug) {
            const errorObj = new Error("Insight slug is required");
            setError(errorObj);
            setIsError(true);
            toast.error('Insight slug is required');
            
            if (options?.onError) {
                options.onError(errorObj);
            }
            return;
        }
        
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await updateInsight(insightSlug, insightData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update insight");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Insight updated successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            console.log('error updating', err);
            toast.error('An error occurred while updating Insight');
            
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