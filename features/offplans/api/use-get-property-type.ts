"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getPropertyTypes } from "@/actions/property/get-property-type-action";

/**
 * Custom hook to fetch property types
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetPropertyType = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const result = await getPropertyTypes();

            if (!result.success) {
                throw new Error(result.error || 'An error occurred while fetching property types');
            }

            setData({ data: result.data });
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('Failed to fetch property types');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        isLoading,
        error,
        isError: !!error,
        refetch: fetchData
    };
}