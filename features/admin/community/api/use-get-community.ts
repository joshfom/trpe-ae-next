"use client";

import { useState, useEffect } from "react";
import { getCommunityAction } from "@/actions/admin/get-community-action";

/**
 * React hook to get a community by ID via server action
 */
export const useGetCommunity = (communityId: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                setIsLoading(true);
                setIsError(false);
                setError(null);
                
                const result = await getCommunityAction(communityId);
                
                if (!result.success) {
                    throw new Error(result.error || "Failed to fetch community");
                }
                
                setData(result.data);
            } catch (err) {
                const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
                setError(errorObj);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        
        if (communityId) {
            fetchCommunity();
        }
    }, [communityId]);
    
    return {
        data,
        isLoading,
        isError,
        error
    };
};
