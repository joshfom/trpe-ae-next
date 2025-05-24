'use client';

import { useState } from 'react';
import { InferRequestType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { addCommunity } from '@/actions/admin/add-community-action';

type RequestType = InferRequestType<typeof client.api.admin.communities.$post>["json"]

export const useAddCommunityV2 = (agentId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  
  const mutate = async (communityData: RequestType) => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);
    
    try {
      const result = await addCommunity(communityData);
      
      if (result.success) {
        setData(result.data);
        setIsSuccess(true);
        toast.success('Community updated successfully');
      } else {
        setIsError(true);
        setError(new Error(result.error));
        toast.error(result.error || 'An error occurred while updating community');
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast.error('An error occurred while updating community');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    mutate,
    isLoading,
    isError,
    isSuccess,
    error,
    data
  };
};
