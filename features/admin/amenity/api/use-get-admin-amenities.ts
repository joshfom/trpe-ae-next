"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminAmenities } from "@/actions/admin/get-admin-amenities-action";

// Define the Amenity type
interface Amenity {
    id: string;
    name: string;
    icon: string;
    // Add other properties as needed
}

export const useGetAdminAmenities = () => {
    const [data, setData] = useState<Amenity[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminAmenities();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch amenities");
            }
            
            // Type assertion to ensure the data matches our Amenity[] type
            setData(result.data as Amenity[]);
        } catch (err) {
            setIsError(true);
            setError(err instanceof Error ? err : new Error(String(err)));
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