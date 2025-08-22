#!/usr/bin/env bun

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { unitTypeTable } from "@/db/schema/unit-type-table";
import { eq } from "drizzle-orm";

const connection = postgres(process.env.DATABASE_URL!);
const db = drizzle(connection);

async function debugUnitTypeLookup() {
    console.log("=== DEBUG: Unit Type Lookup ===");
    
    try {
        // Check what happens when we look up "villas" in unit_types table
        console.log('Looking up "villas" in unit_types table...');
        const villasResult = await db
            .select({ id: unitTypeTable.id, name: unitTypeTable.name, slug: unitTypeTable.slug })
            .from(unitTypeTable)
            .where(eq(unitTypeTable.slug, "villas"));
        
        console.log("Result for 'villas':", villasResult);
        
        // Check what happens when we look up "villa" (singular)
        console.log('\nLooking up "villa" in unit_types table...');
        const villaResult = await db
            .select({ id: unitTypeTable.id, name: unitTypeTable.name, slug: unitTypeTable.slug })
            .from(unitTypeTable)
            .where(eq(unitTypeTable.slug, "villa"));
        
        console.log("Result for 'villa':", villaResult);
        
        // Check what happens when we look up "apartments"
        console.log('\nLooking up "apartments" in unit_types table...');
        const apartmentsResult = await db
            .select({ id: unitTypeTable.id, name: unitTypeTable.name, slug: unitTypeTable.slug })
            .from(unitTypeTable)
            .where(eq(unitTypeTable.slug, "apartments"));
        
        console.log("Result for 'apartments':", apartmentsResult);
        
        // Show all unit types
        console.log('\nAll unit types:');
        const allUnitTypes = await db
            .select({ id: unitTypeTable.id, name: unitTypeTable.name, slug: unitTypeTable.slug })
            .from(unitTypeTable);
        
        allUnitTypes.forEach(ut => {
            console.log(`- ${ut.name} (slug: ${ut.slug}, id: ${ut.id})`);
        });
        
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await connection.end();
    }
}

debugUnitTypeLookup();
