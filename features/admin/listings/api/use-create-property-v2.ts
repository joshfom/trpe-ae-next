'use client';

import { useState } from 'react';
import { InferRequestType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { createProperty } from '@/actions/admin/create-property-action';

type RequestType = InferRequestType<typeof client.api.admin.properties.$post>["json"]

export const useCreatePropertyV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  
  const mutate = async (propertyData: RequestType) => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);
    
    try {
      const result = await createProperty(propertyData);
      
      if (result.success) {
        setData(result.data);
        setIsSuccess(true);
        toast.success('Property added successfully');
      } else {
        setIsError(true);
        setError(new Error(result.error));
        toast.error(result.error || 'An error occurred while creating property');
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast.error('An error occurred while creating property');
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
