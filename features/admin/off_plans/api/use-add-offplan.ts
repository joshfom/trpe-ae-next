"use client";

import { InferRequestType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useRouter } from "next/navigation";
import { addOffplan } from "@/actions/admin/add-offplan-action";

type ResponseType = {
    data: {
        id: string;
    };
} | { Unauthorized: string; };

type RequestType = InferRequestType<typeof client.api.admin.offplans.new.$post>["json"]

/**
 * Custom hook to add a new off-plan using a server action.
 *
 * This hook mimics the React Query useMutation API to maintain compatibility.
 * It handles success and error scenarios with appropriate toast notifications.
 *
 * @returns The mutation object for adding a new off-plan with React Query-like interface.
 *
 * @example
 * const { mutate } = useAddOffplan();
 * mutate(newOffplanData);
 *
 * @remarks
 * - On success, it navigates to the newly added off-plan's detail page.
 * - On error, it shows an error toast notification.
 */
export const useAddOffplan = () => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (offplanData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await addOffplan(offplanData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add offplan");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            
            if (result.data && 'data' in result.data) {
                toast.success('Offplan added successfully');
                router.push(`/admin/off-plans/${result.data.data.id}`);
                
                if (options?.onSuccess) {
                    options.onSuccess(result.data);
                }
            } else {
                toast.error('Unauthorized');
                throw new Error('Unauthorized');
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while updating Offplan');
            
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