# Migrating from React Query to Server Actions

This README documents the approach to migrate from React Query to Next.js Server Actions.

## What's Been Done

1. Created server actions for form submissions and data fetching:
   - `actions/submit-contact-form.ts` for contact form submissions
   - `actions/submit-callback-request.ts` for callback request submissions
   - `actions/admin/update-community-action.ts` for admin community updates
   - `actions/admin/add-author-action.ts` for adding authors
   - `actions/admin/add-city-action.ts` for adding cities
   - `actions/admin/get-admin-amenities-action.ts` for fetching amenities
   - `actions/admin/get-admin-authors-action.ts` for fetching authors
   - `actions/admin/get-admin-cities-action.ts` for fetching cities
   - `actions/admin/add-community-action.ts` for adding communities
   - `actions/admin/attach-sub-community-action.ts` for attaching sub-communities
   - `actions/admin/get-admin-communities-action.ts` for fetching communities
   - `actions/admin/get-admin-community-action.ts` for fetching a specific community
   - `actions/admin/get-admin-sub-communities-action.ts` for fetching sub-communities
   - `actions/admin/add-developer-action.ts` for adding developers
   - `actions/admin/get-admin-developers-action.ts` for fetching developers
   - `actions/admin/update-developer-action.ts` for updating developers
   - `actions/admin/add-insight-action.ts` for adding insights
   - `actions/admin/delete-insight-action.ts` for deleting insights
   - `actions/admin/get-admin-insights-action.ts` for fetching insights
   - `actions/admin/update-insight-action.ts` for updating insights
   - `actions/admin/add-language-action.ts` for adding languages
   - `actions/admin/get-admin-languages-action.ts` for fetching languages
   - `actions/admin/add-offplan-faq-action.ts` for adding offplan FAQs
   - `actions/admin/add-offplan-action.ts` for adding offplans
   - `actions/admin/upload-offplan-images-action.ts` for uploading offplan images
   - `actions/admin/get-admin-offering-types-action.ts` for fetching offering types
   - `actions/admin/update-offering-type-action.ts` for updating offering types
   - `actions/admin/get-admin-page-metas-action.ts` for fetching page metas
   - `actions/admin/get-admin-property-types-action.ts` for fetching property types
2. Updated client-side hooks to use server actions:
   - `features/site/api/use-submit-form.ts`
   - `features/site/api/use-submit-request-callback.ts`
   - `features/admin/community/api/use-update-community.ts`
   - `features/admin/amenity/api/use-get-admin-amenities.ts`
   - `features/admin/author/api/use-add-author.ts`
   - `features/admin/author/api/use-get-admin-authors.ts`
   - `features/admin/city/api/use-add-cities.ts`
   - `features/admin/city/api/use-get-admin-cities.ts`
   - `features/admin/community/api/use-add-community.ts`
   - `features/admin/community/api/use-attach-sub-community.ts`
   - `features/admin/community/api/use-get-admin-communities.ts`
   - `features/admin/community/api/use-get-admin-community.ts`
   - `features/admin/community/api/use-get-admin-sub-community.ts`
   - `features/admin/developers/api/use-add-developer.ts`
   - `features/admin/developers/api/use-get-admin-developer.ts`
   - `features/admin/developers/api/use-update-developer.ts`
   - `features/admin/insights/api/use-add-insight.ts`
   - `features/admin/insights/api/use-delete-insight.ts`
   - `features/admin/insights/api/use-get-admin-insights.ts`
   - `features/admin/insights/api/use-update-insight.ts`
   - `features/admin/language/api/use-add-language.ts`
   - `features/admin/language/api/use-get-admin-language.ts`
   - `features/admin/off_plans/api/use-add-offplan-faq.ts`
   - `features/admin/off_plans/api/use-add-offplan.ts`
   - `features/admin/off_plans/api/use-get-admin-offplan-gallery.ts`
   - `features/admin/off_plans/api/use-get-offplan-faqs.ts`
   - `features/admin/off_plans/api/use-get-offplan-payment-plan.ts`
   - `features/admin/off_plans/api/use-update-offplan.ts`
   - `features/admin/off_plans/api/use-upload-offplan-images.ts`
   - `features/admin/offering/api/use-get-admin-offering-types.ts`
   - `features/admin/offering/api/use-update-offering-type.ts`
   - `features/admin/page-meta/api/use-get-admin-page-metas.ts`
   - `features/admin/property-types/api/use-get-admin-property-types.ts`

## Server Action Pattern

Server actions follow this pattern:

```typescript
"use server";

import { client } from "@/lib/hono";
import { revalidatePath } from "next/cache";

export async function submitAction(data: DataType) {
  try {
    // Make the API call
    const response = await client.api.someEndpoint.$post({ json: data });
    const result = await response.json();
    
    // Revalidate paths that might be affected
    revalidatePath("/relevant-path");
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      error: "Error message"
    };
  }
}
```

## Client Hook Patterns

### For Mutations (formerly useMutation)

Client hooks mimic the React Query API to minimize component changes:

```typescript
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitAction } from "@/actions/submit-action";

export const useSubmitHook = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  
  const mutate = async (data: DataType, options?: { 
    onSuccess?: (data: any) => void,
    onError?: (error: Error) => void 
  }) => {
    try {
      setIsPending(true);
      setIsError(false);
      setIsSuccess(false);
      
      const result = await submitAction(data);
      
      if (result.success) {
        setData(result.data);
        setIsSuccess(true);
        toast.success('Success message');
        if (options?.onSuccess) {
          options.onSuccess(result.data);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Unknown error");
      setError(errorObj);
      setIsError(true);
      toast.error('Error message');
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
};
```

### For Queries (formerly useQuery)

```typescript
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchData } from "@/actions/fetch-data-action";

export const useFetchHook = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDataFromServer = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      const result = await fetchData();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Unknown error");
      setError(errorObj);
      setIsError(true);
      toast.error('Error message');
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch function that can be called manually
  const refetch = () => {
    fetchDataFromServer();
  };

  useEffect(() => {
    fetchDataFromServer();
  }, []);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch
  };
};
```

## Benefits of Server Actions

1. **Reduced Client Bundle Size**: No need for React Query or other client-side data fetching libraries
2. **Improved Performance**: Server-side execution for data operations
3. **Progressive Enhancement**: Forms work even with JavaScript disabled
4. **Type Safety**: End-to-end type safety from server to client
5. **Better Error Handling**: Centralized error handling at the server level

## Next Steps

To continue migrating from React Query to server actions:

1. Identify React Query usage (`useMutation` or `useQuery`)
2. Create corresponding server action
3. Update the client hook to use the server action
4. Verify functionality works as expected

### Completed Conversion

All React Query hooks have been successfully converted to use server actions! ✅ 

The following files were converted in the latest update:

1. Offplan image upload:
   - Created `actions/admin/upload-offplan-images-action.ts`
   - Updated `features/admin/off_plans/api/use-upload-offplan-images.ts`

2. Offering types:
   - Created `actions/admin/get-admin-offering-types-action.ts`
   - Created `actions/admin/update-offering-type-action.ts`
   - Updated `features/admin/offering/api/use-get-admin-offering-types.ts`
   - Updated `features/admin/offering/api/use-update-offering-type.ts`

3. Page metas:
   - Created `actions/admin/get-admin-page-metas-action.ts`
   - Updated `features/admin/page-meta/api/use-get-admin-page-metas.ts`

4. Property types:
   - Created `actions/admin/get-admin-property-types-action.ts`
   - Updated `features/admin/property-types/api/use-get-admin-property-types.ts`

For read operations (`useQuery`), consider using:
- Server Components where possible
- React's `use` hook with server actions for client components
