"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminAuthors } from "@/actions/admin/get-admin-authors-action";

// Define author type based on the author table schema
type Author = {
    id: string;
    name: string | null;
    about: string | null;
    avatar: string | null;
    updatedAt: string | null;
    createdAt: string;
};

export const useGetAdminAuthors = () => {
    const [data, setData] = useState<Author[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminAuthors();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch authors");
            }
            
            // Handle the case when result.data might be undefined
            setData(result.data || []);
        } catch (err) {
            setIsError(true);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
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