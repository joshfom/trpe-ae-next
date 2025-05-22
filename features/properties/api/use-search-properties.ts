import {useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import {usePathname} from "next/navigation";
import { extractPathSearchParams} from "@/features/search/hooks/path-search-helper";

interface SearchParams {
    page?: number;
    limit?: number;
    // Add other parameters as needed
}

export const useSearchProperties = (offerType?: string, searchParams?: SearchParams) => {

    const pathName = usePathname();
    const areas = extractPathSearchParams(pathName);


    return useQuery({
        queryKey: ["properties", { offerType }, 'search'],
        queryFn: async (query) => {
            const response = await client.api.properties[":offerType"].listings.search.$get({
                param: {
                    offerType,
                },
                query: {
                    ...searchParams,
                    limit: searchParams?.limit?.toString(),
                    page: searchParams?.page?.toString(),
                    // Convert other parameters to strings as needed
                }
            });

            if (!response.ok) {
                throw new Error('An error occurred while fetching properties');
            }

            const { data } = await response.json();

            return { data };
        },
    });
};