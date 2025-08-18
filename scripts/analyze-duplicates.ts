import { parseStringPromise } from 'xml2js';

async function analyzeDuplicates() {
    console.log('Starting duplicate analysis...');
    
    try {
        // Fetch the XML feed
        const response = await fetch('https://youtupia.net/trpe/website/full.xml');
        if (!response.ok) {
            throw new Error(`Failed to fetch XML feed: ${response.status} ${response.statusText}`);
        }

        const xmlText = await response.text();
        const jsonData = await parseStringPromise(xmlText);
        
        console.log(`📄 XML FEED ANALYSIS:`);
        console.log(`Total properties found in XML: ${jsonData.list.property.length}`);
        
        // Track duplicates
        const permitNumbers = new Map<string, string[]>(); // permit -> [references]
        const referenceNumbers = new Map<string, string[]>(); // reference -> [permits]
        const combinedKeys = new Map<string, number>(); // permit_ref -> count
        
        let propertiesWithoutPermit = 0;
        
        for (let i = 0; i < jsonData.list.property.length; i++) {
            const property = jsonData.list.property[i];
            
            // Extract reference number
            const refNumber = Array.isArray(property.reference_number) 
                ? property.reference_number[0] 
                : property.reference_number;
            
            // Extract permit number
            let permitNumber = property.permit_number;
            if (Array.isArray(permitNumber)) {
                permitNumber = permitNumber[0];
            }
            
            if (!permitNumber) {
                propertiesWithoutPermit++;
                permitNumber = 'NO_PERMIT';
            }
            
            // Track by permit number
            if (!permitNumbers.has(permitNumber)) {
                permitNumbers.set(permitNumber, []);
            }
            permitNumbers.get(permitNumber)!.push(refNumber);
            
            // Track by reference number  
            if (!referenceNumbers.has(refNumber)) {
                referenceNumbers.set(refNumber, []);
            }
            referenceNumbers.get(refNumber)!.push(permitNumber);
            
            // Track combined key
            const combinedKey = `${permitNumber}_${refNumber}`;
            combinedKeys.set(combinedKey, (combinedKeys.get(combinedKey) || 0) + 1);
        }
        
        // Find duplicates
        console.log(`\n=== DUPLICATE ANALYSIS ===`);
        
        // Duplicate permit numbers
        const duplicatePermits = Array.from(permitNumbers.entries())
            .filter(([permit, refs]) => refs.length > 1);
        
        console.log(`🔄 Duplicate permit numbers: ${duplicatePermits.length}`);
        duplicatePermits.forEach(([permit, refs]) => {
            console.log(`  - Permit ${permit}: ${refs.join(', ')}`);
        });
        
        // Duplicate reference numbers
        const duplicateRefs = Array.from(referenceNumbers.entries())
            .filter(([ref, permits]) => permits.length > 1);
        
        console.log(`\n🔄 Duplicate reference numbers: ${duplicateRefs.length}`);
        duplicateRefs.forEach(([ref, permits]) => {
            console.log(`  - Reference ${ref}: ${permits.join(', ')}`);
        });
        
        // Duplicate combined keys
        const duplicateCombined = Array.from(combinedKeys.entries())
            .filter(([key, count]) => count > 1);
        
        console.log(`\n🔄 Duplicate combined keys (permit_reference): ${duplicateCombined.length}`);
        duplicateCombined.forEach(([key, count]) => {
            console.log(`  - Key ${key}: appears ${count} times`);
        });
        
        console.log(`\n=== SUMMARY ===`);
        console.log(`Total properties: ${jsonData.list.property.length}`);
        console.log(`Properties without permit: ${propertiesWithoutPermit}`);
        console.log(`Unique permit numbers: ${permitNumbers.size}`);
        console.log(`Unique reference numbers: ${referenceNumbers.size}`);
        console.log(`Unique combined keys: ${combinedKeys.size}`);
        console.log(`Expected unique properties after dedup: ${combinedKeys.size}`);
        console.log(`Properties that would be skipped as duplicates: ${jsonData.list.property.length - combinedKeys.size}`);
        
    } catch (error) {
        console.error('Analysis error:', error);
    }
}

analyzeDuplicates();
