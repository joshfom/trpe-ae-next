"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getAgentsAction } from "@/actions/agents/get-agents-action";

/**
 * React hook to fetch agents via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAgents = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            setError(null);
            
            const result = await getAgentsAction();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch agents");
            }
            
            setData(result.data);
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while fetching agents');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Refetch function that can be called manually - now properly memoized
    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};
