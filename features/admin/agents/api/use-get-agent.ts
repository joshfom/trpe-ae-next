"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminAgentAction } from "@/actions/admin/get-admin-agent-action";

/**
 * React hook to fetch a single admin agent by ID via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAgent = (agentId: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminAgentAction(agentId);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch agent");
            }
            
            setData(result.data);
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while fetching agent');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Refetch function that can be called manually
    const refetch = () => {
        fetchData();
    };
    
    useEffect(() => {
        if (agentId) {
            fetchData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentId]);
    
    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};
