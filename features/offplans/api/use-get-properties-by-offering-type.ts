import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";
import {useSearchParams} from "next/navigation";


export const useGetPropertiesByOfferingType = (
    offeringTypeId:string,
    page? : number
) => {
    const params = useSearchParams();

    const lo = params.get('lo') || undefined;
    const maxPrice = params.get('maxPrice') || undefined;
    const bed = params.get('bed') || undefined;
    const bathrooms = params.get('bathrooms') || undefined;
    const minArea = params.get('minArea') || undefined;
    const maxArea = params.get('maxArea') || undefined;
    const sortBy = params.get('sortBy') || undefined;
    const typeSlug = params.get('ty') || undefined;


    return useInfiniteQuery({
        enabled: !!offeringTypeId,
        queryKey: ["properties", {
            offeringTypeId,
            lo,
            maxPrice,
            bed,
            bathrooms,
            minArea,
            maxArea,
            sortBy,
            typeSlug,
        }],

        queryFn: async ({ pageParam = 1 }) => {
            const response = await client.api.properties.offer[':offeringTypeId'].$get({
                param: {
                    offeringTypeId,
                },
                // query: {
                //     lo,
                //     sortBy,
                //     typeSlug,
                //     // maxArea,
                //     // minArea,
                //     // bathrooms,
                //     bed,
                //     page: pageParam.toString()
                // }
            });


            if (!response.ok) {
                console.log(response)
                toast.error('An error occurred while fetching properties')
                throw new Error('An error occurred while fetching properties')
            }

            const {data} = await response.json()

            return {
                data
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => undefined,
    })
}