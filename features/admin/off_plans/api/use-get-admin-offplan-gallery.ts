import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetAdminOffplanGallery = (offplanId: string) => {
    return useQuery({
        queryKey: ["admin-offplan-gallery", offplanId],
        queryFn: async () => {
            const response = await client.api.admin.offplans[":offplanId"]["gallery"].$get({
                param: {offplanId}
            });

            if (!response.ok) {
                toast.error('An error occurred while fetching gallery')
                throw new Error('An error occurred while fetching gallery')
            }

            const {data} = await response.json()

            return data
        },
    })
}