"use client"
// This file now provides a compatibility layer for useAddPageMeta 
// while transitioning away from React Query

import {useState} from "react";
import {addClientPageMeta} from "./add-client-page-meta";

// Use the same interface as the server action
interface PageMetaData {
    metaTitle: string;
    metaDescription: string;
    noIndex?: boolean;
    noFollow?: boolean;
    title: string;
    content?: string; // Optional field to match schema
    path: string;
    metaKeywords?: string;
    includeInSitemap?: boolean;
}

type ResponseType = {
    success: boolean;
    data: any;
    error: string | null;
}

export const useAddPageMeta = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const mutate = async (json: PageMetaData) => {
        setIsLoading(true);
        try {
            const result = await addClientPageMeta(json, (data) => {
                // This is equivalent to the onSuccess callback in the original code
                console.log('Page meta added successfully:', data);
                // Note: invalidation of queries is no longer needed with server actions
            });
            setError(null);
            return result;
        } catch (error) {
            console.error('Error adding page meta:', error);
            setError(error as Error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mutate,
        isPending: isLoading,
        isLoading,
        error,
    };
};
