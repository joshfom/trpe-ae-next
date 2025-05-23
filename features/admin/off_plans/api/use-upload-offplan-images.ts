"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { uploadOffplanImages } from "@/actions/admin/upload-offplan-images-action";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["gallery"]["upload"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["gallery"]["upload"]["$post"]>["json"]

/**
 * React hook to upload offplan images via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useUploadOffplanImages = (offplanId: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (json: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await uploadOffplanImages(offplanId, json);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to upload images");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Images uploaded successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while adding images');
            
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