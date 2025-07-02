'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bath, Bed, MapPin, Phone, Share } from "lucide-react";
import Link from "next/link";
import "swiper/css";
import 'swiper/css/pagination';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShareSocial } from "react-share-social";
import { ImageSwiper } from "@/features/properties/components/ImageSwiper";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import { PropertyType } from "@/types/property";
import "yet-another-react-lightbox/plugins/captions.css";
import { Zoom } from "yet-another-react-lightbox/plugins";
import RequestCallBack from "@/features/site/components/RequestCallBack";
import PropSize from '@/components/ui/icons/PropSize';
import { ServerProcessedTiptap } from '@/components/ServerProcessedTiptap';

interface LuxePropertyDetailViewProps {
    property: PropertyType;
}

interface LuxePropertyDetailViewProps {
    property: PropertyType;
}

function LuxePropertyDetailView({ property }: LuxePropertyDetailViewProps) {
    const [viewGallery, setViewGallery] = useState(false);

    const {
        title,
        community,
        subCommunity,
        city,
        offeringType,
        bedrooms,
        bathrooms,
        size,
        price,
        referenceNumber,
        description,
        images,
        agent,
    } = property;

    // Simple calculations without useMemo to avoid rerender issues
    const imageUrls = images?.map(image => image.crmUrl || image.s3Url) || [];
    const lightboxImages = images?.map((image, index) => ({
        src: image.crmUrl || image.s3Url,
        caption: `${title} - Image ${index + 1}`,
    })) || [];
    const agentName = agent ? `${agent.firstName} ${agent.lastName}`.trim() : '';
    const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
    
    // Simple currency formatter without external dependencies
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-AE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };
    
    // Simple unit converter
    const formatSize = (sizeValue: number | string) => {
        const num = typeof sizeValue === 'string' ? parseFloat(sizeValue) : sizeValue;
        return `${new Intl.NumberFormat('en-AE').format(num)} sqft`;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Lightbox for gallery */}
            <Lightbox
                open={viewGallery}
                close={() => setViewGallery(false)}
                slides={lightboxImages}
                plugins={[Captions, Zoom]}
                carousel={{ finite: true }}
                render={{
                    buttonPrev: lightboxImages?.length <= 1 ? () => null : undefined,
                    buttonNext: lightboxImages?.length <= 1 ? () => null : undefined,
                }}
            />

            {/* Hero Section with Image Gallery */}
            <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
                <div onClick={() => setViewGallery(true)} className="cursor-pointer">
                    <ImageSwiper 
                        images={imageUrls} 
                        propertyName={title}
                    />
                </div>
                
                {/* Luxury overlay with property info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-white">
                            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-playfair font-light mb-4 leading-tight">
                                {title}
                            </h1>
                            <div className="flex items-center text-lg sm:text-xl text-gray-200 mb-4">
                                <MapPin className="w-5 h-5 mr-2" />
                                {`${subCommunity?.name ? subCommunity.name + ", " : ""}${community.name}, ${city.name}`}
                            </div>
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-light">
                                {formatPrice(priceNumber)} AED
                                {offeringType?.name === 'For Rent' && <span className="text-lg"> / year</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Property Details */}
                    <div className="lg:col-span-2">
                        {/* Property Stats */}
                        <div className="grid grid-cols-3 gap-6 mb-12 p-6 bg-gray-50 rounded-2xl">
                            <div className="text-center">
                                <div className="flex justify-center mb-3">
                                    <Bed className="w-8 h-8 text-gray-600" />
                                </div>
                                <div className="text-2xl font-light text-gray-900">{bedrooms || 0}</div>
                                <div className="text-sm text-gray-600">Bedrooms</div>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-3">
                                    <Bath className="w-8 h-8 text-gray-600" />
                                </div>
                                <div className="text-2xl font-light text-gray-900">{bathrooms || 0}</div>
                                <div className="text-sm text-gray-600">Bathrooms</div>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-3">
                                    <PropSize className="w-8 h-8 text-gray-600" />
                                </div>
                                <div className="text-2xl font-light text-gray-900">{formatSize(size)}</div>
                                <div className="text-sm text-gray-600">Size</div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-playfair font-light text-gray-900 mb-6">Description</h2>
                            <div className="prose prose-lg max-w-none text-gray-700">
                                <ServerProcessedTiptap content={description || ''} />
                            </div>
                        </div>

                        {/* Property Reference */}
                        <div className="p-6 bg-gray-50 rounded-2xl">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Reference</h3>
                            <p className="text-gray-600">{referenceNumber}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Agent Contact Card */}
                            {agent && (
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Agent</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{agentName}</div>
                                            <div className="text-sm text-gray-600">Luxury Property Specialist</div>
                                        </div>
                                        <div className="space-y-3">
                                            <Button 
                                                className="w-full bg-black text-white hover:bg-gray-800 rounded-full" 
                                                size="lg"
                                            >
                                                <Phone className="w-4 h-4 mr-2" />
                                                Call Now
                                            </Button>
                                            <RequestCallBack 
                                                itemUrl={typeof window !== 'undefined' ? window.location.href : ''}
                                                itemType="property"
                                                agentName={agentName}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Share Property */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Property</h3>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full rounded-full">
                                            <Share className="w-4 h-4 mr-2" />
                                            Share
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-0" align="end">
                                        <ShareSocial
                                            url={typeof window !== 'undefined' ? window.location.href : ''}
                                            socialTypes={['facebook', 'twitter', 'whatsapp', 'linkedin', 'email']}
                                            style={{
                                                background: 'white',
                                                borderRadius: '12px',
                                                border: 'none',
                                                color: '#333'
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Popular Searches */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Searches</h3>
                                <div className="space-y-2">
                                    <Link 
                                        href={`/luxe/properties?community=${community.slug}`}
                                        className="block text-sm text-gray-600 hover:text-black hover:underline transition-colors"
                                    >
                                        Luxury Properties in {community.name}
                                    </Link>
                                    <Link 
                                        href={`/luxe/properties?type=${offeringType.slug}`}
                                        className="block text-sm text-gray-600 hover:text-black hover:underline transition-colors"
                                    >
                                        Luxury Properties {offeringType.name}
                                    </Link>
                                    <Link 
                                        href="/luxe/properties"
                                        className="block text-sm text-gray-600 hover:text-black hover:underline transition-colors"
                                    >
                                        All Luxury Properties
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LuxePropertyDetailView;
