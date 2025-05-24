"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { addAuthor } from "@/actions/admin/add-author-action";

type ResponseType = InferResponseType<typeof client.api.admin.authors.$post>
type RequestType = InferRequestType<typeof client.api.admin.authors.$post>["json"]

export const useAddAuthor = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<ResponseType | null>(null);
    
    const mutate = async (authorData: RequestType, options?: { 
        onSuccess?: (data: ResponseType) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await addAuthor(authorData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add author");
            }
            
            // Cast the data to ensure TypeScript is satisfied with the response type
            const responseData = result.data as ResponseType;
            setData(responseData);
            setIsSuccess(true);
            toast.success('Author added successfully');
            
            if (options?.onSuccess) {
                options.onSuccess(responseData);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while adding author');
            
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