"use client";

import {InferResponseType, InferRequestType} from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { useState } from "react";
import { updateAgentAction, UpdateAgentRequestData } from "@/actions/admin/update-agent-action";

type ResponseType = InferResponseType<typeof client.api.admin.agents[":agentId"]["$post"]>
type RequestType = InferRequestType<typeof client.api.admin.agents[":agentId"]["$post"]>["json"]

/**
 * React hook to update an agent via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useUpdateAgent = (agentId?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);
    
    const mutate = async (agentData: UpdateAgentRequestData, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        if (!agentId) {
            const err = new Error('Agent ID is required');
            if (options?.onError) options.onError(err);
            return;
        }
        
        try {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            
            const result = await updateAgentAction(agentId, agentData);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to update agent");
            }
            
            setData(result.data || {});
            setIsSuccess(true);
            toast.success('Agent updated successfully');
            
            if (options?.onSuccess && result.data) {
                options.onSuccess(result.data);
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error('An error occurred while updating agent');
            
            if (options?.onError) {
                options.onError(errorObj);
            }
        } finally {
            setIsPending(false);
        }
    };
    
    return {
        mutate,
        isLoading: isPending,
        isPending,
        isSuccess,
        isError,
        error,
        data
    };
}