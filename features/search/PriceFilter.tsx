import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {FormField} from '@/components/ui/form';
import {Minus} from 'lucide-react';
import {UseFormReturn} from "react-hook-form";
import {SearchFormData} from "@/features/search/types/property-search.types";

// Price filter options
const priceFilter = [
    { value: 400000, label: '400,000' },
    { value: 450000, label: '450,000' },
    { value: 500000, label: '500,000' },
    { value: 600000, label: '600,000' },
    { value: 650000, label: '650,000' },
    { value: 700000, label: '700,000' },
    { value: 850000, label: '850,000' },
    { value: 900000, label: '900,000' },
    { value: 950000, label: '950,000' },
    { value: 1000000, label: '1,000,000' },
    { value: 1500000, label: '1,500,000' },
    { value: 2000000, label: '2,000,000' },
    { value: 2500000, label: '2,500,000' },
    { value: 3000000, label: '3,000,000' },
    { value: 4000000, label: '4,000,000' },
    { value: 5000000, label: '5,000,000' },
    { value: 6000000, label: '6,000,000' },
    { value: 7000000, label: '7,000,000' },
    { value: 8000000, label: '8,000,000' },
    { value: 9000000, label: '9,000,000' },
    { value: 10000000, label: '10,000,000' },
    { value: 20000000, label: '20,000,000' },
    { value: 30000000, label: '30,000,000' },
    { value: 40000000, label: '40,000,000' },
    { value: 50000000, label: '50,000,000' },
    { value: 60000000, label: '60,000,000' },
    { value: 70000000, label: '70,000,000' },
    { value: 80000000, label: '80,000,000' },
    { value: 90000000, label: '90,000,000' },
    { value: 100000000, label: '100,000,000' }
];

interface PriceFilterProps {
    form: UseFormReturn<SearchFormData>;
    badgeCount?: number;
}

const PriceFilter = ({ form, badgeCount = 0 } : PriceFilterProps) => {
    const minPrice = form.watch('minPrice');
    const maxPrice = form.watch('maxPrice');

    return (
        <div>
            <h3 className="text-sm lg:text-lg flex items-center">
                Price
                {badgeCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                        {badgeCount}
                    </span>
                )}
            </h3>
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-8 py-3">
                <FormField
                    name="minPrice"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Min Price" />
                            </SelectTrigger>
                            <SelectContent>
                                {priceFilter.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value.toString()}
                                        //@ts-ignore
                                        disabled={maxPrice && parseInt(maxPrice) < item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                <Minus className="w-8" />

                <FormField
                    name="maxPrice"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Max Price" />
                            </SelectTrigger>
                            <SelectContent>
                                {priceFilter.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value.toString()}
                                        //@ts-ignore
                                        disabled={minPrice && parseInt(minPrice) > item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    );
};

export default PriceFilter;