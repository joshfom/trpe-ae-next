#!/usr/bin/env bun

import { db } from "./db/drizzle";
import { propertyTable } from "./db/schema/property-table";
import { eq } from "drizzle-orm";

async function checkLuxeProperties() {
    console.log("=== Checking Luxe Properties ===");
    
    try {
        // Get a few luxe properties
        const properties = await db.query.propertyTable.findMany({
            where: eq(propertyTable.isLuxe, true),
            with: {
                agent: true,
                community: true,
                city: true,
                offeringType: true,
                images: true,
                type: true,
            },
            limit: 3
        });
        
        console.log(`Found ${properties.length} luxe properties`);
        
        properties.forEach((property, index) => {
            console.log(`\n--- Property ${index + 1} ---`);
            console.log(`Title: ${property.title || 'NO TITLE'}`);
            console.log(`Slug: ${property.slug || 'NO SLUG'}`);
            console.log(`Price: ${property.price || 'NO PRICE'}`);
            console.log(`Bedrooms: ${property.bedrooms || 'NO BEDROOMS'}`);
            console.log(`Bathrooms: ${property.bathrooms || 'NO BATHROOMS'}`);
            console.log(`Size: ${property.size || 'NO SIZE'}`);
            console.log(`Description: ${property.description ? 'HAS DESCRIPTION' : 'NO DESCRIPTION'}`);
            console.log(`Community: ${property.community?.name || 'NO COMMUNITY'}`);
            console.log(`City: ${property.city?.name || 'NO CITY'}`);
            console.log(`Type: ${property.type?.name || 'NO TYPE'}`);
            console.log(`Offering Type: ${property.offeringType?.name || 'NO OFFERING TYPE'}`);
            console.log(`Agent: ${property.agent ? `${property.agent.firstName} ${property.agent.lastName}` : 'NO AGENT'}`);
            console.log(`Images: ${property.images?.length || 0} images`);
        });
        
    } catch (error) {
        console.error("Error fetching properties:", error);
    }
    
    process.exit(0);
}

checkLuxeProperties();
