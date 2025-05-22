import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {SearchFormData} from "@/features/search/types/property-search.types";

interface FurnishingFilterProps {
    form: UseFormReturn<SearchFormData>;
}

const FurnishingFilter: React.FC<FurnishingFilterProps> = ({ form }) => {
    const furnishingOptions = [
        { value: '', label: 'All Furnishing' },
        { value: 'furnished', label: 'Furnished' },
        { value: 'partly-furnished', label: 'Partly Furnished' }
    ];

    return (
        <div>
            <h3 className="text-sm lg:text-lg">Furnishing</h3>
            <div className="flex flex-col lg:flex-row py-3 gap-2 lg:gap-4">
                {furnishingOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => form.setValue('furnishing', option.value)}
                        className={`px-4 lg:px-6 py-1 lg:py-2 border rounded-full ${
                            form.watch('furnishing') === option.value ? 'bg-black text-white' : 'bg-white text-black'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FurnishingFilter;