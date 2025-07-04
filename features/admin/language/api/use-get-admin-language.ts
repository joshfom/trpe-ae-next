"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminLanguages } from "@/actions/admin/get-admin-languages-action";

/**
 * Define the Language interface based on the database schema
 */
export interface Language {
    id: string;
    name: string | null;
    icon: string | null;
    slug: string;
    updatedAt: string | null;
    createdAt: string;
}

/**
 * React hook to fetch admin languages via server action
 * This hook mimics the React Query useQuery API to maintain compatibility
 */
export const useGetAdminLanguage = () => {
    const [data, setData] = useState<Language[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const result = await getAdminLanguages();
            
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch languages");
            }
            
            setData(result.data as Language[]);
        } catch (err) {
            setIsError(true);
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            toast.error('An error occurred while fetching language');
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