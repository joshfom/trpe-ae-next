import { db } from "./db/drizzle";
import { propertyTypeTable } from "./db/schema/property-type-table";
import { unitTypeTable } from "./db/schema/unit-type-table";
import { propertyTable } from "./db/schema/property-table";
import { offeringTypeTable } from "./db/schema/offering-type-table";
import { eq, and } from "drizzle-orm";

async function debugPropertyTypes() {
    console.log("=== DEBUG: Property Types Issue ===\n");
    
    // 1. Check property types
    console.log("1. Property Types in database:");
    const propertyTypes = await db.select({
        id: propertyTypeTable.id,
        name: propertyTypeTable.name,
        slug: propertyTypeTable.slug
    }).from(propertyTypeTable);
    console.table(propertyTypes);
    
    // 2. Check unit types  
    console.log("\n2. Unit Types in database:");
    const unitTypes = await db.select({
        id: unitTypeTable.id,
        name: unitTypeTable.name,
        slug: unitTypeTable.slug
    }).from(unitTypeTable);
    console.table(unitTypes);
    
    // 3. Check offering types
    console.log("\n3. Offering Types in database:");
    const offeringTypes = await db.select({
        id: offeringTypeTable.id,
        name: offeringTypeTable.name,
        slug: offeringTypeTable.slug
    }).from(offeringTypeTable);
    console.table(offeringTypes);
    
    // 4. Check a few sample properties 
    console.log("\n4. Sample properties:");
    const sampleProperties = await db.select({
        id: propertyTable.id,
        title: propertyTable.title,
        typeId: propertyTable.typeId,
        unitTypeId: propertyTable.unitTypeId,
        offeringTypeId: propertyTable.offeringTypeId
    }).from(propertyTable).limit(5);
    
    console.table(sampleProperties);
    
    // 5. Count properties by type and offering
    console.log("\n5. Property counts:");
    
    // Check how many properties exist for each offering type
    for (const offering of offeringTypes) {
        const count = await db.select().from(propertyTable).where(eq(propertyTable.offeringTypeId, offering.id));
        console.log(`${offering.name} (${offering.slug}): ${count.length} properties`);
    }
    
    // Check how many properties exist for each property type
    for (const propType of propertyTypes) {
        const count = await db.select().from(propertyTable).where(eq(propertyTable.typeId, propType.id));
        console.log(`${propType.name} (${propType.slug}): ${count.length} properties`);
    }
    
    process.exit(0);
}

debugPropertyTypes().catch(console.error);
