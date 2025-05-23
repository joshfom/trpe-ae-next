"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminDevelopers } from "@/actions/admin/get-admin-developers-action";

/**
 * React hook to fetch admin developers via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAdminDeveloper = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminDevelopers();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch developers");
            }
            
            setData(result.data);
        } catch (err) {
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching developers');
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