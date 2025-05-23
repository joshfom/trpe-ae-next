"use client"
// This file now provides a compatibility layer for the useMutation pattern
// while transitioning away from React Query

import { useState } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { addClientFaq } from './add-client-faq';

type ResponseType = InferResponseType<typeof client.api.admin.faqs[":target"]["faqs"][":targetId"]["new"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.admin.faqs[":target"]["faqs"][":targetId"]["new"]["$post"]>["json"];

export const useAddFaq = (targetId: string, target: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const mutate = async (data: RequestType, options?: { onSuccess?: () => void }) => {
        setIsLoading(true);
        try {
            const result = await addClientFaq(targetId, target, data, options?.onSuccess);
            setError(null);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
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
};