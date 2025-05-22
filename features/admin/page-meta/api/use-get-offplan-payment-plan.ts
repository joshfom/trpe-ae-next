import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetOffplanPaymentPlan = (offplanId: string) => {
    return useQuery({
        enabled: !!offplanId,
        queryKey: ["offplan-faqs", offplanId],
        queryFn: async () => {
            const response = await client.api.admin.offplans[":offplanId"]["payment_plan"].$get({
                param: {offplanId}
            });

            if (!response.ok) {
                toast.error('An error occurred while fetching insights')
                throw new Error('An error occurred while fetching insights')
            }

            const {data} = await response.json()

            return data
        },
    })
}