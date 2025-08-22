#!/usr/bin/env bun

import { getPropertiesServer } from "@/features/properties/api/get-properties-server";

async function debugVillaForRent() {
    console.log("=== DEBUG: Villa For Rent API Call ===");
    
    try {
        // Simulate the exact call that the frontend makes
        const result = await getPropertiesServer({
            offeringType: "for-rent",     
            propertyType: "villas",       
            searchParams: new URLSearchParams(),   // empty like from URL
            pathname: "/property-types/villas/for-rent", 
            page: "1"             
        });
        
        console.log("=== API Response Summary ===");
        console.log("Total Count:", result.totalCount);
        console.log("Properties Length:", result.properties?.length || 0);
        console.log("Error:", result.error);
        console.log("Not Found:", result.notFound);
        
        if (result.properties && result.properties.length > 0) {
            console.log("\n=== First 3 Properties Details ===");
            
            result.properties.slice(0, 3).forEach((property, index) => {
                console.log(`\n--- Property ${index + 1} ---`);
                console.log("ID:", property.id);
                console.log("Title:", property.title);
                console.log("Type ID:", property.typeId);
                console.log("Unit Type ID:", property.unitTypeId);
                console.log("Type Object:", property.type ? {
                    id: property.type.id,
                    name: property.type.name,
                    slug: property.type.slug
                } : "NULL");
                console.log("Unit Type Object:", property.unitType ? {
                    id: property.unitType.id,
                    name: property.unitType.name,
                    slug: property.unitType.slug
                } : "NULL");
                console.log("Offering Type Object:", property.offeringType ? {
                    id: property.offeringType.id,
                    name: property.offeringType.name,
                    slug: property.offeringType.slug
                } : "NULL");
            });
        }
        
    } catch (error) {
        console.error("Error calling getPropertiesServer:", error);
    }
}

debugVillaForRent();
