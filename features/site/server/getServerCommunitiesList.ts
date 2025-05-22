// `features/community/server/getCommunities.ts`
import {client} from "@/lib/hono";
import {cache} from "react";

// Cache the function using React's cache feature for server components
export const getServerCommunitiesList = cache(async () => {
    const response = await client.api.communities.list.$get();

    if (!response.ok) {
        throw new Error("An error occurred while fetching communities");
    }

    const {communities} = await response.json();
    return communities;
});