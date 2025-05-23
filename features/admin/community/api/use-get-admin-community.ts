"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminCommunity } from "@/actions/admin/get-admin-community-action";

/**
 * Custom hook to fetch admin community data based on the provided community ID.
 *
 * @param {string} [communityId] - The ID of the community to fetch.
 * @returns - The result object including the community data.
 *
 * @example
 * const { data, error, isLoading } = useGetAdminCommunity("community-id");
 *
 * @remarks
 * This hook uses server actions to fetch the community data.
 * The fetch is enabled only if the `communityId` is provided.
 * If the fetch operation fails, an error toast is displayed.
 */
export const useGetAdminCommunity = (communityId?: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(!!communityId);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        if (!communityId) {
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminCommunity(communityId);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch community");
            }
            
            setData(result.data);
        } catch (err) {
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching community');
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
    }, [communityId]); // Re-fetch when communityId changes

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
}