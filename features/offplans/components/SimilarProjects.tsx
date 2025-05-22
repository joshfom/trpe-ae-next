import React from 'react';
import PropertyCard from "@/components/property-card";

interface SimilarPropertiesProps {
    properties: PropertyType[];
}

function SimilarProjects({properties}: SimilarPropertiesProps) {
    return (
        <div className={'bg-black w-full'}>
            <div className={'max-w-7xl mx-auto px-6 pt-12 pb-0'}>
                <h2 className={'text-white text-3xl font-bold'}>Similar Properties</h2>
            </div>
            <div className="max-w-7xl mx-auto grid px-3 col-span-1 lg:grid-cols-3 py-12 gap-4">
                {
                    properties.map((property, index) => (
                        <PropertyCard
                            property={property}
                            key={index}
                        />
                    ))
                }

            </div>
        </div>
    );
}

export default SimilarProjects;