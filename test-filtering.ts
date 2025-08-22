import { db } from "./db/drizzle";
import { propertyTypeTable } from "./db/schema/property-type-table";
import { unitTypeTable } from "./db/schema/unit-type-table";
import { propertyTable } from "./db/schema/property-table";
import { offeringTypeTable } from "./db/schema/offering-type-table";
import { eq, and } from "drizzle-orm";

async function testPropertyTypeFiltering() {
    console.log("=== Testing /property-types/villas/for-rent filtering ===\n");
    
    // 1. Check what happens when we query for propertyType="villas"
    console.log("1. Looking for propertyType 'villas':");
    const propertyType = await db.query.propertyTypeTable.findFirst({
        where: eq(propertyTypeTable.slug, "villas")
    });
    console.log("Property Type found:", propertyType);
    
    // 2. Check what happens when we query for unitType="villas" 
    console.log("\n2. Looking for unitType 'villas':");
    const unitType = await db.query.unitTypeTable.findFirst({
        where: eq(unitTypeTable.slug, "villas")
    });
    console.log("Unit Type found:", unitType);
    
    // 3. Check offering type for-rent
    console.log("\n3. Looking for offeringType 'for-rent':");
    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, "for-rent")
    });
    console.log("Offering Type found:", offeringType);
    
    // 4. Now let's test what the current query logic would find
    console.log("\n4. Testing current query logic:");
    
    // This mimics the logic in getPropertiesServer when propertyType="villas"
    const unitTypeId = propertyType?.id; // This would be null since propertyType maps to property_types table, not unit_types
    const propertyTypeId = propertyType?.id; // This would work
    const offeringTypeId = offeringType?.id;
    
    console.log("unitTypeId (using propertyType):", unitTypeId);
    console.log("propertyTypeId:", propertyTypeId);
    console.log("offeringTypeId:", offeringTypeId);
    
    // Query with property type filter (correct way)
    if (propertyTypeId && offeringTypeId) {
        const propertiesWithPropertyType = await db.select({
            id: propertyTable.id,
            title: propertyTable.title,
            typeId: propertyTable.typeId,
            unitTypeId: propertyTable.unitTypeId,
            offeringTypeId: propertyTable.offeringTypeId
        })
        .from(propertyTable)
        .where(and(
            eq(propertyTable.typeId, propertyTypeId),
            eq(propertyTable.offeringTypeId, offeringTypeId)
        ))
        .limit(5);
        
        console.log("\n5. Properties filtered by property type + offering type:", propertiesWithPropertyType.length);
        propertiesWithPropertyType.forEach(prop => {
            console.log(`- ${prop.title || 'Untitled'}`);
        });
    }
    
    // Query with unit type filter (wrong way - but what might be happening)
    const correctUnitType = await db.query.unitTypeTable.findFirst({
        where: eq(unitTypeTable.slug, "villa") // Note: singular, not plural
    });
    
    if (correctUnitType && offeringTypeId) {
        const propertiesWithUnitType = await db.select({
            id: propertyTable.id,
            title: propertyTable.title,
            typeId: propertyTable.typeId,
            unitTypeId: propertyTable.unitTypeId,
            offeringTypeId: propertyTable.offeringTypeId
        })
        .from(propertyTable)
        .where(and(
            eq(propertyTable.unitTypeId, correctUnitType.id),
            eq(propertyTable.offeringTypeId, offeringTypeId)
        ))
        .limit(5);
        
        console.log("\n6. Properties filtered by unit type 'villa' + offering type:", propertiesWithUnitType.length);
        propertiesWithUnitType.forEach(prop => {
            console.log(`- ${prop.title || 'Untitled'}`);
        });
    }
    
    // 7. Let's see what apartments for rent look like
    const apartmentType = await db.query.propertyTypeTable.findFirst({
        where: eq(propertyTypeTable.slug, "apartments")
    });
    
    if (apartmentType && offeringTypeId) {
        const apartmentsForRent = await db.select({
            id: propertyTable.id,
            title: propertyTable.title,
            typeId: propertyTable.typeId,
            unitTypeId: propertyTable.unitTypeId,
            offeringTypeId: propertyTable.offeringTypeId
        })
        .from(propertyTable)
        .where(and(
            eq(propertyTable.typeId, apartmentType.id),
            eq(propertyTable.offeringTypeId, offeringTypeId)
        ))
        .limit(5);
        
        console.log("\n7. Sample apartments for rent:", apartmentsForRent.length);
        apartmentsForRent.forEach(prop => {
            console.log(`- ${prop.title || 'Untitled'}`);
        });
    }
    
    process.exit(0);
}

testPropertyTypeFiltering().catch(console.error);
