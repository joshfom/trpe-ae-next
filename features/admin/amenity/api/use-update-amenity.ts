"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateAmenity } from "@/actions/admin/update-amenity-action";

// Simplified type for amenity data
type AmenityData = {
  name: string;
  icon: string;
}

/**
 * This hook mimics the React Query useMutation API to maintain compatibility
 * while using server actions underneath
 */
export const useUpdateAmenity = (amenityId?: string) => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any>(null);

    const mutate = async (amenityData: AmenityData, options?: {
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void
    }) => {
        if (!amenityId) {
            const error = new Error("Amenity ID is required");
            setError(error);
            setIsError(true);
            if (options?.onError) {
                options.onError(error);
            }
            toast.error("Amenity ID is required");
            return;
        }

        try {
            setIsPending(true);
            const result = await updateAmenity(amenityId, amenityData);

            if (result.success) {
                setData(result.data);
                setIsSuccess(true);
                toast.success("Amenity updated successfully");
                if (options?.onSuccess) {
                    options.onSuccess(result.data);
                }
            } else {
                throw new Error(result.error || "Failed to update amenity");
            }
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");
            setError(errorObj);
            setIsError(true);
            toast.error("An error occurred while updating amenity");
            if (options?.onError) {
                options.onError(errorObj);
            }
        } finally {
            setIsPending(false);
        }
    };

    return {
        mutate,
        isPending,
        isLoading: isPending, // Added for backward compatibility
        isSuccess,
        isError,
        error,
        data
    };
}