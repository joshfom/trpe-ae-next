import path from "path";
import { CommunityFilterType } from "@/types/community";

/**
 * Represents the search parameters extracted from the URL.
 */
interface SearchedParams {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    bed?: number;
    bath?: number;
    status?: string;
    shortBy?: string;
    unitType?: string;
    offerType?: string;
    furnishing?: string;
    sortBy?: string;
    currency?: string;
    communityNames?: string;
    areas: string[];
}

/**
 * Builds a path segment for the given communities.
 * @param {CommunityFilterType[]} communities - The list of communities.
 * @returns {string} - The path segment for the communities.
 */
export const buildCommunitiesPath = (communities: CommunityFilterType[]): string => {
    if (!communities.length) return '';

    // Create path segment with format: area-slug1--area-slug2--area-slug3
    return communities
        .map(community => `area-${community.slug}`)
        .join('--');
};

/**
 * Extracts search parameters from the given URL.
 * @param {string} url - The URL to extract search parameters from.
 * @returns {SearchedParams} - The extracted search parameters.
 */
export const extractPathSearchParams = (url: string): SearchedParams => {
    if (!url) {
        console.log('Warning: extractPathSearchParams called with empty URL');
        return {areas: []};
    }
    
    // Normalize URL to handle potential edge cases
    let normalizedUrl = url;
    try {
        // Try to parse as URL if it looks like a full URL
        if (url.startsWith('http')) {
            const urlObj = new URL(url);
            normalizedUrl = urlObj.pathname;
        }
    } catch (error) {
        console.error('Error parsing URL:', error);
    }
    
    console.log('Extracting path search params from:', normalizedUrl);

    let searchedParams: SearchedParams = {
        query: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        minSize: undefined,
        maxSize: undefined,
        bed: undefined,
        bath: undefined,
        status: undefined,
        shortBy: undefined,
        unitType: undefined,
        offerType: undefined,
        furnishing: undefined,
        sortBy: undefined,
        currency: undefined,
        communityNames: undefined,
        areas: []
    }
    
    try {
        // Try to detect property category and offering type from URL
        const segments = url.split('/').filter(Boolean);
        
        // Detect offering type from URL segments (for-sale, for-rent, etc.)
        if (url.includes('/for-sale/')) {
            searchedParams.offerType = 'for-sale';
        } else if (url.includes('/for-rent/')) {
            searchedParams.offerType = 'for-rent';
        } else if (url.includes('/commercial-sale/')) {
            searchedParams.offerType = 'commercial-sale';
        } else if (url.includes('/commercial-rent/')) {
            searchedParams.offerType = 'commercial-rent';
        }
        
        // Check for property type segment (e.g., property-type-office)
        const unitTypeSegment = url
            .split('/')
            .find(segment => segment.includes('property-type'));
        
        // Check if this is a property-types route
        const isPropertyTypesRoute = url.includes('/property-types/');
        
        // Check for area segment (e.g., area-business-bay)
        const areaSegment = url
            .split('/')
            .find(segment => segment.includes('area-'));

    if (unitTypeSegment) {
        const propertyTypePath = unitTypeSegment.replace('property-type-', '');
        // if contains property-types return null
        if (propertyTypePath.includes('property-types')) return searchedParams;
        searchedParams.unitType = propertyTypePath;
        console.log('Found unit type in path:', searchedParams.unitType);
    }
    
    // Special handling for /property-types/[propertyType]/[offeringType] route pattern
    if (url.includes('/property-types/')) {
        const segments = url.split('/').filter(Boolean);
        const propertyTypesIndex = segments.indexOf('property-types');
        
        if (propertyTypesIndex >= 0 && segments.length > propertyTypesIndex + 1) {
            const propertyType = segments[propertyTypesIndex + 1];
            searchedParams.unitType = propertyType;
            console.log('Found property type in property-types route:', propertyType);
            
            // If there's also an offering type
            if (segments.length > propertyTypesIndex + 2) {
                const offerType = segments[propertyTypesIndex + 2];
                searchedParams.offerType = offerType;
                console.log('Found offering type in property-types route:', offerType);
                
                // Check for query parameters that might contain community info
                if (url.includes('?')) {
                    try {
                        const urlObj = new URL(url.startsWith('http') ? url : `http://example.com${url}`);
                        const communityParam = urlObj.searchParams.get('community');
                        if (communityParam) {
                            searchedParams.areas = [communityParam];
                            searchedParams.communityNames = communityParam;
                            console.log('Found community in query params:', communityParam);
                        }
                    } catch (error) {
                        console.error('Error parsing URL with query params:', error);
                    }
                }
            }
        }
    }

    if (areaSegment) {
        // Filter out the area segment
        const areas = areaSegment.split('--')
            .map(area => area.replace('area-', '').trim())
            .filter(Boolean);
        searchedParams.areas = areas;
        // Set communityNames as a comma-separated string of area names
        searchedParams.communityNames = areas.join(',');
        console.log('Found areas in path from areaSegment:', areas);
    }
    
    console.log('Extracted search params:', JSON.stringify(searchedParams, null, 2));
    
    return searchedParams;
    } catch (error) {
        console.error('Error extracting search params from path:', error);
        console.error('Problematic URL:', url);
        // Return empty results to avoid breaking the application
        return {areas: []};
    }
}

/**
 * Formats the names of the given communities into a single string.
 * @param {CommunityFilterType[]} communities - The list of communities.
 * @returns {string} - The formatted community names.
 */
export const formatCommunityNames = (communities: CommunityFilterType[]): string => {
    const names: string[] = communities.map(community => community.name).filter((name): name is string => Boolean(name));
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
};

/**
 * Formats a query parameter key and value.
 * @param {string} key - The query parameter key.
 * @param {string | number | undefined} value - The query parameter value.
 * @returns {[string, string] | null} - The formatted query parameter or null if the value is undefined.
 */

// Helper function to convert camelCase parameters to kebab-case and filter out empty values
const formatQueryParam = (key: string, value: any): [string, string] | null => {
    // Return null for empty, undefined, or zero values (except price and size)
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'number' && value === 0 && !key.includes('Price') && !key.includes('Size')) return null;

    // Map our parameter names to their kebab-case versions
    const parameterMap: Record<string, string> = {
        minPrice: 'min-price',
        maxPrice: 'max-price',
        minSize: 'min-size',
        maxSize: 'max-size',
        bed: 'bedrooms',
        bath: 'bathrooms',
        shortBy: 'sort-by'
    };

    // Get the correct parameter name from our map, or use the original if not mapped
    const paramName = parameterMap[key] || key;
    return [paramName, value.toString()];
};

/**
 * Builds a property search URL based on the given parameters.
 * @param {Object} params - The parameters for building the URL.
 * @param {string} params.searchType - The search type (e.g., for-sale, for-rent).
 * @param {CommunityFilterType[]} params.selectedCommunities - The selected communities.
 * @param {Object} params.formData - The form data containing search filters.
 * @returns {string} - The constructed property search URL.
 */
export const buildPropertySearchUrl = ({
                                           searchType,
                                           selectedCommunities,
                                           formData
                                       }: {
    searchType: string,
    selectedCommunities: CommunityFilterType[],
    formData: {
        query?: string;
        unitType?: string;
        minPrice?: number;
        maxPrice?: number;
        minSize?: number;
        maxSize?: number;
        bed?: number;
        bath?: number;
        status?: string;
        shortBy?: string;
        currency?: string;
    }
}): string => {
    // Build the base path components
    const communitiesPath = buildCommunitiesPath(selectedCommunities);
    const offeringPath = searchType.includes('commercial') ? 'commercial' : 'residential';

    // Construct the base URL, handling the unitType in the path
    let baseUrl = `/dubai/properties/${offeringPath}/${offeringPath === 'commercial' ? 'for-sale' : searchType}`;
    if (formData.unitType) {
        baseUrl += `/property-type-${formData.unitType}`;
    }
    if (communitiesPath) {
        baseUrl += `/${communitiesPath}`;
    }

    // Create query parameters
    const queryParams = new URLSearchParams();

    // Get all entries from formData except unitType
    const formDataEntries = Object.entries(formData);

    // Process each form data entry and add to query parameters if it has a value
    formDataEntries.forEach(([key, value]) => {
        // Skip offerType as it's handled in the path
        if (key === 'offerType') return;
        if (key === 'unitType') return;

        //remove query as is not needed
        if (key === 'query') return;

        // Format and add the parameter if it has a valid value
        const formattedParam = formatQueryParam(key, value);
        if (formattedParam) {
            const [paramName, paramValue] = formattedParam;
            queryParams.append(paramName, paramValue);
        }
    });

    // Build the final URL with query parameters if any exist
    const queryString = queryParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};