'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Bath, Bed, MapPin, Phone, Share } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useMediaQuery } from "react-responsive";
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
import { TipTapView } from '@/components/TiptapView';

interface OptimizedLuxePropertyDetailProps {
    property: PropertyType;
}

// Memoized image gallery component to prevent unnecessary re-renders
const MemoizedImageGallery = React.memo(({ 
    images, 
    title, 
    onOpenGallery 
}: { 
    images: string[], 
    title: string, 
    onOpenGallery: () => void 
}) => {
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
    
    if (isMobile) {
        return (
            <div className="relative h-[430px]">
                <ImageSwiper images={images} propertyName={title} />
                <div className="absolute bottom-4 left-4">
                    <Button 
                        onClick={onOpenGallery}
                        className="bg-black/70 border-0 text-white hover:bg-black/90"
                        variant="outline"
                    >
                        View Gallery
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-1 rounded-lg overflow-hidden">
            <div className="col-span-1 lg:col-span-2 relative h-[300px] lg:h-[604px]">
                <img 
                    onClick={onOpenGallery}
                    className="w-full rounded-lg overflow-hidden h-full object-cover absolute top-0 left-0 cursor-pointer"
                    src={images[0] || '/images/defaults/property.jpg'}
                    alt={`${title} - Main image`}
                />
                <div className="absolute bottom-4 left-4">
                    <Button 
                        onClick={onOpenGallery}
                        className="bg-black/70 border-0 text-white hover:bg-black/90"
                        variant="outline"
                    >
                        View Gallery
                    </Button>
                </div>
            </div>
            <div className="col-span-1 grid gap-1">
                <div className="relative rounded-lg overflow-hidden h-[150px] lg:h-[300px]">
                    <img 
                        onClick={onOpenGallery}
                        className="w-full object-cover h-full absolute top-0 left-0 cursor-pointer"
                        src={images[1] || '/images/defaults/property.jpg'}
                        alt={`${title} - Secondary image`}
                    />
                </div>
                <div className="h-[150px] lg:h-[300px] rounded-lg overflow-hidden relative">
                    <img 
                        onClick={onOpenGallery}
                        className="w-full object-cover h-full absolute top-0 left-0 cursor-pointer"
                        src={images[2] || '/images/defaults/property.jpg'}
                        alt={`${title} - Third image`}
                    />
                </div>
            </div>
        </div>
    );
});

MemoizedImageGallery.displayName = 'MemoizedImageGallery';

// Memoized property stats component
const MemoizedPropertyStats = React.memo(({ 
    bedrooms, 
    bathrooms, 
    size 
}: { 
    bedrooms: number, 
    bathrooms: number, 
    size: number | string 
}) => {
    const formatSize = useMemo(() => {
        const num = typeof size === 'string' ? parseFloat(size) : size;
        return `${new Intl.NumberFormat('en-AE').format(num)} sqft`;
    }, [size]);

    return (
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
                <div className="text-2xl font-light text-gray-900">{formatSize}</div>
                <div className="text-sm text-gray-600">Size</div>
            </div>
        </div>
    );
});

MemoizedPropertyStats.displayName = 'MemoizedPropertyStats';

// Memoized share component
const MemoizedShareComponent = React.memo(({ currentUrl }: { currentUrl: string }) => {
    const isMobileOrTablet = useMediaQuery({ query: '(max-width: 1024px)' });
    const shareDirection = isMobileOrTablet ? 'bottom' : 'left';

    // Don't render if URL is empty
    if (!currentUrl) return null;

    return (
        <div className="inline-block">
            <Popover>
                <PopoverTrigger className="inline-flex border-b group pb-1 hover:border-gray-400">
                    <Share size={20} className="mr-2 group-hover:text-gray-700"/>
                    <span className="group-hover:text-gray-700">
                        Share
                    </span>
                </PopoverTrigger>
                <PopoverContent 
                    className="bg-white shadow-lg border rounded-3xl max-w-[280px] overflow-hidden" 
                    align="center" 
                    side={shareDirection}
                >
                    <ShareSocial
                        url={currentUrl}
                        socialTypes={['whatsapp', 'telegram', 'facebook', 'twitter', 'email', 'reddit', 'linkedin']}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
});

MemoizedShareComponent.displayName = 'MemoizedShareComponent';

export default function OptimizedLuxePropertyDetail({ property }: OptimizedLuxePropertyDetailProps) {
    const [viewGallery, setViewGallery] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const pathname = usePathname();

    // Extract property data with default values
    const {
        title = '',
        community,
        subCommunity,
        city,
        offeringType,
        bedrooms = 0,
        bathrooms = 0,
        size = 0,
        price = 0,
        referenceNumber = '',
        description = '',
        images = [],
        agent,
    } = property;

    // Memoized calculations to prevent unnecessary re-renders
    const imageUrls = useMemo(() => {
        const urls = images?.map(image => image.crmUrl || image.s3Url).filter(Boolean) || [];
        return urls.length > 0 ? urls : ['/images/defaults/property.jpg'];
    }, [images]);

    const lightboxImages = useMemo(() => {
        if (!images || images.length === 0) {
            return [{
                src: '/images/defaults/property.jpg',
                caption: `${title} - No images available`,
            }];
        }
        return images.map((image, index) => ({
            src: image.crmUrl || image.s3Url,
            caption: `${title} - Image ${index + 1}`,
        }));
    }, [images, title]);

    const agentName = useMemo(() => 
        agent ? `${agent.firstName} ${agent.lastName}`.trim() : '',
        [agent]
    );

    const formattedPrice = useMemo(() => {
        const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('en-AE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(priceNumber);
    }, [price]);

    const locationString = useMemo(() => 
        `${subCommunity?.name ? subCommunity.name + ", " : ""}${community?.name || ''}, ${city?.name || ''}`,
        [subCommunity, community, city]
    );

    // Handle URL update only on client side to prevent server/client mismatch
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []); // Remove pathname dependency to prevent unnecessary re-renders

    // Memoized callback to prevent unnecessary re-renders
    const handleOpenGallery = useCallback(() => {
        setViewGallery(true);
    }, []);

    const handleCloseGallery = useCallback(() => {
        setViewGallery(false);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Lightbox for gallery */}
            <Lightbox
                open={viewGallery}
                close={handleCloseGallery}
                slides={lightboxImages}
                plugins={[Captions, Zoom]}
                carousel={{ finite: true }}
                render={{
                    buttonPrev: lightboxImages?.length <= 1 ? () => null : undefined,
                    buttonNext: lightboxImages?.length <= 1 ? () => null : undefined,
                }}
            />

            <div className="py-8 px-6 pt-32 max-w-7xl mx-auto">


                {/* Image Gallery */}
                <MemoizedImageGallery 
                    images={imageUrls} 
                    title={title} 
                    onOpenGallery={handleOpenGallery}
                />


                {/* Title */}
                <div className="lg:py-6 pb-4 px-6">
                    <h1 className="text-xl lg:text-3xl font-playfair font-light mb-4">
                        {title}
                    </h1>
                </div>

  
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    {/* Property Details */}
                    <div className="col-span-1 lg:col-span-2">
                        <div className="bg-white p-6 rounded-2xl">
                            {/* Property Stats */}
                            <MemoizedPropertyStats 
                                bedrooms={bedrooms} 
                                bathrooms={bathrooms} 
                                size={size}
                            />

                            {/* Location */}
                            <div className="py-4 flex items-center mb-6">
                                <MapPin className="w-6 stroke-1 h-6 mr-2"/>
                                <span className="text-gray-700">{locationString}</span>
                            </div>

                            {/* Description */}
                            <div className="mb-12">
                                <h2 className="text-3xl font-playfair font-light text-gray-900 mb-6">Description</h2>
                                <div className="prose prose-lg max-w-none text-gray-700">
                                    <TipTapView content={description} />
                                </div>
                            </div>

                            {/* Property Reference */}
                            <div className="p-6 bg-gray-50 rounded-2xl">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Reference</h3>
                                <p className="text-gray-600">{referenceNumber}</p>
                            </div>
                        </div>

                        {/* Related Links */}
                        <div className="py-6 px-6 lg:pt-12">
                            <h3 className="text-2xl">Related Searches</h3>
                            <ul className="space-y-1 flex flex-col mt-4">
                                <li>
                                    <Link 
                                        href={`/luxe/properties?community=${community?.slug}`}
                                        className="hover:text-blue-600 hover:underline py-1"
                                    >
                                        Luxury Properties in {community?.name}
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href={`/luxe/properties?type=${offeringType?.slug}`}
                                        className="hover:text-blue-600 hover:underline py-1"
                                    >
                                        Luxury Properties {offeringType?.name}
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/luxe/properties"
                                        className="hover:text-blue-600 hover:underline py-1"
                                    >
                                        All Luxury Properties
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-1 relative sm:px-4 lg:px-0">
                        <div className="lg:sticky lg:top-32 rounded-2xl p-6 space-y-8 bg-black shadow-md text-white">
                            {/* Property Type */}
                            <p className="text-sm">
                                <span className="py-1 px-4 rounded-full border">
                                    {offeringType?.name}
                                </span>
                            </p>

                            {/* Price */}
                            <h3 className="text-2xl font-semibold">
                                {formattedPrice} AED
                                {offeringType?.name === 'For Rent' && <span className="text-lg"> / year</span>}
                            </h3>

                            {/* Agent Info */}
                            {agent && (
                                <div className="flex items-center">
                                    <div>
                                        <Link href={`/our-team/${agent.slug}`} aria-label="agent profile">
                                            <img
                                                className="rounded-full object-cover w-[90px] h-[90px]"
                                                src={agent.avatarUrl || '/images/defaults/agent.jpg'}
                                                alt={`${agentName} - Property Agent`}
                                            />
                                        </Link>
                                    </div>
                                    <div className="space-y-2 ml-4">
                                        <Link 
                                            href={`/our-team/${agent.slug}`}
                                            className="text-lg font-semibold hover:underline"
                                        >
                                            {agentName || 'TRPE Team'}
                                        </Link>
                                        <p className="text-sm">Luxury Property Specialist</p>
                                        {agent.rera && <p className="text-sm text-white">BRN: {agent.rera}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Contact Actions */}
                            <div className="space-y-6">
                                <RequestCallBack
                                    agentName={agentName}
                                    itemUrl={currentUrl}
                                    itemType="Property"
                                />
                                
                                <div>
                                    <p className="text-center">Need immediate assistance?</p>
                                    <div className="pt-4">
                                        <Button 
                                            className="w-full py-2 items-center justify-center rounded-full border group hover:bg-white hover:text-black"
                                            variant="outline"
                                            asChild
                                        >
                                            <a href={`tel:${agent?.phone || '+971505232712'}`}>
                                                <Phone size={20} className="stroke-1 group-hover:text-black text-white mr-2"/>
                                                Call Now
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                             <MemoizedShareComponent currentUrl={currentUrl} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
