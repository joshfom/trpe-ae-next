"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getLuxeJournalBySlugAction } from "@/actions/admin/luxe/get-luxe-journal-by-slug-action";

/**
 * React hook to fetch a single luxe journal entry by slug via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetLuxeJournalBySlug = (slug?: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchData = async (journalSlug: string) => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getLuxeJournalBySlugAction(journalSlug);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch journal entry");
            }
            
            setData(result.data);
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while fetching journal entry');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Refetch function that can be called manually
    const refetch = () => {
        if (slug) {
            fetchData(slug);
        }
    };
    
    useEffect(() => {
        if (slug) {
            fetchData(slug);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);
    
    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};
