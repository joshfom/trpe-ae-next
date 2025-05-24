"use client"
// This file provides a compatibility layer for the useMutation pattern
// while transitioning away from React Query

import { useState } from "react";
import { updateLanguage } from "@/actions/admin/update-language-action";
import { toast } from "sonner";

// Define the request type explicitly
type RequestType = {
  name: string;
  locale: string;
  slug: string;
  code: string;
  isActive: boolean;
  isDefault: boolean;
};

export const useUpdateLanguage = (languageId?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = async (data: RequestType, options?: { onSuccess?: () => void }) => {
        setIsLoading(true);
        
        try {
            // Use the server action directly
            const result = await updateLanguage(languageId || "", data);
            
            if (result.success === false) {
                throw new Error(result.error || "Failed to update language");
            }
            
            toast.success("Language updated successfully");
            setError(null);
            
            if (options?.onSuccess) {
                options.onSuccess();
            }
            
            return result.data;
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            toast.error("An error occurred while updating language");
            setError(errorObj);
            throw errorObj;
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
