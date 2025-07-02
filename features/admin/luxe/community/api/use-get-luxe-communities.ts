"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getLuxeCommunities } from "@/actions/admin/luxe/get-luxe-communities-action";

/**
 * React hook to fetch luxe communities via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetLuxeCommunities = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            console.log('Hook: Starting fetch...');
            setIsLoading(true);
            setIsError(false);
            
            const result = await getLuxeCommunities();
            console.log('Hook: Action result:', result);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch luxe communities");
            }
            
            console.log('Hook: Setting data to:', result.data);
            setData(result.data);
        } catch (err) {
            console.error('Hook: Error caught:', err);
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching luxe communities');
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
        fetchData();
    }, []);

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};
