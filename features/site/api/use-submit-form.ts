"use client";

import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/hono";
import {toast} from "sonner";
import {useState} from "react";
import {submitContactForm} from "@/actions/submit-contact-form";

type ResponseType = InferResponseType<typeof client.api.leads.contact.$post>;
type RequestType = InferRequestType<typeof client.api.leads.contact.$post>["json"];

export const useSubmitForm = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    
    const mutate = async (formData: RequestType, options?: { 
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void 
    }) => {
        try {
            setIsPending(true);
            setIsError(false);
            
            const result = await submitContactForm(formData);
            
            if (result.success) {
                setIsSuccess(true);
                toast.success('Your message have been received, one of our Experts will contact you shortly');
                if (options?.onSuccess) {
                    options.onSuccess(result.data);
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setIsError(true);
            toast.error('An error occurred while sending your message, please try again');
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
}