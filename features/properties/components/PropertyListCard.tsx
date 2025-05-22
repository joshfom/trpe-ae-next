"use client";
import React from 'react';
import Link from "next/link";
import Image from 'next/image'
import {truncateText} from "@/lib/truncate-text";
import currencyConverter from "@/lib/currency-converter";
import {Dot} from "lucide-react";
import unitConverter from "@/lib/unit-converter";

interface PropertyListCardProps {
    listing: PropertyType
}

function PropertyListCard({listing}: PropertyListCardProps) {
    const size = listing.size / 100
    return (
        <div className={'flex flex-col rounded-lg lg:rounded-2xl overflow-hidden border border-gray-700 hover:border-white'}>
            <div className={'col-span-1 relative h-64'}>
               <Link href={`/properties/${listing.offeringType.slug}/${listing.slug}`}>
                   <Image
                       fill={true}
                       className={'h-64 w-full object-cover'}
                       src={listing.images[0].crmUrl} alt={listing.title}
                   />
                </Link>
            </div>
            <div className={'flex flex-col justify-between p-4 col-span-1 lg:col-span-2 text-white'}>
                <div className="flex-1 space-y-1 lg:space-y-4">
                    <Link href={`/properties/${listing.offeringType.slug}/${listing.slug}`}>
                    <h3
                        className={'text-lg font-semibold'}
                        title={listing.title}
                    >
                        {
                            truncateText(listing.title, 30)
                        }
                    </h3>
                    </Link>
                    <p className={'text-sm text-slate-200'}>
                        {
                            truncateText(listing.description, 95)
                        }
                    </p>

                </div>
                <div className={'flex gap-1 lg:gap-6 py-4 flex-col lg:flex-row'}>
                    {
                        listing.bedrooms ? (
                            <div className={'flex items-center space-x-2'}>
                                <Dot size={20}/>
                                <span>{listing.bedrooms} Bed{listing.bedrooms > 1 && 's'}</span>
                            </div>
                        ) :
                        (
                            <div className={'flex items-center space-x-2'}>
                                <Dot size={20}/>
                                <span>Studio</span>
                            </div>
                        )
                    }
                    {
                        listing.bathrooms && (
                            <div className={'flex items-center space-x-2'}>
                                <Dot size={20}/>
                                <span>{listing.bathrooms} Bath{listing.bathrooms > 2 && 's'}</span>
                            </div>
                        )
                    }
                    {
                        listing.size && (
                            <div className={'flex items-center space-x-2'}>
                                <Dot size={20}/>
                                <span>{unitConverter(size)}</span>
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 py-2 justify-between">
                    <Link className={'py-2 px-5 rounded-full border border-white text-white'} href={`/properties/${listing.offeringType.slug}/${listing.slug}`}>View Property</Link>
                    <p className={'text-xl font-semibold'}>
                        {
                            currencyConverter(parseInt(listing.price))
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PropertyListCard;

PropertyListCard.Skeleton = () => {

}