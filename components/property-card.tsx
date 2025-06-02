'use client'
import React, { useEffect, memo, useMemo } from 'react';
import { Dot } from "lucide-react";
import Link from "next/link";
import { truncateText } from "@/lib/truncate-text";
import currencyConverter from "@/lib/currency-converter";
import unitConverter from "@/lib/unit-converter";
import { prepareExcerpt } from "@/lib/prepare-excerpt";
import { PropertyType } from "@/types/property";

interface PropertyCardProps {
    property: PropertyType,
    offeringType?: string
}

const PropertyCard = memo<PropertyCardProps>(({ property, offeringType }) => {
    // Memoize computed values
    const size = useMemo(() => property.size / 100, [property.size]);
    const firstImageUrl = useMemo(() => 
        property.images && property.images.length > 0 ? property.images[0].s3Url : null, 
        [property.images]
    );
    
    const propertyLinks = useMemo(() => ({
        propertyDetail: property.offeringType ? `/properties/${property.offeringType.slug}/${property.slug}` : "#",
        typeDetail: property.offeringType && property.type ? `/property-types/${property.type.slug}/${property.offeringType.slug}` : "#",
        offeringType: property.offeringType?.slug ? `/properties/${property.offeringType.slug}` : "#"
    }), [property.offeringType, property.slug, property.type]);

    // Memoize display logic
    const displayLogic = useMemo(() => {
        const showBedrooms = property.bedrooms > 0 && property.offeringType && 
            (property.offeringType.slug === 'for-sale' || property.offeringType.slug === 'for-rent');
        const showOfferingType = !(property.offeringType && offeringType && property.offeringType.slug === offeringType);
        
        return { showBedrooms, showOfferingType };
    }, [property.bedrooms, property.offeringType, offeringType]);

    // Memoize formatted values
    const formattedValues = useMemo(() => ({
        title: truncateText(property.title, 35),
        description: prepareExcerpt(property.description, 90),
        price: currencyConverter(parseInt(property.price)),
        size: unitConverter(size)
    }), [property.title, property.description, property.price, size]);


    return (
        <div className={'rounded-xl shadow-xs bg-white'}>
            <div className="relative">
                <div className="relative">
                    {firstImageUrl && (
                        <div className="h-96 relative">
                            <img
                                src={firstImageUrl}
                                alt={property.name || 'Property Image'}
                                className="pointer-events-none object-cover rounded-xl absolute inset-0 w-full h-full"
                                loading="lazy"
                            />
                        </div>
                    )}
                </div>
                <div className="absolute top-2 right-2 z-10 flex space-x-3">
                    {property.type && (
                        <Link 
                            href={propertyLinks.typeDetail}
                            className="text-white rounded-full text-xs px-4 bg-[#141414] py-1"
                        >
                            {property.type.name}
                        </Link>
                    )}
                </div>
            </div>
            <div className="p-3 pt-8 border-b border-x text-slate-700 rounded-b-xl border-white/20 relative">
                <div className="flex flex-col space-y-2 text-lg justify-center">
                    <Link 
                        href={propertyLinks.propertyDetail}
                        className={'hover:underline'}
                    >
                        {formattedValues.title}
                    </Link>
                </div>
                <div className="py-2">
                    <Link 
                        href={propertyLinks.propertyDetail}
                        className={'text-sm '}
                    >
                        {formattedValues.description}
                    </Link>
                </div>
                <div className="absolute z-20 text-white -top-4 left-4">
                    {displayLogic.showOfferingType && property.offeringType && (
                        <Link 
                            href={propertyLinks.offeringType}
                            className={'rounded-full bg-[#141414] border-b py-1 px-3 text-center border-t border-white border-x text-white text-sm'}
                        >
                            <span className="sr-only">Property Details</span>
                            {property.offeringType.name}
                        </Link>
                    )}
                </div>
                <div className="py-3 flex flex-wrap gap-4 justify-start">
                    {displayLogic.showBedrooms && (
                        <div className="flex justify-center items-center">
                            <Dot size={18}/>
                            {property.bedrooms < 1 ? 'Studio' : (
                                <p>
                                    Bed
                                    <span className="ml-2">
                                        {property.bedrooms}
                                    </span>
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex justify-center items-center">
                        <Dot size={18}/>
                        Bath
                        <p className="ml-2">
                            {property.bathrooms}
                        </p>
                    </div>

                    <div className="flex grow justify-center items-center">
                        <Dot size={18}/>
                        <span className="">Size</span>
                        <p className="ml-2 ">
                            {formattedValues.size}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 py-2 justify-between">
                    <Link
                        className={'py-1.5 px-5 rounded-full hover:bg-black hover:text-white text-sm border '}
                        href={propertyLinks.propertyDetail}
                    >
                        View Property
                    </Link>
                    <p className={'text-lg font-semibold'}>
                        {formattedValues.price}
                    </p>
                </div>
            </div>
        </div>
    );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;