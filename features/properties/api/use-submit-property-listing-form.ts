"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitPropertyListingForm } from "@/actions/submit-property-listing-form";

type PropertyListingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  offeringType: string;
  propertyType: string;
  address: string;
  message?: string; // Make message optional to match Zod schema
};

export const useSubmitPropertyListingForm = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    
    const mutate = async (formData: PropertyListingFormData, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            
            const result = await submitPropertyListingForm(formData);
            
            if (result.success) {
                setIsSuccess(true);
                toast.success('Your property listing request has been received! Our team will contact you shortly.');
                if (options?.onSuccess) {
                    options.onSuccess(result.data);
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setIsError(true);
            toast.error('An error occurred while submitting your request. Please try again.');
            if (options?.onError) {
                options.onError(error as Error);
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
        isError
    };
};
