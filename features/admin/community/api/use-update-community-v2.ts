"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateCommunityAction, UpdateCommunityRequestData } from "@/actions/admin/update-community-action-v2";

/**
 * React hook to update a community via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useUpdateCommunityV2 = (communityId: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (communityData: UpdateCommunityRequestData, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            setError(null);
            
            const result = await updateCommunityAction(communityId, communityData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update community");
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
};
