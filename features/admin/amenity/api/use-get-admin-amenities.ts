"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminAmenities } from "@/actions/admin/get-admin-amenities-action";

export const useGetAdminAmenities = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminAmenities();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch amenities");
            }
            
            setData(result.data);
        } catch (err) {
            setIsError(true);
            setError(err);
            toast.error('An error occurred while fetching amenities');
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
    }, []);

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
}