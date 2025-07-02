"use server"
import { db } from "@/db/drizzle";
import { propertyTable } from "@/db/schema/property-table";
import { createId } from "@paralleldrive/cuid2";
import { eq, inArray, not, sql, and } from "drizzle-orm";
import { propertyImagesTable } from "@/db/schema/property-images-table";
import { importJobTable } from "@/db/schema/import-job-table";
import { subCommunityTable } from "@/db/schema/sub-community-table";
import { communityTable } from "@/db/schema/community-table";
import { cityTable } from "@/db/schema/city-table";
import { offeringTypeTable } from "@/db/schema/offering-type-table";
import { propertyTypeTable } from "@/db/schema/property-type-table";
import { propertyAmenityTable } from "@/db/schema/property-amenity-table";
import { amenityTable } from "@/db/schema/amenity-table";
import { employeeTable } from "@/db/schema/employee-table";
import { redirectTable } from "@/db/schema/redirect-table";
import slugify from "slugify";
import { convertToWebp, uploadPropertyImageToS3, deletePropertyImagesFromS3 } from "@/lib/xml-import/image-utils";

interface PhotoUrl {
    _: string;
    $: {
        last_update: string;
        watermark?: string;
    };
}

interface Photo {
    url: PhotoUrl[];
}

interface Agent {
    id: string[] | string;
    name: string[] | string;
    email: string[] | string;
    phone: string[] | string;
}

interface Property {
    [key: string]: string[] | string | Agent[] | Agent | Photo[] | undefined;
}

interface Data {
    list: {
        property: Property[];
    };
}

interface ImportStats {
    createdCount: number;
    updatedCount: number;
    skippedCount: number;
    failedCount: number;
    deletedCount: number;
    imageCount: number;
    noImagesSkippedCount: number;
    invalidPriceSkippedCount: number; // Added new stat for invalid prices
}

interface PropertyData {
    sub_community?: string;
    community?: string;
    city?: string;
    offering_type?: string;
    property_type?: string;
    building_name?: string;
    property_name?: string;
    reference_number: string;
    bedroom: string | number;
    bathroom?: string | number;
    title_en?: string;
    description_en?: string;
    price?: string;
    cheques?: string;
    completion_status?: string;
    furnished?: string;
    parking?: string;
    serviceCharge?: string;
    size?: string;
    plot_size?: string;
    floor?: string;
    permit_number?: string;
    last_update?: string;
    private_amenities?: string;
    is_featured?: string;
    is_exclusive?: string;
    [key: string]: any;
}

interface AgentData {
    email: string;
    name: string;
    phone: string;
}

interface PropertyOptions {
    propertyAgent: typeof employeeTable.$inferSelect;
    subCommunity: typeof subCommunityTable.$inferSelect | null;
    community: typeof communityTable.$inferSelect | null;
    city: typeof cityTable.$inferSelect | null;
    offeringType: typeof offeringTypeTable.$inferSelect | null;
    propertyType: typeof propertyTypeTable.$inferSelect | null;
    slug: string;
    lastUpdate: Date;
}

export async function saveXmlListing(url: string) {
    // Initialize statistics for tracking the import process
    const stats: ImportStats = {
        createdCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        failedCount: 0,
        deletedCount: 0,
        imageCount: 0,
        noImagesSkippedCount: 0,
        invalidPriceSkippedCount: 0, // Added new stat for invalid prices
    };

    // Add tracking for detailed skip reasons
    const detailedStats = {
        totalProcessed: 0,
        noImagesSkipped: 0,
        invalidPriceSkipped: 0,
        lastUpdateSkipped: 0,
        duplicatesSkipped: 0,
        insufficientImagesDeleted: 0,
        imageProcessingFailed: 0,
        successfullyProcessed: 0,
    };

    // Create an import job record to track the import process
    let [importJob] = await db.insert(importJobTable).values({
        id: createId(),
        startedAt: sql`now()`,
        status: 'running',
    }).returning();

    try {
        // Fetch and parse the XML feed
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch XML feed: ${response.status} ${response.statusText}`);
        }

        const data: Data = await response.json();

        // Parse the properties from the feed
        const processedListings = processListings(data);
        console.log(`📄 XML FEED ANALYSIS:`);
        console.log(`Total properties found in XML: ${data.list.property.length}`);
        console.log(`Successfully processed from XML: ${processedListings.length}`);
        console.log(`Difference: ${data.list.property.length - processedListings.length}`);

        // Track all reference numbers in this feed for cleanup later
        const feedReferenceNumbers: string[] = [];
        
        // Track duplicates within the feed - use permit_number + reference_number as unique key
        const seenPropertyKeys = new Set<string>();
        const duplicatePropertyKeys = new Set<string>();
        const skippedDuplicates = new Set<string>();

        // Process each property in the feed - no transaction wrapping
        for (const { newProperty, agent, photos } of processedListings) {
            detailedStats.totalProcessed++;
            console.log(`\n=== Processing property ${detailedStats.totalProcessed}/${processedListings.length}: ${newProperty.reference_number} ===`);
            
            try {
                // Skip properties without photos
                if (photos.length < 1) {
                    console.log(`❌ SKIPPED: No images (${photos.length} photos) - ${newProperty.reference_number}`);
                    stats.noImagesSkippedCount++;
                    detailedStats.noImagesSkipped++;
                    continue;
                }

                // Validate price: Skip if not a valid number or empty or less than 1
                console.log(`Processing property with reference: ${newProperty.reference_number}, original price: ${newProperty.price}`);
                
                const priceValue = validateAndParsePrice(newProperty.price);
                if (priceValue === null) {
                    console.log(`❌ SKIPPED: Invalid price (${newProperty.price}) - ${newProperty.reference_number}`);
                    stats.invalidPriceSkippedCount++;
                    detailedStats.invalidPriceSkipped++;
                    continue;
                }

                console.log(`Property ${newProperty.reference_number} price validated: ${priceValue}`);
                
                // Update the property with the validated price
                newProperty.price = priceValue.toString();

                // Extract permit number and reference number for tracking
                const permitNumber = newProperty.permit_number;
                
                // Track reference number for cleanup (with DXB- prefix to match database format)
                feedReferenceNumbers.push('DXB-' + newProperty.reference_number);
                
                // Create a unique key using only reference_number for duplicate detection
                const propertyKey = newProperty.reference_number;
                
                // Check for duplicates within the feed
                if (seenPropertyKeys.has(propertyKey)) {
                    duplicatePropertyKeys.add(propertyKey);
                    skippedDuplicates.add(newProperty.reference_number);
                    console.log(`❌ SKIPPED: DUPLICATE detected - ${newProperty.reference_number}`);
                    stats.skippedCount++;
                    detailedStats.duplicatesSkipped++;
                    continue;
                } else {
                    seenPropertyKeys.add(propertyKey);
                }

                // Parse last_update from the feed, handling both formats:
                // Format 1: "11/20/2024 12:50:23" (MM/DD/YYYY HH:MM:SS)
                // Format 2: "25-04-25 03:52:16" (DD-MM-YY HH:MM:SS)
                const lastUpdateStr = newProperty.last_update;
                let lastUpdate = new Date();

                if (lastUpdateStr) {
                    // Try to detect the format based on presence of "-" or "/"
                    if (lastUpdateStr.includes('-')) {
                        // Format: DD-MM-YY HH:MM:SS
                        const [datePart, timePart] = lastUpdateStr.split(' ');
                        const [day, month, shortYear] = datePart.split('-');
                        const fullYear = `20${shortYear}`; // Assume 20xx for the year

                        // Create a date string in ISO format: YYYY-MM-DDTHH:MM:SS
                        const isoDateString = `${fullYear}-${month}-${day}T${timePart}`;
                        lastUpdate = new Date(isoDateString);
                    } else {
                        // Format: MM/DD/YYYY HH:MM:SS
                        lastUpdate = new Date(lastUpdateStr);
                    }

                    // Fallback to current date if parsing failed
                    if (isNaN(lastUpdate.getTime())) {
                        console.warn(`Failed to parse date: ${lastUpdateStr}, using current date instead`);
                        lastUpdate = new Date();
                    }
                }

                // Process the agent - not using tx
                const propertyAgent = await processAgent(agent);

                // Process related entities - not using tx
                const subCommunity = await processSubCommunity(newProperty);
                const community = await processCommunity(newProperty);
                const city = await processCity(newProperty);
                const offeringType = await processOfferingType(newProperty);
                const propertyType = await processPropertyType(newProperty);

                // Generate the property slug
                const slug = generatePropertySlug(newProperty, subCommunity, community);

                // Check if the property already exists by reference number only
                const existingProperty = await db.query.propertyTable.findFirst({
                    where: eq(propertyTable.referenceNumber, 'DXB-' + newProperty.reference_number),
                });

                let property;

                if (existingProperty) {
                    // Property exists - check if we need to update it
                    const existingLastUpdate = existingProperty.lastUpdated
                        ? new Date(existingProperty.lastUpdated)
                        : null;

                    // Skip if the existing property is newer or same as the feed
                    if (existingLastUpdate && existingLastUpdate >= lastUpdate) {
                        console.log(`❌ SKIPPED: Last update check failed - ${newProperty.reference_number} (existing: ${existingLastUpdate}, feed: ${lastUpdate})`);
                        stats.skippedCount++;
                        detailedStats.lastUpdateSkipped++;
                        continue;
                    }

                    // Update the property with new data
                    [property] = await updateProperty(
                        existingProperty.id,
                        newProperty,
                        {
                            propertyAgent,
                            subCommunity,
                            community,
                            city,
                            offeringType,
                            propertyType,
                            slug,
                            lastUpdate,
                        }
                    );

                    // Delete existing property images (both DB records and S3 files)
                    await deletePropertyImages(existingProperty.id);

                    stats.updatedCount++;
                } else {
                    // Create a new property
                    [property] = await createProperty(
                        newProperty,
                        {
                            propertyAgent,
                            subCommunity,
                            community,
                            city,
                            offeringType,
                            propertyType,
                            slug,
                            lastUpdate,
                        }
                    );

                    stats.createdCount++;
                }

                // Process amenities
                await processAmenities(property.id, newProperty);

                // Process and upload images
                await processImages(property.id, photos);
                stats.imageCount += photos.length;
                
                console.log(`✅ SUCCESS: Property processed successfully - ${newProperty.reference_number}`);
                detailedStats.successfullyProcessed++;

            } catch (error) {
                console.error(`❌ FAILED: Error processing property ${newProperty.reference_number}:`, error);
                
                // Check if it's an insufficient images error
                if (error instanceof Error && error.message.includes('insufficient images')) {
                    detailedStats.insufficientImagesDeleted++;
                } else {
                    detailedStats.imageProcessingFailed++;
                }
                
                stats.failedCount++;
            }
        }

        // Clean up properties not in the feed (if the feed has properties)
        if (feedReferenceNumbers.length > 0) {
            const deletedProperties = await cleanupRemovedProperties(feedReferenceNumbers);
            stats.deletedCount = deletedProperties.length;
        }

        // Update the import job with the final statistics
        await db.update(importJobTable).set({
            status: 'completed',
            failedCount: stats.failedCount,
            importedCount: stats.createdCount + stats.updatedCount,
            updatedCount: stats.updatedCount,
            finishedAt: sql`now()`,
        }).where(
            eq(importJobTable.id, importJob.id)
        );

        // Log detailed statistics
        console.log(`\n=== IMPORT SUMMARY ===`);
        console.log(`Total properties in feed: ${processedListings.length}`);
        console.log(`Total processed: ${detailedStats.totalProcessed}`);
        console.log(`✅ Successfully processed: ${detailedStats.successfullyProcessed}`);
        console.log(`❌ Skipped - No images: ${detailedStats.noImagesSkipped}`);
        console.log(`❌ Skipped - Invalid price: ${detailedStats.invalidPriceSkipped}`);
        console.log(`❌ Skipped - Last update: ${detailedStats.lastUpdateSkipped}`);
        console.log(`❌ Skipped - Duplicates: ${detailedStats.duplicatesSkipped}`);
        console.log(`❌ Failed - Insufficient images: ${detailedStats.insufficientImagesDeleted}`);
        console.log(`❌ Failed - Image processing: ${detailedStats.imageProcessingFailed}`);
        console.log(`📊 Created: ${stats.createdCount}, Updated: ${stats.updatedCount}, Deleted: ${stats.deletedCount}`);
        
        if (duplicatePropertyKeys.size > 0) {
            console.log(`\n🔄 DUPLICATE KEYS FOUND:`);
            duplicatePropertyKeys.forEach(key => console.log(`  - ${key}`));
        }
        
        if (skippedDuplicates.size > 0) {
            console.log(`\n⏭️ SKIPPED DUPLICATE REFERENCES:`);
            skippedDuplicates.forEach(ref => console.log(`  - ${ref}`));
        }

        return {
            success: true,
            stats,
            detailedStats,
            jobId: importJob.id,
        };

    } catch (error: unknown) {
        console.error('Error in XML import process:', error);

        // Update the import job with the error status
        await db.update(importJobTable).set({
            status: 'failed',
            failedCount: stats.failedCount,
            importedCount: stats.createdCount + stats.updatedCount,
            updatedCount: stats.updatedCount,
            finishedAt: sql`now()`,
        }).where(
            eq(importJobTable.id, importJob.id)
        );

        // Type guard for error.message
        const errorMessage = error instanceof Error ? error.message : String(error);

        return {
            success: false,
            error: errorMessage,
            jobId: importJob.id,
        };
    }
}

// New function to validate and parse price
function validateAndParsePrice(priceStr: string | undefined): number | null {
    // Return null if price is undefined or empty
    if (!priceStr || priceStr.trim() === '') {
        return null;
    }

    // Remove any non-numeric characters (except decimal point)
    // This helps handle prices with currency symbols or commas
    const cleanedPrice = priceStr.replace(/[^0-9.]/g, '');
    
    // Try to parse as integer (using parseFloat first in case there's a decimal)
    const price = parseInt(parseFloat(cleanedPrice).toString(), 10);

    // Return null if not a valid number or less than 1
    if (isNaN(price) || price < 1) {
        console.log(`Invalid price detected: ${priceStr} (parsed as: ${price})`);
        return null;
    }

    return price;
}

// Extract price from potentially nested structure
function extractPrice(priceData: any): string | undefined {
    if (!priceData) return undefined;
    
    // If it's a direct string value
    if (typeof priceData === 'string') {
        return priceData;
    }
    
    // If it's an array (most common case)
    if (Array.isArray(priceData)) {
        const firstItem = priceData[0];
        
        // Simple string price: ["3500000"]
        if (typeof firstItem === 'string') {
            return firstItem;
        }
        
        // Nested object price: [{ yearly: ["210000"] }]
        if (typeof firstItem === 'object' && firstItem !== null) {
            // Check for yearly price specifically
            if (firstItem.yearly && Array.isArray(firstItem.yearly)) {
                return firstItem.yearly[0];
            }
            
            // Future-proofing: Check for any other nested property with price
            for (const key in firstItem) {
                if (Array.isArray(firstItem[key]) && firstItem[key].length > 0) {
                    return firstItem[key][0];
                }
            }
        }
    }
    
    // If it's an object with nested prices (less common)
    if (typeof priceData === 'object' && priceData !== null) {
        // Check for yearly price
        if (priceData.yearly && Array.isArray(priceData.yearly)) {
            return priceData.yearly[0];
        }
        
        // Check other possible nested values
        for (const key in priceData) {
            if (Array.isArray(priceData[key]) && priceData[key].length > 0) {
                return priceData[key][0];
            }
        }
    }
    
    return undefined;
}

// Helper function to process the listings from the feed
function processListings(data: Data) {
    return data.list.property.map((property: Property) => {
        const newProperty: PropertyData = { reference_number: '', bedroom: 0 };
        let agent: AgentData = { email: '', name: '', phone: '' };
        let photos: string[] = [];

        Object.entries(property).forEach(([key, value]) => {
            // Handle agent data
            if (key === 'agent') {
                if (Array.isArray(value) && typeof value[0] === 'object') {
                    // Format 1: agent is an array of objects
                    const agentObj = value[0] as Agent;
                    agent = {
                        email: Array.isArray(agentObj.email) ? agentObj.email[0] : agentObj.email as string,
                        name: Array.isArray(agentObj.name) ? agentObj.name[0] : agentObj.name as string,
                        phone: Array.isArray(agentObj.phone) ? agentObj.phone[0] : agentObj.phone as string
                    };
                } else if (typeof value === 'object' && value !== null) {
                    // Format 2: agent is a single object
                    const agentObj = value as Agent;
                    agent = {
                        email: Array.isArray(agentObj.email) ? agentObj.email[0] : agentObj.email as string,
                        name: Array.isArray(agentObj.name) ? agentObj.name[0] : agentObj.name as string,
                        phone: Array.isArray(agentObj.phone) ? agentObj.phone[0] : agentObj.phone as string
                    };
                }
            }
            // Handle photo data
            else if (key === 'photo') {
                if (Array.isArray(value) && typeof value[0] === 'object' && 'url' in value[0]) {
                    // Format 1: photo.url is an array of PhotoUrl objects
                    photos = Array.isArray(value[0].url) ? value[0].url.map((photo: PhotoUrl) => photo._) : [];
                } else if (typeof value === 'object' && value !== null && 'url' in value) {
                    // Format 2: photo is a single object with url property
                    const photoObj = value as Photo;
                    photos = Array.isArray(photoObj.url) ? photoObj.url.map((photo: PhotoUrl) => photo._) : [];
                }
            }
            // Special handling for price - it might be nested
            else if (key === 'price') {
                // Use our special price extraction function
                newProperty[key] = extractPrice(value);
            }
            // Handle regular property fields
            else {
                if (Array.isArray(value)) {
                    // Format 1: property fields are arrays of values
                    newProperty[key] = value[0];
                } else if (typeof value === 'string') {
                    // Format 2: property fields are direct string values
                    newProperty[key] = value;
                } else {
                    // Handle other cases
                    newProperty[key] = value;
                }
            }
        });

        // Ensure property_name is assigned to building_name if available
        if (!newProperty.building_name && newProperty.property_name) {
            newProperty.building_name = newProperty.property_name;
        }

        return { newProperty, agent, photos };
    });
}

// Process and store agent information
async function processAgent(agent: AgentData): Promise<typeof employeeTable.$inferSelect> {
    let agentEmail = agent.email;

    // Handle specific agent email mapping (if needed)
    if (agentEmail === 's.nazemi@trpe.ae') {
        agentEmail = 'j.cunanan@trpe.ae';
    }

    // Find an existing agent or create a new one
    let [propertyAgent] = await db.select().from(employeeTable).where(
        eq(employeeTable.email, agentEmail)
    ).limit(1);

    if (!propertyAgent) {
        let agentSlug = agent.name.toLowerCase().replace(/ /g, '-');
        let firstName = agent.name.split(' ')[0];
        let lastName = agent.name.split(' ')[1] || '';

        [propertyAgent] = await db.insert(employeeTable).values({
            id: createId(),
            firstName: firstName,
            lastName: lastName,
            email: agent.email,
            phone: agent.phone,
            slug: agentSlug,
        }).returning();
    }

    return propertyAgent;
}

// Process and store sub-community information
async function processSubCommunity(newProperty: PropertyData) {
    if (!newProperty.sub_community) {
        return null;
    }

    // Check if the sub-community already exists
    let [subCommunity] = await db.select().from(subCommunityTable).where(
        eq(subCommunityTable.name, newProperty.sub_community)
    ).limit(1);

    // Generate a slug for the sub-community
    let subCommunitySlug = newProperty.sub_community.toLowerCase().replace(/ /g, '-');

    // Create if it doesn't exist
    if (!subCommunity) {
        [subCommunity] = await db.insert(subCommunityTable).values({
            id: createId(),
            slug: subCommunitySlug,
            name: newProperty.sub_community,
            label: newProperty.sub_community,
        }).returning();
    }

    return subCommunity;
}

// Process and store community information
async function processCommunity(newProperty: PropertyData) {
    if (!newProperty.community) {
        return null;
    }

    // Check if the community already exists
    let [community] = await db.select().from(communityTable).where(
        eq(sql`lower(${communityTable.name})`, newProperty.community.toLowerCase())
    ).limit(1);

    // Generate a slug for the community
    let communitySlug = newProperty.community.toLowerCase().replace(/ /g, '-');

    // Create if it doesn't exist
    if (!community) {
        [community] = await db.insert(communityTable).values({
            id: createId(),
            slug: communitySlug,
            name: newProperty.community,
            label: newProperty.community,
        }).returning();
    }

    return community;
}

// Process and store city information
async function processCity(newProperty: PropertyData) {
    if (!newProperty.city) {
        return null;
    }

    // Check if the city already exists
    let [city] = await db.select().from(cityTable).where(
        eq(cityTable.name, newProperty.city)
    ).limit(1);

    // Generate a slug for the city
    let citySlug = newProperty.city.toLowerCase().replace(/ /g, '-');

    // Create if it doesn't exist
    if (!city) {
        [city] = await db.insert(cityTable).values({
            id: createId(),
            slug: citySlug,
            name: newProperty.city,
        }).returning();
    }

    return city;
}

// Process and store offering type information
async function processOfferingType(newProperty: PropertyData) {
    if (!newProperty.offering_type) {
        return null;
    }

    // Check if the offering type already exists
    let [offeringType] = await db.select().from(offeringTypeTable).where(
        eq(offeringTypeTable.short_name, newProperty.offering_type)
    ).limit(1);

    // Generate a slug for the offering type
    let offeringTypeSlug = newProperty.offering_type.toLowerCase().replace(/ /g, '-');

    // Create if it doesn't exist
    if (!offeringType) {
        [offeringType] = await db.insert(offeringTypeTable).values({
            id: createId(),
            slug: offeringTypeSlug,
            short_name: newProperty.offering_type,
        }).returning();
    }

    return offeringType;
}

// Process and store property type information
async function processPropertyType(newProperty: PropertyData) {
    if (!newProperty.property_type) {
        return null;
    }

    // Check if the property type already exists
    let [propertyType] = await db.select().from(propertyTypeTable).where(
        eq(propertyTypeTable.short_name, newProperty.property_type)
    ).limit(1);

    // Generate a slug for the property type
    let propertyTypeSlug = newProperty.property_type.toLowerCase().replace(/ /g, '-');

    // Create if it doesn't exist
    if (!propertyType) {
        [propertyType] = await db.insert(propertyTypeTable).values({
            id: createId(),
            slug: propertyTypeSlug,
            short_name: newProperty.property_type,
        }).returning();
    }

    return propertyType;
}

// Generate a slug for the property
function generatePropertySlug(
    newProperty: PropertyData,
    subCommunity: { name: string | null } | null,
    community: { name: string | null } | null
): string {
    let isStudio = typeof newProperty.bedroom === 'string'
        ? newProperty.bedroom === "Studio"
        : (newProperty.bedroom < 1);
    let buildingSlug = newProperty.building_name ? newProperty.building_name.toLowerCase().replace(/ /g, '-') : '';
    let subComSlug = subCommunity?.name ? subCommunity.name.toLowerCase().replace(/ /g, '-') : '';
    let communitySlug = community?.name ? community.name.toLowerCase().replace(/ /g, '-') : '';

    let rawSlug = `${newProperty.bedroom}-${isStudio ? 'studio' : 'bedrooms'}${buildingSlug && ' ' + buildingSlug}${subComSlug && '-' + subComSlug}${communitySlug && ' ' + communitySlug}-${'dubai-dxb-' + newProperty.reference_number}`;

    return slugify(rawSlug, {
        lower: true,
        strict: true,
        replacement: '-',
    });
}

// Update an existing property
async function updateProperty(
    propertyId: string,
    newProperty: PropertyData,
    options: PropertyOptions
) {
    const {
        propertyAgent,
        subCommunity,
        community,
        city,
        offeringType,
        propertyType,
        slug,
        lastUpdate,
    } = options;

    let size = newProperty.size ? (parseInt(newProperty.size) * 100) : null;
    let plot_size = newProperty.plot_size ? (parseInt(newProperty.plot_size) * 100) : null;
    let bedroom = isNaN(Number(newProperty.bedroom)) ? 0 : Number(newProperty.bedroom);

    // The price has already been validated with validateAndParsePrice in the main processing loop
    const priceValue = parseInt(newProperty.price!);

    // Handle featured and exclusive flags
    const isFeatured = newProperty.is_featured === 'YES' || newProperty.is_featured === '1';
    const isExclusive = newProperty.is_exclusive === 'YES' || newProperty.is_exclusive === '1';
    
    // Mark as luxe if price is above 20,000,000
    const isLuxe = priceValue > 20000000;

    return await db.update(propertyTable).set({
        title: newProperty.title_en,
        description: newProperty.description_en,
        price: priceValue,
        bedrooms: bedroom,
        bathrooms: newProperty.bathroom ? Number(newProperty.bathroom) : null,
        agentId: propertyAgent.id,
        cheques: newProperty.cheques,
        completionStatus: newProperty.completion_status,
        furnished: newProperty.furnished,
        parking: newProperty.parking,
        subCommunityId: subCommunity?.id,
        imported: true,
        communityId: community?.id,
        cityId: city?.id,
        offeringTypeId: offeringType?.id,
        typeId: propertyType?.id,
        unitTypeId: propertyType?.id,
        serviceCharge: newProperty.serviceCharge,
        size: size,
        plotSize: plot_size,
        floor: newProperty.floor,
        referenceNumber: 'DXB-' + newProperty.reference_number,
        permitNumber: newProperty.permit_number,
        slug,
        isFeatured: isFeatured,
        isExclusive: isExclusive,
        isLuxe: isLuxe,
        lastUpdated: lastUpdate.toISOString(),
        updatedAt: sql`now()`,
    }).where(
        eq(propertyTable.id, propertyId)
    ).returning();
}

// Create a new property
async function createProperty(
    newProperty: PropertyData,
    options: PropertyOptions
) {
    const {
        propertyAgent,
        subCommunity,
        community,
        city,
        offeringType,
        propertyType,
        slug,
        lastUpdate,
    } = options;

    let size = newProperty.size ? parseInt(newProperty.size) : null;
    let plot_size = newProperty.plot_size ? parseInt(newProperty.plot_size) : null;
    let bedroom = isNaN(Number(newProperty.bedroom)) ? 0 : Number(newProperty.bedroom);

    // The price has already been validated with validateAndParsePrice in the main processing loop
    const priceValue = parseInt(newProperty.price!);

    // Handle featured and exclusive flags
    const isFeatured = newProperty.is_featured === 'YES' || newProperty.is_featured === '1';
    const isExclusive = newProperty.is_exclusive === 'YES' || newProperty.is_exclusive === '1';
    
    // Mark as luxe if price is above 20,000,000
    const isLuxe = priceValue > 20000000;

    return await db.insert(propertyTable).values({
        id: createId(),
        title: newProperty.title_en,
        description: newProperty.description_en,
        price: priceValue,
        bedrooms: bedroom,
        bathrooms: newProperty.bathroom ? Number(newProperty.bathroom) : null,
        agentId: propertyAgent.id,
        cheques: newProperty.cheques,
        completionStatus: newProperty.completion_status,
        furnished: newProperty.furnished,
        parking: newProperty.parking,
        subCommunityId: subCommunity?.id,
        imported: true,
        communityId: community?.id,
        cityId: city?.id,
        offeringTypeId: offeringType?.id,
        typeId: propertyType?.id,
        unitTypeId: propertyType?.id,
        serviceCharge: newProperty.serviceCharge,
        size: size,
        plotSize: plot_size,
        floor: newProperty.floor,
        referenceNumber: 'DXB-' + newProperty.reference_number,
        permitNumber: newProperty.permit_number,
        slug,
        isFeatured: isFeatured,
        isExclusive: isExclusive,
        isLuxe: isLuxe,
        status: 'published',
        lastUpdated: lastUpdate.toISOString(),
    }).returning();
}

// Process and store property amenities
async function processAmenities(propertyId: string, newProperty: PropertyData) {
    // Extract amenities from the property data
    let amenities = newProperty.private_amenities ? newProperty.private_amenities.split(',') : [];

    // Delete existing property amenities
    await db.delete(propertyAmenityTable).where(
        eq(propertyAmenityTable.propertyId, propertyId)
    );

    // Process each amenity
    for (const amenity of amenities) {
        let [amenityModel] = await db.select().from(amenityTable).where(
            eq(amenityTable.slug, amenity)
        ).limit(1);

        if (!amenityModel) {
            [amenityModel] = await db.insert(amenityTable).values({
                id: createId(),
                slug: amenity,
            }).returning();
        }

        // Insert the property-amenity relationship
        await db.insert(propertyAmenityTable).values({
            id: createId(),
            propertyId: propertyId,
            amenityId: amenityModel?.id,
        });
    }
}

// Process and upload property images
async function processImages(propertyId: string, photoUrls: string[]) {
    const validImages: string[] = [];

    for (const photoUrl of photoUrls) {
        try {
            const index = photoUrls.indexOf(photoUrl);

            // Log the original URL for debugging
            console.log(`Processing image URL: ${photoUrl}`);

            // Convert image to WebP format
            const webpBuffer = await convertToWebp(photoUrl);

            // Upload the WebP image to S3
            const s3Url = await uploadPropertyImageToS3(webpBuffer, propertyId, index);

            // Log the new S3 URL for debugging
            console.log(`Image uploaded to S3: ${s3Url}`);

            // Store the image record in the database
            await db.insert(propertyImagesTable).values({
                id: createId(),
                propertyId: propertyId,
                crmUrl: photoUrl,
                s3Url: s3Url,
                order: index,
            });

            validImages.push(photoUrl);
        } catch (error) {
            console.error(`Error processing image ${photoUrl}:`, error);
            // Skip problematic images
        }
    }

    // If the property has less than 5 valid images, delete the property and its images
    if (validImages.length < 5) {
        console.warn(`❌ INSUFFICIENT IMAGES: Property ${propertyId} has ${validImages.length} valid images (minimum 5 required). Deleting property.`);

        // Delete property images
        await deletePropertyImages(propertyId);

        // Delete the property
        await db.delete(propertyTable).where(
            eq(propertyTable.id, propertyId)
        );

        throw new Error(`Property ${propertyId} deleted due to insufficient images.`);
    }
}

// Delete property images (both DB records and S3 files)
async function deletePropertyImages(propertyId: string) {
    // Get existing images
    const existingImages = await db.select({
        id: propertyImagesTable.id,
        s3Url: propertyImagesTable.s3Url,
    }).from(propertyImagesTable).where(
        eq(propertyImagesTable.propertyId, propertyId)
    );

    // Delete images from S3 if they exist
    const s3Urls = existingImages
        .map(img => img.s3Url)
        .filter((url): url is string => url !== null);

    if (s3Urls.length > 0) {
        await deletePropertyImagesFromS3(s3Urls);
    }

    // Delete image records from the database
    await db.delete(propertyImagesTable).where(
        eq(propertyImagesTable.propertyId, propertyId)
    );
}

// Clean up properties that are no longer in the feed
async function cleanupRemovedProperties(feedReferenceNumbers: string[]) {
    console.log(`\n=== CLEANUP ANALYSIS ===`);
    console.log(`Feed reference numbers count: ${feedReferenceNumbers.length}`);
    console.log(`Sample feed reference numbers:`, feedReferenceNumbers.slice(0, 5));
    
    // Find properties not present in the feed by reference number
    const removedProperties = await db.select({
        id: propertyTable.id,
        slug: propertyTable.slug,
        referenceNumber: propertyTable.referenceNumber,
        offeringTypeId: propertyTable.offeringTypeId,
    }).from(propertyTable).where(
        not(inArray(propertyTable.referenceNumber,
            feedReferenceNumbers.filter(Boolean) as string[]
        ))
    );

    console.log(`Properties to be deleted: ${removedProperties.length}`);
    console.log(`Sample properties to delete:`, removedProperties.slice(0, 5).map(p => p.referenceNumber));

    // Get offering types for the redirect URLs
    const offeringTypes = await db.select().from(offeringTypeTable).where(
        inArray(
            offeringTypeTable.id,
            removedProperties
                .map(p => p.offeringTypeId)
                .filter((id): id is string => id !== null)
        )
    );

    const offeringTypeMap: Record<string, typeof offeringTypeTable.$inferSelect> = {};

    offeringTypes.forEach(type => {
        if (type.id) {
            offeringTypeMap[type.id] = type;
        }
    });

    // Process each removed property
    for (const property of removedProperties) {
        try {
            // Get the offering type slug for the redirect URL
            const offeringType = property.offeringTypeId
                ? offeringTypeMap[property.offeringTypeId]
                : null;

            const offeringTypeSlug = offeringType?.slug || 'buy';

            // Add a 410 redirect for the property
            await db.insert(redirectTable).values({
                id: createId(),
                fromUrl: `/properties/${offeringTypeSlug}/${property.slug}`,
                statusCode: '410',
                isActive: 'yes',
            });

            // Delete property images
            await deletePropertyImages(property.id);

            // Delete property amenities
            await db.delete(propertyAmenityTable).where(
                eq(propertyAmenityTable.propertyId, property.id)
            );

            // Delete the property
            await db.delete(propertyTable).where(
                eq(propertyTable.id, property.id)
            );
        } catch (error) {
            console.error(`Error cleaning up property ${property.id}:`, error);
            // Continue with other properties even if one fails
        }
    }

    return removedProperties;
}

// Helper function to strip HTML tags from strings
function stripHtmlTags(str: string): string {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
}