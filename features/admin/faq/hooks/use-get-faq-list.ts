import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetFaqList = (targetId: string, target: string) => {
    return useQuery({
        enabled: !!targetId,
        queryKey: ["admin-faqs", targetId],
        queryFn: async () => {
            const response = await client.api.admin.faqs[":target"]["list"][":targetId"].$get({
                param: {
                    targetId,
                    target,
                }
            });

            if (!response.ok) {
                toast.error('An error occurred while fetching faqs')
                throw new Error('An error occurred while fetching faqs')
            }

            const {data} = await response.json()

            return data
        },
    })
}