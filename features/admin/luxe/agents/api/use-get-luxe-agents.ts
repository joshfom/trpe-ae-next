"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getLuxeAgentsAction } from "@/actions/admin/luxe/get-luxe-agents-action";

/**
 * React hook to fetch luxe agents via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetLuxeAgents = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getLuxeAgentsAction();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch luxe agents");
            }
            
            setData(result.data);
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while fetching luxe agents');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};
