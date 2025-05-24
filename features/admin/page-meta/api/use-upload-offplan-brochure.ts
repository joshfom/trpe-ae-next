"use client";

import { useState } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { uploadOffplanBrochure } from "@/actions/admin/upload-offplan-brochure-action";

type ResponseType = InferResponseType<typeof client.api.admin.offplans[":offplanId"]["gallery"]["upload"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.offplans[":offplanId"]["gallery"]["upload"]["$post"]>["json"]

/**
 * Custom hook for uploading brochures to an offplan
 * This hook mimics the React Query useMutation API to maintain compatibility
 * @param offplanId The ID of the offplan project
 */
export const useUploadOffplanBrochure = (offplanId: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<ResponseType | null>(null);

    const mutate = async (brochureData: RequestType, options?: {
        onSuccess?: (data: ResponseType) => void,
        onError?: (error: Error) => void
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await uploadOffplanBrochure(offplanId, brochureData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to upload brochure");
            }
            
            const responseData = result.data as ResponseType;
            setData(responseData);
            setIsSuccess(true);
            toast.success('Images uploaded successfully');
            
            if (options?.onSuccess) {
                options.onSuccess(responseData);
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
        isLoading: isPending, // For backward compatibility
        isSuccess,
        isError,
        error,
        data
    };
}