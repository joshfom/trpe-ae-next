"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getCommunityProperties } from "@/actions/community/get-community-properties-action";

/**
 * Custom hook to fetch properties for a specific community
 * This hook mimics the React Query useQuery API to maintain compatibility
 * @param communityId The ID of the community
 */
export const useGetCommunityProperties = (
    communityId: string,
) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        if (!communityId) return;
        
        try {
            setIsLoading(true);
            const result = await getCommunityProperties(communityId);

            if (!result.success) {
                throw new Error(result.error || 'An error occurred while fetching properties');
            }

            setData({ data: result.data });
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('Failed to fetch community properties');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (communityId) {
            fetchData();
        }
    }, [communityId]);

    return {
        data,
        isLoading,
        error,
        isError: !!error,
        refetch: fetchData
    };
}