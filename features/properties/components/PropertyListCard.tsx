"use client";
import React, { memo, useMemo } from 'react';
import Link from "next/link";
import Image from 'next/image'
import { truncateText } from "@/lib/truncate-text";
import currencyConverter from "@/lib/currency-converter";
import { Dot } from "lucide-react";
import unitConverter from "@/lib/unit-converter";

interface PropertyListCardProps {
    listing: PropertyType
}

const PropertyListCard = memo<PropertyListCardProps>(({ listing }) => {
    // Memoize computed values
    const size = useMemo(() => listing.size / 100, [listing.size]);
    
    const propertyLinks = useMemo(() => ({
        detail: `/properties/${listing.offeringType.slug}/${listing.slug}`
    }), [listing.offeringType.slug, listing.slug]);

    const formattedValues = useMemo(() => ({
        title: truncateText(listing.title, 30),
        description: truncateText(listing.description, 95),
        price: currencyConverter(parseInt(listing.price)),
        size: unitConverter(size)
    }), [listing.title, listing.description, listing.price, size]);

    const firstImage = useMemo(() => 
        listing.images && listing.images.length > 0 ? listing.images[0].crmUrl : null,
        [listing.images]
    );

    const bedroomDisplay = useMemo(() => {
        if (listing.bedrooms) {
            return `${listing.bedrooms} Bed${listing.bedrooms > 1 ? 's' : ''}`;
        }
        return 'Studio';
    }, [listing.bedrooms]);

    const bathroomDisplay = useMemo(() => 
        `${listing.bathrooms} Bath${listing.bathrooms > 2 ? 's' : ''}`,
        [listing.bathrooms]
    );

    return (
        <div className={'flex flex-col rounded-lg lg:rounded-2xl overflow-hidden border border-gray-700 hover:border-white transition-colors'}>
            <div className={'col-span-1 relative h-64'}>
               <Link href={propertyLinks.detail}>
                   {firstImage && (
                       <Image
                           fill={true}
                           className={'h-64 w-full object-cover'}
                           src={firstImage}
                           alt={listing.title}
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                           loading="lazy"
                       />
                   )}
                </Link>
            </div>
            <div className={'flex flex-col justify-between p-4 col-span-1 lg:col-span-2 text-white'}>
                <div className="flex-1 space-y-1 lg:space-y-4">
                    <Link href={propertyLinks.detail}>
                        <h3
                            className={'text-lg font-semibold hover:underline'}
                            title={listing.title}
                        >
                            {formattedValues.title}
                        </h3>
                    </Link>
                    <p className={'text-sm text-slate-200'}>
                        {formattedValues.description}
                    </p>
                </div>
                <div className={'flex gap-1 lg:gap-6 py-4 flex-col lg:flex-row'}>
                    <div className={'flex items-center space-x-2'}>
                        <Dot size={20}/>
                        <span>{bedroomDisplay}</span>
                    </div>
                    {listing.bathrooms && (
                        <div className={'flex items-center space-x-2'}>
                            <Dot size={20}/>
                            <span>{bathroomDisplay}</span>
                        </div>
                    )}
                    {listing.size && (
                        <div className={'flex items-center space-x-2'}>
                            <Dot size={20}/>
                            <span>{formattedValues.size}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 py-2 justify-between">
                    <Link 
                        className={'py-2 px-5 rounded-full border border-white text-white hover:bg-white hover:text-black transition-colors'} 
                        href={propertyLinks.detail}
                    >
                        View Property
                    </Link>
                    <p className={'text-xl font-semibold'}>
                        {formattedValues.price}
                    </p>
                </div>
            </div>
        </div>
    );
});

PropertyListCard.displayName = 'PropertyListCard';

// Skeleton component for loading states
const PropertyListCardSkeleton = memo(() => (
    <div className={'flex flex-col rounded-lg lg:rounded-2xl overflow-hidden border border-gray-700 animate-pulse'}>
        <div className={'col-span-1 relative h-64 bg-gray-600'}></div>
        <div className={'flex flex-col justify-between p-4 col-span-1 lg:col-span-2 text-white'}>
            <div className="flex-1 space-y-1 lg:space-y-4">
                <div className="h-6 bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-600 rounded w-2/3"></div>
            </div>
            <div className={'flex gap-1 lg:gap-6 py-4 flex-col lg:flex-row'}>
                <div className="h-5 bg-gray-600 rounded w-20"></div>
                <div className="h-5 bg-gray-600 rounded w-20"></div>
                <div className="h-5 bg-gray-600 rounded w-20"></div>
            </div>
            <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 py-2 justify-between">
                <div className="h-10 bg-gray-600 rounded-full w-32"></div>
                <div className="h-6 bg-gray-600 rounded w-24"></div>
            </div>
        </div>
    </div>
));

PropertyListCardSkeleton.displayName = 'PropertyListCardSkeleton';

// Attach skeleton as a static property
(PropertyListCard as any).Skeleton = PropertyListCardSkeleton;

export default PropertyListCard;