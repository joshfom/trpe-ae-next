"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateLuxeJournal } from "@/actions/admin/luxe/update-luxe-journal-action";

/**
 * React hook to update a luxe journal entry via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useUpdateLuxeJournal = (journalSlug?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (journalData: any, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }): Promise<void> => {
        if (!journalSlug) {
            const errorObj = new Error("Journal slug is required");
            setError(errorObj);
            setIsError(true);
            toast.error('Journal slug is required');
            
            if (options?.onError) {
                options.onError(errorObj);
            }
            return;
        }
        
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await updateLuxeJournal(journalSlug, journalData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update luxe journal entry");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Luxe journal entry updated successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while updating luxe journal entry');
            
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
