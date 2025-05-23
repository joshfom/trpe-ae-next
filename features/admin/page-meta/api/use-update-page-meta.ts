"use client"
// This file provides a compatibility layer for useUpdatePageMeta 
// fully transitioning away from React Query while maintaining the same API surface

import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useState} from "react";
import {updateClientPageMeta} from "./update-client-page-meta";

type RequestType = InferRequestType<typeof client.api.admin["page-meta"][":id"]["update"]["$patch"]>["json"]
// Using any for ResponseType to avoid type errors since the exact structure from server might vary
type ResponseType = any

// Define types to match React Query's useMutation API
interface MutateOptions {
  onSuccess?: (data: any, variables: RequestType) => void;
  onError?: (error: Error, variables: RequestType) => void;
}

export const useUpdatePageMeta = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const mutate = async (json: RequestType, options?: MutateOptions) => {
        if (!id) {
            const error = new Error("Page meta ID is required");
            setError(error);
            if (options?.onError) {
                options.onError(error, json);
            }
            return Promise.reject(error);
        }
        
        setIsLoading(true);
        try {
            const result = await updateClientPageMeta(id, json, () => {
                // This callback is used internally by updateClientPageMeta
            });
            
            setError(null);
            
            // Call onSuccess callback if provided
            if (options?.onSuccess) {
                options.onSuccess(result, json);
            }
            
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('An unknown error occurred');
            setError(error);
            console.error('Error in mutation:', err);
            
            // Call onError callback if provided
            if (options?.onError) {
                options.onError(error, json);
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
    };
}