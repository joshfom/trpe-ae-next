"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { addOffplanFaq } from "@/actions/admin/add-offplan-faq-action";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["faqs"]["new"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["faqs"]["new"]["$post"]>["json"]

/**
 * React hook to add an offplan FAQ via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useAddOffplanFaq = (offplanId: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (faqData: RequestType, options?: { 
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
            
            const result = await addOffplanFaq(offplanId, faqData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add FAQ");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('FAQ added successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while adding FAQ');
            
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