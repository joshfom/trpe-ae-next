async function analyzeXmlFeed() {
    console.log('Starting XML feed analysis...');
    
    try {
        // Fetch and parse the XML feed
        const response = await fetch('https://youtupia.net/trpe/website/full.xml');
        if (!response.ok) {
            throw new Error(`Failed to fetch XML feed: ${response.status} ${response.statusText}`);
        }

        const data: any = await response.json();
        
        console.log(`📄 XML FEED ANALYSIS:`);
        console.log(`Total properties found in XML: ${data.list.property.length}`);
        
        // Analyze each property
        let validProperties = 0;
        let noImagesCount = 0;
        let invalidPriceCount = 0;
        
        for (let i = 0; i < data.list.property.length; i++) {
            const property = data.list.property[i];
            const refNumber = Array.isArray(property.reference_number) ? property.reference_number[0] : property.reference_number;
            
            // Check photos
            let photos: string[] = [];
            if (property.photo) {
                if (Array.isArray(property.photo) && typeof property.photo[0] === 'object' && 'url' in property.photo[0]) {
                    photos = Array.isArray(property.photo[0].url) ? property.photo[0].url.map((photo: any) => photo._) : [];
                } else if (typeof property.photo === 'object' && property.photo !== null && 'url' in property.photo) {
                    photos = Array.isArray(property.photo.url) ? property.photo.url.map((photo: any) => photo._) : [];
                }
            }
            
            // Check price
            let priceStr: string | undefined;
            if (property.price) {
                if (typeof property.price === 'string') {
                    priceStr = property.price;
                } else if (Array.isArray(property.price)) {
                    const firstItem = property.price[0];
                    if (typeof firstItem === 'string') {
                        priceStr = firstItem;
                    } else if (typeof firstItem === 'object' && firstItem !== null) {
                        if (firstItem.yearly && Array.isArray(firstItem.yearly)) {
                            priceStr = firstItem.yearly[0];
                        }
                    }
                } else if (typeof property.price === 'object' && property.price !== null) {
                    if (property.price.yearly && Array.isArray(property.price.yearly)) {
                        priceStr = property.price.yearly[0];
                    }
                }
            }
            
            // Validate price
            const validatePrice = (priceStr: string | undefined): number | null => {
                if (!priceStr || priceStr.trim() === '') {
                    return null;
                }
                const cleanedPrice = priceStr.replace(/[^0-9.]/g, '');
                const price = parseInt(parseFloat(cleanedPrice).toString(), 10);
                if (isNaN(price) || price < 1) {
                    return null;
                }
                return price;
            };
            
            const isValidPrice = validatePrice(priceStr) !== null;
            const hasImages = photos.length >= 1;
            
            if (!hasImages) {
                noImagesCount++;
                console.log(`${i + 1}. ❌ NO IMAGES: ${refNumber} (${photos.length} photos)`);
            } else if (!isValidPrice) {
                invalidPriceCount++;
                console.log(`${i + 1}. ❌ INVALID PRICE: ${refNumber} (price: "${priceStr}")`);
            } else {
                validProperties++;
                console.log(`${i + 1}. ✅ VALID: ${refNumber} (${photos.length} photos, price: ${priceStr})`);
            }
        }
        
        console.log(`\n=== SUMMARY ===`);
        console.log(`Total properties: ${data.list.property.length}`);
        console.log(`✅ Valid properties: ${validProperties}`);
        console.log(`❌ No images: ${noImagesCount}`);
        console.log(`❌ Invalid price: ${invalidPriceCount}`);
        console.log(`Expected DB entries: ${validProperties}`);
        
    } catch (error) {
        console.error('Analysis error:', error);
    }
}

analyzeXmlFeed();
