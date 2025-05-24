"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { getFeaturedProperties } from "@/actions/property/get-featured-property-action";

/**
 * Custom hook to fetch featured properties
 * This hook mimics the React Query useQuery API to maintain compatibility
 * @param offeringTypeId The ID of the offering type
 */
export const useGetFeaturedProperty = (
    offeringTypeId: string
) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const params = useSearchParams();
    const limit = params.get('limit') || '1';

    const fetchData = async () => {
        if (!offeringTypeId) return;
        
        try {
            setIsLoading(true);
            const result = await getFeaturedProperties(offeringTypeId, limit);

            if (!result.success) {
                throw new Error(result.error || 'An error occurred while fetching featured properties');
            }

            setData(result.data);
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('Failed to fetch featured properties');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (offeringTypeId) {
            fetchData();
        }
    }, [offeringTypeId, limit]);

    return {
        data,
        isLoading,
        error,
        isError: !!error,
        refetch: fetchData
    };
}