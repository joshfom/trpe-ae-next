import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {SearchFormData} from "@/features/search/types/property-search.types";

interface BedroomFilterProps {
    form: UseFormReturn<SearchFormData>;
}

const BedroomFilter: React.FC<BedroomFilterProps> = ({ form }) => {
    const bedOptions = [0, 1, 2, 3, 4, 5, 6, 7];

    return (
        <div>
            <h3 className="text-sm lg:text-lg">Bedrooms</h3>
            <div className="flex py-3 gap-1.5 lg:gap-3 flex-wrap">
                {bedOptions.map((beds) => (
                    <button
                        key={beds}
                        type="button"
                        onClick={() => form.setValue('bed', beds)}
                        className={`px-4 lg:px-6 py-2 text-sm lg:text-base border rounded-full ${
                            form.watch('bed') === beds ? 'bg-black text-white' : 'bg-white text-black'
                        }`}
                    >
                        {beds === 0 ? 'Any' : `${beds}+`}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BedroomFilter;