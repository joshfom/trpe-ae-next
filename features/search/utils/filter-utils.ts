import { UseFormReturn } from 'react-hook-form';
import { SearchFormData } from '@/features/search/types/property-search.types';
import { CommunityFilterType } from '@/types/community';

export interface FilterCounts {
    price: number;
    bedrooms: number;
    bathrooms: number;
    size: number;
    propertyType: number;
    furnishing: number;
    status: number;
    communities: number;
    total: number;
}

/**
 * Count active filters from form or search params
 */
export const countActiveFilters = (
    form?: UseFormReturn<SearchFormData>,
    selectedCommunities: CommunityFilterType[] = [],
    searchParams?: URLSearchParams
): FilterCounts => {
    const counts: FilterCounts = {
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        size: 0,
        propertyType: 0,
        furnishing: 0,
        status: 0,
        communities: 0,
        total: 0
    };

    // Helper to get value from form or search params
    const getValue = (key: string, altKey?: string): string | undefined => {
        if (searchParams) {
            return searchParams.get(key) || (altKey ? searchParams.get(altKey) : undefined) || undefined;
        }
        if (form) {
            const formValue = form.getValues(key as keyof SearchFormData);
            return formValue ? String(formValue) : undefined;
        }
        return undefined;
    };

    // Count price filters
    const minPrice = getValue('minPrice', 'min-price');
    const maxPrice = getValue('maxPrice', 'max-price');
    if (minPrice || maxPrice) {
        counts.price = 1;
    }

    // Count bedroom filter
    const bedrooms = getValue('bed', 'bedrooms');
    if (bedrooms && bedrooms !== '0' && bedrooms !== 'any') {
        counts.bedrooms = 1;
    }

    // Count bathroom filter
    const bathrooms = getValue('bath', 'bathrooms');
    if (bathrooms && bathrooms !== '0' && bathrooms !== 'any') {
        counts.bathrooms = 1;
    }

    // Count size filters
    const minArea = getValue('minSize', 'min-area');
    const maxArea = getValue('maxSize', 'max-area');
    if (minArea || maxArea) {
        counts.size = 1;
    }

    // Count property type filter
    const propertyType = getValue('unitType', 'property-type');
    if (propertyType && propertyType !== 'all' && propertyType !== '') {
        counts.propertyType = 1;
    }

    // Count furnishing filter
    const furnishing = getValue('furnishing');
    if (furnishing && furnishing !== '') {
        counts.furnishing = 1;
    }

    // Count status filter
    const status = getValue('status');
    if (status && status !== '') {
        counts.status = 1;
    }

    // Count communities
    counts.communities = selectedCommunities.length;

    // Calculate total
    counts.total = counts.price + counts.bedrooms + counts.bathrooms + 
                   counts.size + counts.propertyType + counts.furnishing + 
                   counts.status + counts.communities;

    return counts;
};

/**
 * Get badge count for specific filter category
 */
export const getFilterBadgeCount = (
    category: keyof Omit<FilterCounts, 'total'>,
    form?: UseFormReturn<SearchFormData>,
    selectedCommunities: CommunityFilterType[] = [],
    searchParams?: URLSearchParams
): number => {
    const counts = countActiveFilters(form, selectedCommunities, searchParams);
    return counts[category];
};
