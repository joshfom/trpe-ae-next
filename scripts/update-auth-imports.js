const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// List of files that need to be updated
const filesToUpdate = [
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/residential/for-rent/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/commercial/for-sale/[search]/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/commercial/for-rent/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/residential/for-sale/[search]/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/residential/for-rent/[search]/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/commercial/for-rent/[search]/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/residential/for-rent/[search]/[searchLevel2]/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/residential/for-sale/[search]/[searchLevel2]/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/commercial/for-rent/[search]/[searchLevel2]/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/properties/for-rent/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/residential/for-sale/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/commercial/for-sale/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/properties/commercial-sale/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/properties/commercial-rent/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/dubai/properties/commercial/for-sale/[search]/[searchLevel2]/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/property-types/[propertyType]/page.tsx',
  '/Users/joshua/Code/trpe-next/app/(site)/property-types/[propertyType]/[offeringType]/page.tsx'
];

async function updateImports() {
  let updatedFilesCount = 0;

  for (const filePath of filesToUpdate) {
    try {
      // Read the file contents
      const content = await readFile(filePath, 'utf-8');
      
      // Replace the import statement
      const updatedContent = content.replace(
        /import {validateRequest} from ["']@\/lib\/auth["'];/g,
        'import {validateRequest} from "@/actions/auth-session";'
      );
      
      // Check if content was modified
      if (content !== updatedContent) {
        // Write the updated content back to the file
        await writeFile(filePath, updatedContent, 'utf-8');
        updatedFilesCount++;
        console.log(`✓ Updated import in ${path.basename(filePath)}`);
      } else {
        console.log(`- No changes needed in ${path.basename(filePath)}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${filePath}:`, error.message);
    }
  }

  console.log(`\nUpdated imports in ${updatedFilesCount} files`);
}

// Run the update function
updateImports().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
