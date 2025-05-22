import path from "path";

/**
 * Represents a community filter type.
 */
interface CommunityFilterType {
    slug: string;
    name: string | null;
    propertyCount: number;
    rentCount: number;
    saleCount: number;
    commercialRentCount: number;
    commercialSaleCount: number;
}

/**
 * Represents the search parameters extracted from the URL.
 */
interface SearchedParams {
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    bed?: number;
    bath?: number;
    status?: string;
    shortBy?: string;
    unitType?: string;
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
    if (!url) return {areas: []};

    let searchedParams: SearchedParams = {
        minPrice: undefined,
        maxPrice: undefined,
        minSize: undefined,
        maxSize: undefined,
        bed: undefined,
        bath: undefined,
        status: undefined,
        shortBy: undefined,
        unitType: undefined,
        areas: []
    }

    const areaSegment = url
        .split('/')
        .find(segment => segment.includes('area-'));


    const unitTypeSegment = url
        .split('/')
        .find(segment => segment.includes('property-type'));


    if (unitTypeSegment) {

        const propertyTypePath = unitTypeSegment.replace('property-type-', '');
        //if containt property-types return null
        if (propertyTypePath.includes('property-types')) return searchedParams;
        searchedParams.unitType = propertyTypePath;
    }

    if (areaSegment) {
        // Filter out the area segment
        const areas = areaSegment.split('--')
            .map(area => area.replace('area-', '').trim())
            .filter(Boolean);
        searchedParams.areas = areas;
    }

    return searchedParams
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