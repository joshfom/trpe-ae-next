import React from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {FormField} from '@/components/ui/form';
import {Minus} from 'lucide-react';
import {UseFormReturn} from "react-hook-form";
import {SearchFormData} from "@/features/search/types/property-search.types";


// Size filter options
const sizeFilter = [
    { value: 300, label: '300 Sqft' },
    { value: 400, label: '400 Sqft' },
    { value: 500, label: '500 Sqft' },
    { value: 600, label: '600 Sqft' },
    { value: 700, label: '700 Sqft' },
    { value: 800, label: '800 Sqft' },
    { value: 900, label: '900 Sqft' },
    { value: 1000, label: '1,000 Sqft' },
    { value: 2000, label: '2,000 Sqft' },
    { value: 3000, label: '3,000 Sqft' },
    { value: 4000, label: '4,000 Sqft' },
    { value: 5000, label: '5,000 Sqft' },
    { value: 6000, label: '6,000 Sqft' },
    { value: 7000, label: '7,000 Sqft' },
    { value: 8000, label: '8,000 Sqft' },
    { value: 9000, label: '9,000 Sqft' },
    { value: 10000, label: '10,000 Sqft' }
];

interface SizeFilterProps {
    form: UseFormReturn<SearchFormData>;
}

const SizeFilter = ({ form } : SizeFilterProps ) => {
    const minSize = form.watch('minSize');
    const maxSize = form.watch('maxSize');

    return (
        <div>
            <h3 className="text-sm lg:text-lg">Size</h3>
            <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-8 py-3">
                <FormField
                    name="minSize"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Min Size" />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeFilter.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value.toString()}
                                        //@ts-ignore
                                        disabled={maxSize && parseInt(maxSize) <= item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                <div>
                    <Minus className="w-8" />
                </div>

                <FormField
                    name="maxSize"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Max Size" />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeFilter.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value.toString()}
                                        //@ts-ignore
                                        disabled={minSize && parseInt(minSize) >= item.value}
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

export default SizeFilter