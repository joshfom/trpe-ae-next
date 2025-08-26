"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createCommunityAction, CreateCommunityRequestData } from "@/actions/admin/create-community-action";

/**
 * React hook to create a community via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useCreateCommunity = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (communityData: CreateCommunityRequestData, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            setError(null);
            
            const result = await createCommunityAction(communityData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to create community");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Community created successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while creating community');
            
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
