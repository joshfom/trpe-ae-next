"use server";

import { db } from "@/db/drizzle";
import { redirectTable } from "@/db/schema/redirect-table";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as XLSX from 'xlsx';
import { nanoid } from "nanoid";
import { RedirectInput, extractPathFromUrl } from "./add-redirect-action";

type ExcelRedirect = {
    from: string;
    to: string;
    statusCode: string;
    [key: string]: unknown; // Allow for additional properties with varying column names
};

// Define consistent return types
type ImportSuccessResult = {
    success: true;
    total: number;
    imported: number;
    skipped: number;
    errors: string[];
    hasHeaders: boolean;
};

type ImportErrorResult = {
    success: false;
    message: string;
    error: string;
    // Add matching fields for consistent typing
    total?: number;
    imported?: number;
    skipped?: number;
    errors?: string[];
    hasHeaders?: boolean;
};

// Combined type
type ImportResult = ImportSuccessResult | ImportErrorResult;

type RedirectStatusCode = '301' | '410';

export async function importRedirectsFromExcelAction(file: Blob): Promise<ImportResult> {
    try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // First try to parse with headers
        let data = XLSX.utils.sheet_to_json<ExcelRedirect>(worksheet);
        
        // If no data was extracted or first row doesn't match our expected format,
        // try parsing without headers (header: 1 works better for this case)
        let hasHeaders = true;
        if (data.length === 0 || (!data[0].from && !data[0].to && !data[0].statusCode)) {
            // Try with explicit column mapping in case there are no headers
            data = XLSX.utils.sheet_to_json<ExcelRedirect>(worksheet, { header: ['from', 'to', 'statusCode'] });
            hasHeaders = false;
            
            // Skip the first row if it's likely a header row (contains non-URL text in the first cell)
            if (data.length > 0) {
                const firstRow = data[0];
                const possibleHeader = String(firstRow.from || '').toLowerCase();
                if (possibleHeader === 'from' || possibleHeader === 'source' || 
                    possibleHeader === 'url' || possibleHeader === 'old url' || 
                    possibleHeader === 'source url' || possibleHeader === 'redirect from') {
                    data.shift(); // Remove the header row
                    hasHeaders = true;
                }
            }
        }

        // Debug log worksheet data - useful to see raw Excel structure
        console.log(`Excel structure debug: Sheet names: ${workbook.SheetNames}`);
        if (data.length === 0) {
            // Return detailed debug info on empty data
            const sheetRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
            console.log(`Excel appears empty or unreadable: Range=${worksheet['!ref']}, Rows=${sheetRange.e.r - sheetRange.s.r + 1}`);
            
            const rawCells = Object.keys(worksheet).filter(key => !key.startsWith('!'));
            console.log(`Raw cell data available: ${rawCells.slice(0, 10).join(', ')}${rawCells.length > 10 ? '...' : ''}`);
            
            if (rawCells.length > 0) {
                // Show sample of raw data if available
                const sampleCells = rawCells.slice(0, 5).map(key => `${key}=${JSON.stringify(worksheet[key])}`);
                console.log(`Sample cell data: ${sampleCells.join(', ')}`);
            }
            
            return {
                success: false,
                message: "The Excel file appears to be empty or has an unrecognized format",
                error: `Raw data: Sheet names=${workbook.SheetNames}, Range=${worksheet['!ref']}, Cells=${rawCells.length}`,
                total: 0,
                imported: 0,
                skipped: 0,
                errors: ["Excel file is empty or cannot be parsed"],
                hasHeaders
            };
        }

        const results: ImportSuccessResult = {
            success: true,
            total: data.length,
            imported: 0,
            skipped: 0,
            errors: [],
            hasHeaders
        };

        console.log(`Processing ${data.length} rows, detected ${hasHeaders ? 'with' : 'without'} headers`);

        // Validate data format
        for (const row of data) {
            // Enhanced debugging
            if (!row.from && !row.to && !row.statusCode) {
                results.errors.push(`Row appears to be empty or has incorrect format: ${JSON.stringify(row)}`);
                continue;
            }

            if (!row.from || typeof row.from !== 'string') {
                results.errors.push(`Invalid 'from' URL: ${JSON.stringify(row)}`);
                continue;
            }

            // Check for common Excel formatting issues - like spaces in column names
            // Handle "to " (with space) as well as "to" 
            const toUrl = row.to || row["to " as keyof typeof row] as string | undefined || '';
            
            // Handle status code variations - normalize and allow alternative names
            let statusCode: RedirectStatusCode = '301'; // Default
            
            // Get status code from various possible fields and formats
            if (row.statusCode !== undefined) {
                statusCode = normalizeStatusCode(String(row.statusCode).trim());
            } else if (row["statusCode " as keyof typeof row] !== undefined) { // With space
                statusCode = normalizeStatusCode(String(row["statusCode " as keyof typeof row]).trim());
            } else if (row["status" as keyof typeof row] !== undefined) { // Alternative name
                statusCode = normalizeStatusCode(String(row["status" as keyof typeof row]).trim());
            } else if (row["status_code" as keyof typeof row] !== undefined) { // Alternative format
                statusCode = normalizeStatusCode(String(row["status_code" as keyof typeof row]).trim());
            }
            
            // Debug log the raw values
            console.log(`Debug - Raw row data: ${JSON.stringify(row)}`);
            console.log(`Debug - Processed values: fromUrl=${row.from}, toUrl="${toUrl}", statusCode=${statusCode}`);
            
            // Check if the fromUrl already exists
            const normalizedFromUrl = await extractPathFromUrl(row.from.trim());
            let normalizedToUrl: string | null = null;
            
            // Debug the extracted path URLs
            console.log(`URL Extraction: Original=${row.from}, Normalized path=${normalizedFromUrl}`);
            
            if (statusCode === '301') {
                // Only process toUrl for 301 redirects
                if (!toUrl || typeof toUrl !== 'string') {
                    results.errors.push(`Missing destination URL for 301 redirect: ${JSON.stringify(row)}`);
                    continue;
                }
                
                const toUrlPath = await extractPathFromUrl(toUrl.trim());
                normalizedToUrl = toUrlPath.toLowerCase();
                console.log(`Destination URL Extraction: Original=${toUrl}, Normalized path=${normalizedToUrl}`);
                
                // Skip self-redirects (where source and destination are the same)
                if (normalizedFromUrl === normalizedToUrl) {
                    console.log(`Skipping self-redirect: ${normalizedFromUrl} → ${normalizedToUrl}`);
                    results.errors.push(`Self-redirect detected (source and destination are the same): ${normalizedFromUrl}`);
                    results.skipped++;
                    continue;
                }
                
                // Check if the destination URL (toUrl) already exists as a source URL (fromUrl) in the database
                // This prevents circular redirects and redirect chains
                try {
                    const existingFromUrl = await db
                        .select()
                        .from(redirectTable)
                        .where(eq(redirectTable.fromUrl, normalizedToUrl))
                        .limit(1);
                    
                    if (existingFromUrl.length > 0) {
                        console.log(`Skipping circular redirect: ${normalizedFromUrl} → ${normalizedToUrl} (destination already exists as a source)`);
                        results.errors.push(`Circular redirect detected: ${normalizedFromUrl} → ${normalizedToUrl} (destination URL already exists as a source URL)`);
                        results.skipped++;
                        continue;
                    }
                } catch (dbError) {
                    console.error(`Database query error checking for circular redirect for ${normalizedToUrl}:`, dbError);
                    results.errors.push(`Database error checking for circular redirect: ${(dbError as Error).message}`);
                    continue;
                }
            }
            
            // Double check the URL normalization for valid path formatting
            if (!normalizedFromUrl || normalizedFromUrl === '/') {
                results.errors.push(`Invalid URL path extracted from ${row.from}`);
                continue;
            }
            
            // Check for existing redirects
            try {
                const existingRedirect = await db
                    .select()
                    .from(redirectTable)
                    .where(eq(redirectTable.fromUrl, normalizedFromUrl))
                    .limit(1);

                if (existingRedirect.length > 0) {
                    // Instead of skipping, update the existing redirect
                    try {
                        await db.update(redirectTable)
                            .set({
                                toUrl: statusCode === '301' ? normalizedToUrl : null,
                                statusCode: statusCode,
                                updatedAt: new Date().toISOString(),
                            })
                            .where(eq(redirectTable.fromUrl, normalizedFromUrl));
                        
                        console.log(`Updated existing redirect: ${normalizedFromUrl} → ${normalizedToUrl || '(410 Gone)'}`);
                        results.imported++;
                    } catch (updateError) {
                        console.error(`Database update error for URL ${normalizedFromUrl}:`, updateError);
                        results.errors.push(`Database error updating URL ${normalizedFromUrl}: ${(updateError as Error).message}`);
                    }
                } else {
                    // Insert new redirect with explicit error handling
                    try {
                        await db.insert(redirectTable).values({
                            id: nanoid(),
                            fromUrl: normalizedFromUrl,
                            toUrl: statusCode === '301' ? normalizedToUrl : null,
                            statusCode: statusCode,
                            isActive: 'yes',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                        
                        console.log(`Successfully inserted redirect: ${normalizedFromUrl} → ${normalizedToUrl || '(410 Gone)'}`);
                        results.imported++;
                    } catch (insertError) {
                        console.error(`Database insert error for URL ${normalizedFromUrl}:`, insertError);
                        results.errors.push(`Database error for URL ${normalizedFromUrl}: ${(insertError as Error).message}`);
                    }
                }
            } catch (dbError) {
                console.error(`Database query error for URL ${normalizedFromUrl}:`, dbError);
                results.errors.push(`Database error: ${(dbError as Error).message}`);
                continue;
            }
        }

        revalidatePath("/admin/redirects");
        return results;
    } catch (error) {
        console.error("Error importing redirects from Excel:", error);
        return { 
            success: false, 
            message: `Failed to import redirects: ${(error as Error).message}`, 
            error: (error as Error).message,
            total: 0,
            imported: 0,
            skipped: 0,
            errors: [(error as Error).message],
            hasHeaders: false
        };
    }
}

// Helper function to normalize status codes to supported values
function normalizeStatusCode(code: string): RedirectStatusCode {
    if (code === '410' || code === '410.0' || code === '410') {
        return '410';
    }
    // Default everything else to 301
    return '301';
}
