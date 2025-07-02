"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateLuxeCommunity } from "@/actions/admin/luxe/update-luxe-community-action";
import { LuxeCommunityFormType } from "../form-schema/luxe-community-form-schema";

type ResponseType = { data: any };

/**
 * React hook to update luxe community data via server action
 */
export const useUpdateLuxeCommunity = (communityId?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<ResponseType | null>(null);

    const mutate = async (formData: LuxeCommunityFormType, options?: { 
        onSuccess?: (data: ResponseType) => void, 
        onError?: (error: Error) => void 
    }) => {
        if (!communityId) {
            const error = new Error("Community ID is required");
            setError(error);
            setIsError(true);
            toast.error(error.message);
            if (options?.onError) options.onError(error);
            return;
        }

        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            setError(null);
            
            const result = await updateLuxeCommunity(communityId, formData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update luxe community");
            }
            
            setData({ data: result.data });
            setIsSuccess(true);
            toast.success('Luxe community updated successfully');
            
            if (options?.onSuccess) options.onSuccess({ data: result.data });
            return result.data;
        } catch (err) {
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while updating luxe community');
            console.error("Update error:", err);
            
            if (options?.onError) options.onError(errorObj);
            throw errorObj;
        } finally {
            setIsPending(false);
        }
    };

    return {
        mutate,
        isPending,
        isLoading: isPending, // Alias for compatibility
        isSuccess,
        isError,
        error,
        data
    };
};
