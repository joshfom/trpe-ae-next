import React, { memo } from 'react';
import PropertyCard from "@/components/property-card";

interface SimilarPropertiesProps {
    properties: PropertyType[];
}

const SimilarProperties = memo<SimilarPropertiesProps>(({ properties }) => {
    if (!properties || properties.length === 0) {
        return null;
    }

    return (
        <div className={'bg-black w-full'}>
            <div className={'max-w-7xl mx-auto pt-12 pb-0'}>
                <h2 className={'text-white text-3xl font-bold'}>Similar Properties</h2>
            </div>
            <div className="max-w-7xl mx-auto grid px-3 col-span-1 lg:grid-cols-3 py-12 gap-4">
                {properties.map((property) => (
                    <PropertyCard property={property} key={property.id} />
                ))}
            </div>
        </div>
    );
});

SimilarProperties.displayName = 'SimilarProperties';

export default SimilarProperties;