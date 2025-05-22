import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {SearchFormData} from "@/features/search/types/property-search.types";

interface UnitTypeFilterProps {
    form: UseFormReturn<SearchFormData>;
}

const UnitTypeFilter: React.FC<UnitTypeFilterProps> = ({ form }) => {
    const unitTypes = [
        { value: 'apartments', label: 'Apartments' },
        { value: 'villas', label: 'Villas' },
        { value: 'townhouses', label: 'Townhouses' },
        { value: 'plots', label: 'Plots' },
        { value: 'offices', label: 'Offices' },
        { value: 'retail', label: 'Retail' },
        { value: 'warehouses', label: 'Warehouses' }
    ];

    return (
        <div>
            <h3 className="text-sm lg:text-lg pb-2 lg:pb-4">Property Type</h3>
            <FormField
                name="unitType"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                                {unitTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
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

export default UnitTypeFilter;