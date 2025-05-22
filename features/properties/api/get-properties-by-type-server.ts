import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {propertyTable} from "@/db/schema/property-table";
import {propertyTypeTable} from "@/db/schema/property-type-table";

/**
 * Get properties by offering type only - simplified version for landing pages
 * Returns first 12 properties without pagination
 */
export async function getPropertiesByTypeServer({
                                                    offeringType
                                                }: {
    offeringType: string;
}) {

    //find the property type
    const propertyType = await db.query.offeringTypeTable.findFirst({
        where: (eq(propertyTypeTable.slug, offeringType))
    })

    //if no property type found, return empty array
    if (!propertyType) {
        return {
            properties: [],
            error: 404
        };
    }

    try {
        const properties = await db.query.propertyTable.findMany({
            where: (eq(propertyTable.offeringTypeId, propertyType.id)),
            limit: 12,
            with: {
                type: true,
                community: true,
                images: true,
                offeringType: true,
            }
        })

        const count = await db.query.propertyTable.findMany({
            where: (eq(propertyTable.offeringTypeId, propertyType.id)),
        })

        return {
            properties,
            count : count.length,
            error: null,
            currentPage: 1,
        };

    } catch (error) {
        console.error("Error fetching properties by type with Drizzle:", error);
        return {
            properties: [],
            error: "Failed to fetch properties"
        };
    }
}