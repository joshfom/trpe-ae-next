"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
    
    // Use ref to track if component is mounted to prevent state updates after unmount
    const isMountedRef = useRef(true);
    
    // Create a stable key for the request to prevent unnecessary refetches
    const requestKey = `${search}-${page}-${limit}`;
    const lastRequestKeyRef = useRef<string>('');

    const fetchData = useCallback(async () => {
        // Prevent duplicate requests
        if (requestKey === lastRequestKeyRef.current) {
            return;
        }
        
        lastRequestKeyRef.current = requestKey;
        
        try {
            if (!isMountedRef.current) return;
            
            setIsLoading(true);
            setIsError(false);
            setError(null);
            
            const result = await getAdminInsights({ search, page, limit });
            
            if (!isMountedRef.current) return;
            
            // Check if result exists and has the expected structure
            if (!result) {
                throw new Error("No response received from server");
            }
            
            // Ensure result has the expected structure
            if (typeof result !== 'object' || !('success' in result)) {
                console.error("Invalid result structure:", result);
                throw new Error("Invalid response format from server");
            }
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch insights");
            }
            
            setData(result.data);
        } catch (err) {
            if (!isMountedRef.current) return;

            console.log("Error fetching insights:", err);
            
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching insights');
            console.error("Fetch error:", err);
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [search, page, limit, requestKey]);

    // Refetch function that can be called manually
    const refetch = useCallback(() => {
        lastRequestKeyRef.current = ''; // Reset to force refetch
        return fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
}