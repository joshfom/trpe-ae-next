"use client";

import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { addDeveloper } from "@/actions/admin/add-developer-action";

type ResponseType = InferResponseType<typeof client.api.admin.developers.$post>
type RequestType = InferRequestType<typeof client.api.admin.developers.$post>["json"]

/**
 * Custom hook to add a developer using a server action.
 *
 * This hook mimics the React Query useMutation API to maintain compatibility.
 *
 * @returns The mutation result object with React Query-like interface.
 *
 * @example
 * const { mutate } = useAddDeveloper();
 * mutate(newDeveloperData);
 *
 * @remarks
 * - On successful addition of a developer, a success toast message is shown.
 * - On error, an error toast message is shown.
 */

export const useAddDeveloper = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (developerData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await addDeveloper(developerData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add developer");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Developer added successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while adding Developer');
            
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