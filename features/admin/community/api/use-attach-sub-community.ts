"use client";

import { InferResponseType, InferRequestType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { attachSubCommunity } from "@/actions/admin/attach-sub-community-action";

type ResponseType = InferResponseType<typeof client.api.admin.communities[":communityId"]["sub_communities"]["attach"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.communities[":communityId"]["sub_communities"]["attach"]["$post"]>["json"]

/**
 * React hook to attach a sub-community via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useAttachSubCommunity = (communityId: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (subCommunityData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await attachSubCommunity(communityId, subCommunityData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to attach sub-community");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Sub community attached successfully');
            
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