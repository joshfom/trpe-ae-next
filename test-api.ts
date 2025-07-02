async function testApiEndpoint() {
    console.log('Testing API endpoint...');
    
    try {
        // Test the API endpoint locally
        const response = await fetch('http://localhost:3000/api/xml');
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        console.log(`📄 API RESPONSE ANALYSIS:`);
        console.log(`Response type: ${typeof data}`);
        
        if (data && data.list && data.list.property) {
            console.log(`Total properties in response: ${data.list.property.length}`);
            
            // Show first few properties for verification
            console.log('\nFirst 3 properties:');
            for (let i = 0; i < Math.min(3, data.list.property.length); i++) {
                const prop = data.list.property[i];
                const refNumber = Array.isArray(prop.reference_number) ? prop.reference_number[0] : prop.reference_number;
                console.log(`  ${i + 1}. ${refNumber}`);
            }
        } else {
            console.log('Unexpected data structure:', Object.keys(data));
        }
        
    } catch (error) {
        console.error('API test error:', error);
    }
}

testApiEndpoint();
