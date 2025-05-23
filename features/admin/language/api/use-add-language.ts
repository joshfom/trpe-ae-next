"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { addLanguage } from "@/actions/admin/add-language-action";

type ResponseType = InferResponseType<typeof client.api.admin.languages.$post>
type RequestType = InferRequestType<typeof client.api.admin.languages.$post>["json"]

/**
 * React hook to add a language via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useAddLanguage = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (languageData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await addLanguage(languageData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add language");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Language added successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while adding language');
            
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