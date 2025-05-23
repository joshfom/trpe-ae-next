"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { addInsight } from "@/actions/admin/add-insight-action";

type ResponseType = InferResponseType<typeof client.api.admin.insights.$post>
type RequestType = InferRequestType<typeof client.api.admin.insights.$post>["json"]

/**
 * React hook to add an insight via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useAddInsight = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (insightData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await addInsight(insightData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add insight");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Insight added successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
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