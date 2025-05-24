'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getSimilarCommunities } from '@/actions/community/get-similar-communities-action';

export const useGetSimilarCommunitiesV2 = (communityId: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!communityId) return;
      
      setIsLoading(true);
      setIsError(false);
      setError(null);
      
      try {
        const result = await getSimilarCommunities(communityId);
        
        if (result.success) {
          setData(result.data);
        } else {
          setIsError(true);
          setError(new Error(result.error));
          toast.error(result.error || 'An error occurred while fetching similar communities');
        }
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        toast.error('An error occurred while fetching similar communities');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [communityId]);
  
  return {
    data,
    isLoading,
    isError,
    error
  };
};
