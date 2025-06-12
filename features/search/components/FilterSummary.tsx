import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SearchFormData } from '@/features/search/types/property-search.types';
import { CommunityFilterType } from '@/types/community';

interface FilterSummaryProps {
    form?: UseFormReturn<SearchFormData>;
    selectedCommunities?: CommunityFilterType[];
    searchParams?: URLSearchParams;
}

const FilterSummary: React.FC<FilterSummaryProps> = ({ 
    form, 
    selectedCommunities = [], 
    searchParams 
}) => {
    // Function to format price with AED currency
    const formatPrice = (price: string | number): string => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (numPrice >= 1000000) {
            return `AED ${(numPrice / 1000000).toFixed(1)}M`;
        } else if (numPrice >= 1000) {
            return `AED ${(numPrice / 1000).toFixed(0)}K`;
        }
        return `AED ${numPrice?.toLocaleString()}`;
    };

    // Get current form values or URL search params
    const getFilterValue = (key: string): string | undefined => {
        if (searchParams) {
            return searchParams.get(key) || undefined;
        }
        if (form) {
            const formValue = form.getValues(key as keyof SearchFormData);
            return formValue ? String(formValue) : undefined;
        }
        return undefined;
    };

    // Build natural language summary
    const buildSummary = (): string[] => {
        const parts: string[] = [];

        // Price range
        const minPrice = getFilterValue('minPrice') || getFilterValue('min-price');
        const maxPrice = getFilterValue('maxPrice') || getFilterValue('max-price');
        
        if (minPrice && maxPrice) {
            parts.push(`${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`);
        } else if (minPrice) {
            parts.push(`from ${formatPrice(minPrice)}`);
        } else if (maxPrice) {
            parts.push(`up to ${formatPrice(maxPrice)}`);
        }

        // Bedrooms
        const bedrooms = getFilterValue('bed') || getFilterValue('bedrooms');
        if (bedrooms && bedrooms !== '0') {
            parts.push(`${bedrooms}+ bedroom${parseInt(bedrooms) > 1 ? 's' : ''}`);
        }

        // Bathrooms
        const bathrooms = getFilterValue('bath') || getFilterValue('bathrooms');
        if (bathrooms && bathrooms !== '0') {
            parts.push(`${bathrooms}+ bathroom${parseInt(bathrooms) > 1 ? 's' : ''}`);
        }

        // Property type
        const propertyType = getFilterValue('unitType') || getFilterValue('property-type');
        if (propertyType && propertyType !== 'all') {
            parts.push(propertyType);
        }

        // Size range
        const minArea = getFilterValue('minSize') || getFilterValue('min-area');
        const maxArea = getFilterValue('maxSize') || getFilterValue('max-area');
        
        if (minArea && maxArea) {
            parts.push(`${minArea} - ${maxArea} sq ft`);
        } else if (minArea) {
            parts.push(`from ${minArea} sq ft`);
        } else if (maxArea) {
            parts.push(`up to ${maxArea} sq ft`);
        }

        // Communities
        if (selectedCommunities.length > 0) {
            if (selectedCommunities.length === 1) {
                parts.push(`in ${selectedCommunities[0].name}`);
            } else if (selectedCommunities.length <= 3) {
                const names = selectedCommunities.map(c => c.name).join(', ');
                parts.push(`in ${names}`);
            } else {
                parts.push(`in ${selectedCommunities.length} locations`);
            }
        }

        // Furnishing
        const furnishing = getFilterValue('furnishing');
        if (furnishing && furnishing !== '') {
            parts.push(furnishing === 'furnished' ? 'furnished' : 'partly furnished');
        }

        // Status
        const status = getFilterValue('status');
        if (status && status !== '') {
            parts.push(status === 'ready' ? 'ready to move' : 'off-plan');
        }

        return parts;
    };

    const summaryParts = buildSummary();

    if (summaryParts.length === 0) {
        return null;
    }

    return (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="max-w-7xl mx-auto">
                <p className="text-blue-800 text-sm">
                    <span className="font-medium">Results for properties </span>
                    {summaryParts.join(', ')}
                </p>
            </div>
        </div>
    );
};

export default FilterSummary;
