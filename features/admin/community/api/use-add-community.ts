"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { addCommunity } from "@/actions/admin/add-community-action";

type ResponseType = InferResponseType<typeof client.api.admin.communities.$post>
type RequestType = InferRequestType<typeof client.api.admin.communities.$post>["json"]

/**
 * React hook to add a community via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useAddCommunity = (agentId?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (communityData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await addCommunity(communityData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add community");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Community updated successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while updating community');
            
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