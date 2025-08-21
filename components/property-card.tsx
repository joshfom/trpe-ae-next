'use client'
import React, { useEffect, memo, useMemo } from 'react';
import { Dot } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { truncateText } from "@/lib/truncate-text";
import currencyConverter from "@/lib/currency-converter";
import unitConverter from "@/lib/unit-converter";
import { prepareExcerpt } from "@/lib/prepare-excerpt";
import { PropertyType } from "@/types/property";
import { getOptimalImageConfig } from "@/lib/mobile/image-optimization";

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
    
    // Mobile-optimized image configuration
    const imageConfig = useMemo(() => getOptimalImageConfig('property-card', false), []);
    
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
        <div className={'rounded-xl shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow duration-200'}>
            <div className="relative">
                <div className="relative">
                    {firstImageUrl && (
                        <div className="h-64 sm:h-80 md:h-96 relative">
                            <Image
                                src={firstImageUrl}
                                alt={property.name || 'Property Image'}
                                fill
                                className="pointer-events-none object-cover rounded-t-xl"
                                loading={imageConfig.loading}
                                sizes={imageConfig.sizes}
                                placeholder={imageConfig.placeholder}
                                blurDataURL={imageConfig.blurDataURL}
                                quality={imageConfig.quality}
                            />
                        </div>
                    )}
                </div>
                
                {/* Mobile-optimized badges with better touch targets */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    {property.type && (
                        <Link 
                            href={propertyLinks.typeDetail}
                            className="text-white rounded-full text-xs sm:text-sm px-3 py-1.5 bg-[#141414] hover:bg-gray-800 transition-colors min-h-[32px] flex items-center justify-center"
                        >
                            {property.type.name}
                        </Link>
                    )}
                </div>
            </div>
            
            <div className="p-4 sm:p-5 border-b border-x text-slate-700 rounded-b-xl border-white/20 relative">
                {/* Mobile-optimized offering type badge */}
                <div className="absolute z-20 text-white -top-6 left-4">
                    {displayLogic.showOfferingType && property.offeringType && (
                        <Link 
                            href={propertyLinks.offeringType}
                            className={'rounded-full bg-[#141414] border-b py-2 px-4 text-center border-t border-white border-x text-white text-sm hover:bg-gray-800 transition-colors min-h-[36px] flex items-center'}
                        >
                            <span className="sr-only">Property Details</span>
                            {property.offeringType.name}
                        </Link>
                    )}
                </div>
                
                {/* Mobile-optimized title and description */}
                <div className="flex flex-col space-y-3 text-base sm:text-lg justify-center pt-4">
                    <Link 
                        href={propertyLinks.propertyDetail}
                        className={'hover:underline font-medium leading-tight'}
                    >
                        {formattedValues.title}
                    </Link>
                </div>
                
                <div className="py-3">
                    <Link 
                        href={propertyLinks.propertyDetail}
                        className={'text-sm text-gray-600 leading-relaxed'}
                    >
                        {formattedValues.description}
                    </Link>
                </div>
                
                {/* Mobile-optimized property details with better spacing */}
                <div className="py-3 flex flex-wrap gap-3 sm:gap-4 justify-start text-sm">
                    {displayLogic.showBedrooms && (
                        <div className="flex items-center min-h-[32px]">
                            <Dot size={18} className="text-gray-400"/>
                            {property.bedrooms < 1 ? 'Studio' : (
                                <p className="flex items-center gap-1">
                                    <span>Bed</span>
                                    <span className="font-medium">{property.bedrooms}</span>
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex items-center min-h-[32px]">
                        <Dot size={18} className="text-gray-400"/>
                        <p className="flex items-center gap-1">
                            <span>Bath</span>
                            <span className="font-medium">{property.bathrooms}</span>
                        </p>
                    </div>
                    <div className="flex items-center min-h-[32px]">
                        <Dot size={18} className="text-gray-400"/>
                        <p className="flex items-center gap-1">
                            <span>Size</span>
                            <span className="font-medium">{formattedValues.size}</span>
                        </p>
                    </div>
                </div>
                
                {/* Mobile-optimized CTA section with better touch targets */}
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 items-stretch sm:items-center py-3 justify-between">
                    <Link
                        className={'py-3 px-6 rounded-full hover:bg-black hover:text-white text-sm border border-gray-300 hover:border-black transition-all duration-200 text-center font-medium min-h-[44px] flex items-center justify-center flex-1 sm:flex-none'}
                        href={propertyLinks.propertyDetail}
                    >
                        View Property
                    </Link>
                    <p className={'text-lg sm:text-xl font-semibold text-center sm:text-right'}>
                        {formattedValues.price}
                    </p>
                </div>
            </div>
        </div>
    );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;