"use client";

import { InferResponseType, InferRequestType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useState } from "react";
import { updateCommunity } from "@/actions/admin/update-community-action";

/**
 * Type definitions for API response and request
 */
type ResponseType = InferResponseType<typeof client.api.admin.communities[":communityId"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.admin.communities[":communityId"]["$patch"]>["json"];

/**
 * Custom hook for updating a community
 *
 * This hook handles:
 * 1. Community data update through server action
 * 2. Loading, success, and error states
 * 3. Success/error notifications
 *
 * @param communityId - The ID of the community to update
 * @returns Object with mutation function and states
 *
 * @example
 * ```tsx
 * const UpdateCommunity = () => {
 *   const { mutate, isPending } = useUpdateCommunity('123')
 *
 *   const handleSubmit = (formData: RequestType) => {
 *     mutate(formData)
 *   }
 *
 *   return <form onSubmit={handleSubmit}>...</form>
 * }
 * ```
 */
export const useUpdateCommunity = (communityId?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<ResponseType | null>(null);

    const mutate = async (formData: RequestType, options?: { 
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
            
            const result = await updateCommunity(communityId, formData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update community");
            }
            
            setData(result.data);
            setIsSuccess(true);
            toast.success("Community updated successfully");
            
            if (options?.onSuccess) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error(errorObj.message || "An error occurred while updating community");
            console.error("Update error:", err);
            
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
        isLoading: isPending, // For compatibility with React Query
        isSuccess,
        isError,
        error,
        data
    };
};