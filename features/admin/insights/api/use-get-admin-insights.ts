"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminInsights } from "@/actions/admin/get-admin-insights-action";

interface InsightsParams {
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * React hook to fetch admin insights via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAdminInsights = (params: InsightsParams = {}) => {
    const { search = '', page = 1, limit = 9 } = params;
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminInsights({ search, page, limit });
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch insights");
            }
            
            setData(result.data);
        } catch (err) {
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching insights');
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
    }, [search, page, limit]); // Re-fetch when search, page, or limit changes

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
}