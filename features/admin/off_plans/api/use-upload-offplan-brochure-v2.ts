'use client';

import { useState } from "react";
import { uploadOffplanBrochure } from "@/actions/admin/upload-offplan-brochure-action";
import { toast } from "sonner";

/**
 * Client hook to upload offplan brochure via server action
 * This hook mimics the React Query useMutation API to maintain compatibility
 */
export const useUploadOffplanBrochureV2 = (offplanId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (data: any, options?: { onSuccess?: () => void }) => {
    setIsLoading(true);
    
    try {
      const result = await uploadOffplanBrochure(offplanId, data);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to upload brochure");
      }
      
      toast.success("Brochure uploaded successfully");
      setError(null);
      
      if (options?.onSuccess) {
        options.onSuccess();
      }
      
      return result.data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
      toast.error("An error occurred while uploading brochure");
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    mutateAsync: mutate,  // For compatibility with React Query API
    isLoading,
    error,
    isError: !!error,
    reset: () => setError(null)
  };
};
