#!/usr/bin/env bun

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Connection setup
const connection = postgres(process.env.DATABASE_URL!);
const db = drizzle(connection);

async function debugPropertyData() {
    console.log("=== DEBUG: Property Data Structure ===");
    
    try {
        // Query to examine the actual property data being returned
        const result = await db.execute(`
            WITH villa_for_rent AS (
                SELECT DISTINCT
                    p.id,
                    p.title,
                    p.type_id,
                    p.unit_type_id, 
                    pt.name as property_type_name,
                    pt.slug as property_type_slug,
                    ut.name as unit_type_name,
                    ut.slug as unit_type_slug,
                    ot.name as offering_type_name,
                    ot.slug as offering_type_slug
                FROM properties p
                JOIN property_types pt ON p.type_id = pt.id
                JOIN unit_types ut ON p.unit_type_id = ut.id  
                JOIN offering_types ot ON p.offering_type_id = ot.id
                WHERE pt.slug = 'villas'
                    AND ot.slug = 'for-rent'
                LIMIT 5
            )
            SELECT * FROM villa_for_rent;
        `);
        
        console.log("Found", result.length, "villa properties for rent");
        console.log("\n=== Property Data Details ===");
        
        result.forEach((property, index) => {
            console.log(`\n--- Property ${index + 1} ---`);
            console.log("Title:", property.title);
            console.log("Property Type ID:", property.type_id);
            console.log("Property Type Name:", property.property_type_name);
            console.log("Property Type Slug:", property.property_type_slug);
            console.log("Unit Type ID:", property.unit_type_id);
            console.log("Unit Type Name:", property.unit_type_name);
            console.log("Unit Type Slug:", property.unit_type_slug);
            console.log("Offering Type Name:", property.offering_type_name);
            console.log("Offering Type Slug:", property.offering_type_slug);
        });

        // Also check what the get-properties-server function is actually returning
        console.log("\n=== Check Actual API Response Structure ===");
        
        // This should match what the frontend receives
        const frontendQuery = await db.execute(`
            SELECT 
                p.id,
                p.title,
                p.description,
                p.price,
                p.size,
                p.bedrooms,
                p.bathrooms,
                p.slug,
                -- Check which type field is being selected in the actual query
                json_build_object(
                    'id', pt.id,
                    'name', pt.name,
                    'slug', pt.slug
                ) as type,
                json_build_object(
                    'id', ut.id, 
                    'name', ut.name,
                    'slug', ut.slug
                ) as unit_type,
                json_build_object(
                    'id', ot.id,
                    'name', ot.name,
                    'slug', ot.slug
                ) as offering_type
            FROM properties p
            JOIN property_types pt ON p.type_id = pt.id
            JOIN unit_types ut ON p.unit_type_id = ut.id
            JOIN offering_types ot ON p.offering_type_id = ot.id
            WHERE pt.slug = 'villas'
                AND ot.slug = 'for-rent'
            LIMIT 2;
        `);
        
        console.log("\nFrontend will receive:");
        frontendQuery.forEach((prop, index) => {
            console.log(`\n--- Frontend Property ${index + 1} ---`);
            console.log("Title:", prop.title);
            console.log("Type object:", JSON.stringify(prop.type, null, 2));
            console.log("Unit Type object:", JSON.stringify(prop.unit_type, null, 2));
            console.log("Offering Type object:", JSON.stringify(prop.offering_type, null, 2));
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await connection.end();
    }
}

debugPropertyData();
