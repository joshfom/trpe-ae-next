'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAgentsData } from '@/actions/admin/get-agents-data-action';

export const useGetAgentDataV2 = (teamId?: string) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) return;
      
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      try {
        const result = await getAgentsData();
        
        if (result.success) {
          setData(result.data);
        } else {
          setIsError(true);
          setError(new Error(result.error));
          toast.error(result.error || 'An error occurred while fetching agents');
        }
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        toast.error('An error occurred while fetching agents');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [teamId]);
  
  return {
    data,
    isLoading,
    isError,
    error
  };
};
