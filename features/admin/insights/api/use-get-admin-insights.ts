import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

interface InsightsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const useGetAdminInsights = (params: InsightsParams = {}) => {
    const { search = '', page = 1, limit = 9 } = params;
    
    return useQuery({
        queryKey: ["admin-insights", search, page, limit],
        queryFn: async () => {
            const response = await client.api.admin['insights'].$get({
                query: {
                    search,
                    page: page.toString(),
                    limit: limit.toString()
                }
            });

            if (!response.ok) {
                toast.error('An error occurred while fetching insights')
                throw new Error('An error occurred while fetching insights')
            }

            const data = await response.json();
            return data;
        },
    })
}