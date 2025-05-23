"use client"
// This file now provides a compatibility layer for useAddPageMeta 
// while transitioning away from React Query

import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {useState} from "react";
import {addClientPageMeta} from "./add-client-page-meta";

type ResponseType = InferResponseType<typeof client.api.admin["page-meta"]["new"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin["page-meta"]["new"]["$post"]>["json"]

export const useAddPageMeta = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const mutate = async (json: RequestType) => {
        setIsLoading(true);
        try {
            const result = await addClientPageMeta(json, (data) => {
                // This is equivalent to the onSuccess callback in the original code
                console.log('Page meta added successfully:', data);
                // Note: invalidation of queries is no longer needed with server actions
            });
            setError(null);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            console.error('Error in mutation:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };
    
    return {
        mutate,
        isLoading,
        error,
        isError: !!error
    };
}