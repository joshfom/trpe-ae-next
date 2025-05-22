import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {SearchFormData} from "@/features/search/types/property-search.types";

interface SortingFilterProps {
    form: UseFormReturn<SearchFormData>;
}

const SortingFilter: React.FC<SortingFilterProps> = ({ form }) => {
    const sortingOptions = [
        { value: 'relevant', label: 'Most Relevant' },
        { value: 'price_low', label: 'Price (Low to High)' },
        { value: 'price_high', label: 'Price (High to Low)' },
        { value: 'beds_least', label: 'Bedrooms (Least)' },
        { value: 'beds_most', label: 'Bedrooms (Most)' }
    ];

    return (
        <div>
            <h3 className="text-lg pb-4">Sort By</h3>
            <FormField
                name="sortBy"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select sorting option" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortingOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />
        </div>
    );
};

export default SortingFilter;