// app/api/xml/route.ts
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { parsePropertyDescription, extractFeaturesList, extractSearchableText } from '@/lib/property-description-parser';

// For static export compatibility
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

/**
 * Process listings to enhance descriptions
 */
function processListings(jsonData: any) {
    if (!jsonData?.list?.property) return jsonData;
    
    const properties = Array.isArray(jsonData.list.property) 
        ? jsonData.list.property 
        : [jsonData.list.property];
    
    const processedProperties = properties.map((property: any) => {
        if (property.description_en && Array.isArray(property.description_en) && property.description_en[0]) {
            const originalDescription = property.description_en[0];
            
            // Parse the description into TipTap format
            const tiptapContent = parsePropertyDescription(originalDescription);
            
            // Extract features and connectivity for easy access
            const { features, connectivity } = extractFeaturesList(originalDescription);
            
            // Create searchable text
            const searchableText = extractSearchableText(originalDescription);
            
            return {
                ...property,
                description_en: [originalDescription], // Keep original
                description_structured: tiptapContent, // TipTap format for editor
                property_features: features, // Easy access to features list
                connectivity_info: connectivity, // Easy access to connectivity list
                searchable_description: searchableText, // Clean text for search
                description_metadata: {
                    has_features: features.length > 0,
                    has_connectivity: connectivity.length > 0,
                    feature_count: features.length,
                    connectivity_count: connectivity.length,
                    processed_at: new Date().toISOString()
                }
            };
        }
        
        return property;
    });
    
    return {
        ...jsonData,
        list: {
            ...jsonData.list,
            property: Array.isArray(jsonData.list.property) 
                ? processedProperties 
                : processedProperties[0]
        },
        processing_info: {
            total_properties: processedProperties.length,
            properties_with_structured_descriptions: processedProperties.filter((p: any) => p.description_structured).length,
            processed_at: new Date().toISOString()
        }
    };
}

export async function GET() {
    const xmlUrl = 'https://youtupia.net/trpe/website/full.xml';

    try {
        const response = await fetch(xmlUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const xmlText = await response.text();
        const jsonData = await parseStringPromise(xmlText);
        
        // Process the listings to enhance descriptions
        const processedData = processListings(jsonData);

        return NextResponse.json(processedData);
    } catch (error) {
        console.error('Error fetching or parsing XML:', error);
        return NextResponse.json({ error: 'Failed to fetch and parse XML' }, { status: 500 });
    }
}
