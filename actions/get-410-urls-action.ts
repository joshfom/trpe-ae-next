'use server';

import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

/**
 * Extracts the pathname from a URL string, removing any domain or protocol
 */
function extractPathname(url: string): string | null {
  if (!url) return null;
  
  try {
    // Handle relative paths that already start with /
    if (url.startsWith('/')) {
      return url;
    }
    
    // For full URLs, extract just the pathname
    let pathname: string;
    
    // Try to parse with URL constructor (for standard URLs)
    try {
      // If URL doesn't have protocol, add a dummy one to make URL constructor work
      const urlWithProtocol = url.includes('://') ? url : `https://${url}`;
      const parsedUrl = new URL(urlWithProtocol);
      pathname = parsedUrl.pathname;
    } catch (error) {
      // If URL parsing fails, try to extract pathname manually
      // Look for first / after the domain
      const domainEndIndex = url.indexOf('/', url.indexOf('.') + 1);
      if (domainEndIndex !== -1) {
        pathname = url.substring(domainEndIndex);
      } else {
        // No path found, assume it's just a domain with no path, so use /
        return '/';
      }
    }
    
    // Ensure pathname starts with /
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  } catch (error) {
    console.error(`[410 Action] Error extracting pathname from ${url}:`, error);
    return null;
  }
}

/**
 * Server action to read the list of URLs that should return 410 Gone status
 * from the Excel file
 */
export async function get410StatusUrlsAction(): Promise<string[]> {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'data', '410-status.xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.error('[410 Action] 410-status.xlsx file not found');
      return [];
    }
    
    console.log(`[410 Action] Reading Excel file from: ${filePath}`);
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);
    
    console.log(`[410 Action] Found ${data.length} entries in Excel file`);
    
    // Extract URLs from the data, strip domains, and ensure correct format
    const pathnames = data.map(row => {
      // Get the URL from the first column
      const urlValue = Object.values(row)[0];
      if (!urlValue) return null;
      
      // Extract just the pathname from the URL
      const pathname = extractPathname(urlValue);
      if (pathname) {
        // For debugging, show the original URL and what it was converted to
        console.log(`[410 Action] Processed: ${urlValue} → ${pathname}`);
      }
      return pathname;
    }).filter(Boolean) as string[];
    
    console.log(`[410 Action] Successfully extracted ${pathnames.length} valid pathnames`);
    
    return pathnames;
  } catch (error) {
    console.error('[410 Action] Error reading 410-status.xlsx:', error);
    return [];
  }
}