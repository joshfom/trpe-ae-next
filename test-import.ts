import { saveXmlListing } from './actions/save-xml-listing-action';

async function testImport() {
    console.log('Starting XML import test...');
    
    try {
        // Use the correct API endpoint that converts XML to JSON
        const result = await saveXmlListing('http://localhost:3000/api/xml');
        
        if (result.success) {
            console.log('\n=== FINAL RESULTS ===');
            console.log('Import completed successfully!');
            console.log('Stats:', result.stats);
            if (result.detailedStats) {
                console.log('Detailed Stats:', result.detailedStats);
            }
        } else {
            console.log('Import failed:', result.error);
        }
    } catch (error) {
        console.error('Import error:', error);
    }
}

testImport();
