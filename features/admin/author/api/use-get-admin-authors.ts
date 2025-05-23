"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminAuthors } from "@/actions/admin/get-admin-authors-action";

export const useGetAdminAuthors = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminAuthors();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch authors");
            }
            
            setData(result.data);
        } catch (err) {
            setIsError(true);
            setError(err);
            toast.error('An error occurred while fetching authors');
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