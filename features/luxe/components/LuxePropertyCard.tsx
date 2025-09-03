'use client'
import React, {memo, useMemo} from 'react';
import {Dot} from "lucide-react";
import Link from "next/link";
import {truncateText} from "@/lib/truncate-text";
import currencyConverter from "@/lib/currency-converter";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {PropertyType} from "@/types/property";

interface LuxePropertyCardProps {
    property: PropertyType
}

const LuxePropertyCard = memo<LuxePropertyCardProps>(({property}) => {
    // Memoize computed values
    const size = useMemo(() => property.size ? property.size / 100 : 0, [property.size]);
    const imageUrls = useMemo(() => 
        property.images.map(image => image.s3Url), 
        [property.images]
    );
    
    // Memoize display logic 
    const showBedrooms = useMemo(() => {
        return property.bedrooms > 0 && property.offeringType && 
            (property.offeringType.slug === 'for-sale' || property.offeringType.slug === 'for-rent');
    }, [property.bedrooms, property.offeringType]);

    // Memoize links
    const propertyLink = useMemo(() => 
        property.offeringType ? `/properties/${property.offeringType.slug}/${property.slug}` : "#",
        [property.offeringType, property.slug]
    );

    // Memoize formatted values
    const formattedValues = useMemo(() => ({
        title: truncateText(property.title, 60),
        description: prepareExcerpt(property.description, 90),
        price: currencyConverter(parseInt(property.price)),
        size: size ? `${size.toLocaleString()} sq.ft` : null
    }), [property.title, property.description, property.price, size]);

    const firstImageUrl = useMemo(() => 
        property.images.length > 0 ? property.images[0].s3Url : null,
        [property.images]
    );

    return (
        <div className={'rounded-xl bg-white'}>
            <div className="relative">
                <div className="relative">
                    {firstImageUrl && (
                        <div className="h-96 relative">
                            <img
                                src={firstImageUrl}
                                alt={property.name || 'Property Image'}
                                className="pointer-events-none object-cover absolute inset-0 w-full h-full"
                                loading="lazy"
                            />
                        </div>
                    )}
                </div>
                <div className="absolute top-2 right-2 z-10 rounded-xl bg-black text-white flex space-x-3">
                    {property.offeringType && (
                        <p className="rounded-full text-xs px-5 py-1">
                            {property.offeringType.name}
                        </p>
                    )}
                </div>
            </div>
            <div className="py-3 px-4 pt-8 border-b border-x rounded-b-xl text-slate-700 border-white/20 relative">
                <div className="flex flex-col space-y-2 text-lg justify-center">
                    <Link href={propertyLink} className={'font-semibold'}>
                        {formattedValues.title}
                    </Link>
                </div>
                <div className="py-2">
                    <Link href={propertyLink} className={'text-sm text-slate-700'}>
                        {formattedValues.description}
                    </Link>
                </div>
                <div className="absolute z-20 -top-4 left-4">
                    {property.type && (
                        <p className={'rounded-full shadow-lg bg-[#141414] border-b text-white border-slate-300 py-1 px-6 text-center text-sm'}>
                            <span className="sr-only">Property Details</span>
                            {property.type.name}
                        </p>
                    )}
                </div>
                <div className="py-3 flex flex-wrap gap-4 justify-start">
                    {showBedrooms && (
                        <>
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
                            <div className="flex justify-center items-center">
                                <Dot size={18}/>
                                Bath
                                <p className="ml-2">
                                    {property.bathrooms}
                                </p>
                            </div>
                        </>
                    )}
                    <div className="flex grow items-center">
                        <Dot size={18}/>
                        <span className="">Size</span>
                        <p className="ml-2">
                            {formattedValues.size}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 py-3 justify-between">
                    <Link
                        className={'py-1.5 px-5 rounded-full hover:bg-slate-100 text-sm border'}
                        href={"#"}>
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

LuxePropertyCard.displayName = 'LuxePropertyCard';

export default LuxePropertyCard;