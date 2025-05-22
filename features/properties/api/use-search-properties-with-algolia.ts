import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { extractPathSearchParams } from "@/features/search/hooks/path-search-helper";
import { getPropertiesServer } from "./get-properties-server";

export const useSearchPropertiesWithDrizzle = (
    offeringType?: string,
    unitType?: string,
) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    return useQuery({
        queryKey: ["properties", {
            offeringType,
            pathname,
            searchParams: Object.fromEntries(searchParams.entries()),
            page: searchParams.get('page') || 1
        }],
        queryFn: async () => {
            // Convert searchParams URLSearchParams to a standard URLSearchParams object
            const searchParamsObj = new URLSearchParams();
            for (const [key, value] of searchParams.entries()) {
                searchParamsObj.append(key, value);
            }

            // Call the server-side function
            return await getPropertiesServer({
                offeringType,
                propertyType: unitType,
                searchParams: searchParamsObj,
                pathname
            });
        },
        staleTime: 0, // Ensure data is always fresh
    });
};

// Keep the old name for backward compatibility
export const useSearchPropertiesWithAlgolia = useSearchPropertiesWithDrizzle;