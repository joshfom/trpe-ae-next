import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {SearchFormData} from "@/features/search/types/property-search.types";
import UnitTypeFilter from "@/features/search/components/Filters/UnitTypeFilter";
import PriceFilter from "@/features/search/PriceFilter";
import SizeFilter from "@/features/search/SizeFilter";
import BedroomFilter from "@/features/search/components/Filters/BedroomFilter";
import FurnishingFilter from "@/features/search/components/Filters/FurnishingFilter";
import StatusFilter from "@/features/search/components/Filters/StatusFilter";

interface MobileFiltersProps {
    form: UseFormReturn<SearchFormData>;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ form }) => {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Property Type Selection */}
            <UnitTypeFilter form={form} />

            {/* Price Range Filter */}
            <PriceFilter form={form} />

            {/* Size Filter */}
            <SizeFilter form={form} />

            {/* Bedroom Filter */}
            <BedroomFilter form={form} />

            {/* Furnishing Filter */}
            <FurnishingFilter form={form} />

            {/* Status Filter */}
            <StatusFilter form={form} />
        </div>
    );
};

export default MobileFilters;