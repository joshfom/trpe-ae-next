import {client} from "@/lib/hono";
import {toast} from "sonner";

export const useGetProjects = async () => {
    try {
        const response = await client.api.projects.$get();

        if (!response.ok) {
            console.error("Error response from projects API:", response.status, response.statusText);
            return []; // Return empty array instead of throwing error
        }

        const {data} = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return []; // Return empty array on any error
    }
}