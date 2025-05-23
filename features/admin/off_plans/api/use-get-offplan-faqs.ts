"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getOffplanFaqs } from "@/actions/admin/get-offplan-faqs-action";

/**
 * React hook to fetch offplan FAQs via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetOffplanFaqs = (offplanId: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(!!offplanId);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        if (!offplanId) {
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getOffplanFaqs(offplanId);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch FAQs");
            }
            
            setData(result.data);
        } catch (err) {
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching FAQs');
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Refetch function that can be called manually
    const refetch = () => {
        fetchData();
    };

    useEffect(() => {
        if (offplanId) {
            fetchData();
        }
    }, [offplanId]); // Re-fetch when offplanId changes

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
}