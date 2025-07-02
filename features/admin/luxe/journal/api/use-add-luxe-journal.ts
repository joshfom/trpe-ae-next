"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addLuxeJournal } from "@/actions/admin/luxe/add-luxe-journal-action";

/**
 * React hook to add a luxe journal entry via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useAddLuxeJournal = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (journalData: any, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }): Promise<void> => {
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            setError(null);
            
            const result = await addLuxeJournal(journalData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to add luxe journal entry");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Luxe journal entry added successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while adding luxe journal entry');
            
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
