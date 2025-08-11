import { parsePropertyDescription, extractFeaturesList, tiptapToHtml } from '@/lib/property-description-parser';

// Test with your example description
const testDescription = `T R P E Real Estate presenting this beautiful 3-bedroom apartment with amazing views located at The Address Residence Dubai Opera Tower 1.

Property features & amenities:
- Burj Khalifa view
- Premium finishing
- Low floor
- High end facilities
- 2 allocated parking
- Furnished and serviced apartment
- State-of-the-art gym
- Dining and Shopping facilities
- Infinity Swimming Pool
- State-of-the-art Gym
- Kid's club play area
- five-star concierge service
- Exquisite Lounges

Connectivity:
- 05 minutes to drive to Dubai Mall
- 20 minutes to Burj Al Arab
- 21 minutes to Palm Jumeirah
- 26 minutes to The Walk JBR
- 33 minutes to Dubai International Airport (DXB)
- 45 minutes to the new Al Maktoum International Airport 

As you step into the apartment, you are greeted by a spacious and classy decorated living area that exudes modern sophistication. The floor-to-ceiling windows run across the length of the room, allowing natural light to flood in and providing panoramic vistas of the bustling fountain below and the mesmerizing Burj Khalifa views. The apartment boasts a fully equipped kitchen, complete with top-of-the-line appliances and premium countertops.`;

export function testPropertyDescriptionParser() {
  console.log('=== Testing Property Description Parser ===\n');
  
  // Test 1: Parse to TipTap format
  console.log('1. TipTap Format:');
  const tiptapDoc = parsePropertyDescription(testDescription);
  console.log(JSON.stringify(tiptapDoc, null, 2));
  
  // Test 2: Extract features list
  console.log('\n2. Extracted Features:');
  const { features, connectivity } = extractFeaturesList(testDescription);
  console.log('Property Features:', features);
  console.log('Connectivity:', connectivity);
  
  // Test 3: Convert to HTML
  console.log('\n3. Generated HTML:');
  const html = tiptapToHtml(tiptapDoc);
  console.log(html);
  
  return {
    tiptapDoc,
    features,
    connectivity,
    html
  };
}

// Example usage in your property component:
export function PropertyDescriptionComponent({ description }: { description: string }) {
  const tiptapDoc = parsePropertyDescription(description);
  const { features, connectivity } = extractFeaturesList(description);
  
  return {
    structuredDescription: tiptapDoc,
    quickFeatures: features,
    connectivityInfo: connectivity
  };
}
