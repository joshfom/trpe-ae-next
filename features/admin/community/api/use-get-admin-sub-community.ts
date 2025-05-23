"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminSubCommunities } from "@/actions/admin/get-admin-sub-communities-action";

/**
 * React hook to fetch admin sub-communities via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAdminSubCommunities = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminSubCommunities();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch sub-communities");
            }
            
            setData(result.data);
        } catch (err) {
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching sub-communities');
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
}