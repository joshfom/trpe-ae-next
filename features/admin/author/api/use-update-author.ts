"use client"
// This file provides a compatibility layer for useUpdateAuthor 
// fully transitioning away from React Query while maintaining the same API surface

import { useState } from "react";
import { updateClientAuthor } from "./update-client-author";
import { toast } from "sonner";

// Define the author data type
interface AuthorData {
  name: string;
  about: string;
  avatar?: string;
}

// Define types to match React Query's useMutation API
interface MutateOptions {
  onSuccess?: (data: any, variables: AuthorData) => void;
  onError?: (error: Error, variables: AuthorData) => void;
}

export const useUpdateAuthor = (authorId?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const mutate = async (data: AuthorData, options?: MutateOptions) => {
        if (!authorId) {
            const error = new Error("Author ID is required");
            setError(error);
            if (options?.onError) {
                options.onError(error, data);
            }
            return Promise.reject(error);
        }
        
        setIsLoading(true);
        try {
            const result = await updateClientAuthor(authorId, data, () => {
                // This callback is used internally by updateClientAuthor
            });
            
            setError(null);
            
            // Call onSuccess callback if provided
            if (options?.onSuccess) {
                options.onSuccess(result, data);
            }
            
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('An unknown error occurred');
            setError(error);
            console.error('Error in mutation:', err);
            
            // Call onError callback if provided
            if (options?.onError) {
                options.onError(error, data);
            }
            
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    
    return {
        mutate,
        isLoading,
        isPending: isLoading, // Added for compatibility with newer versions of React Query
        error,
        isError: !!error
    }
}