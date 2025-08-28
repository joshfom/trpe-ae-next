import React from 'react';
import PropertyCardServer from "@/components/property-card-server";
import { PropertyType } from "@/types/property";

interface ListingsGridServerProps {
    listings?: PropertyType[]
}

function ListingsGridServer({ listings }: ListingsGridServerProps) {
    if (!listings || listings.length === 0) {
        return null;
    }

    return (
        <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'}>
            {listings.map((listing) => (
                <PropertyCardServer key={listing.id} property={listing} />
            ))}
        </div>
    );
}

export default ListingsGridServer;
