"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminCommunities } from "@/actions/admin/get-admin-communities-action";

/**
 * React hook to fetch admin communities via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAdminCommunities = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before making API calls
    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchData = async () => {
        // Only run on client side after mounting
        if (!mounted || typeof window === 'undefined') {
            return;
        }

        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminCommunities();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch communities");
            }
            
            setData(result.data);
        } catch (err) {
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            console.warn('useGetAdminCommunities: Error fetching communities:', err);
            // Don't show toast on repeated errors
            if (mounted) {
                toast.error('An error occurred while fetching communities');
            }
        } finally {
            if (mounted) {
                setIsLoading(false);
            }
        }
    };

    // Refetch function that can be called manually
    const refetch = () => {
        fetchData();
    };

    useEffect(() => {
        if (mounted) {
            fetchData();
        }
    }, [mounted]);

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
}