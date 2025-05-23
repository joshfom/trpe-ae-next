"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getOffplanPaymentPlan } from "@/actions/admin/get-offplan-payment-plan-action";

/**
 * React hook to fetch offplan payment plan via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetOffplanPaymentPlan = (offplanId: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(!!offplanId);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        if (!offplanId) {
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getOffplanPaymentPlan(offplanId);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch payment plan");
            }
            
            setData(result.data);
        } catch (err) {
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching payment plan');
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
        if (offplanId) {
            fetchData();
        }
    }, [offplanId]); // Re-fetch when offplanId changes

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
}