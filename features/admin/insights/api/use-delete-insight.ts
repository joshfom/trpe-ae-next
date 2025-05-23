"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteInsight } from "@/actions/admin/delete-insight-action";

/**
 * React hook to delete an insight via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useDeleteInsight = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async ({ slug, coverUrl }: { slug: string, coverUrl?: string }, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await deleteInsight({ slug, coverUrl });
            
            if (!result.success) {
                throw new Error(result.error || "Failed to delete insight");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Insight deleted successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while deleting the insight');
            console.error('Error deleting insight:', err);
            
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
};
