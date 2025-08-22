import React from 'react';
import {Bath, Bed, MapPin, Phone} from "lucide-react";
import Link from "next/link";
import {PropertyType} from "@/types/property";
import {TipTapView} from '@/components/TiptapView';
import PropSize from '@/components/ui/icons/PropSize';

interface LuxePropertyDetailSSRProps {
    property: PropertyType;
}

// SSR-compatible image gallery component - Static version
const ImageGallerySSR = ({ 
    images, 
    title 
}: { 
    images: string[], 
    title: string 
}) => {
    // Provide fallback images if none exist
    const displayImages = images && images.length > 0 ? images : ['/images/defaults/property.jpg'];
    
    return (
        <>
            {/* Mobile Gallery */}
            <div className="lg:hidden relative h-[430px] rounded-lg overflow-hidden">
                <img 
                    className="w-full h-full object-cover"
                    src={displayImages[0]}
                    alt={`${title} - Main image`}
                    loading="eager"
                />
                <div className="absolute bottom-4 left-4">
                    <div className="bg-black/70 border-0 text-white px-4 py-2 rounded-md text-sm">
                        View Gallery ({displayImages.length} photo{displayImages.length > 1 ? 's' : ''})
                    </div>
                </div>
            </div>

            {/* Desktop Gallery */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-1 rounded-lg overflow-hidden">
                <div className="col-span-1 lg:col-span-2 relative h-[300px] lg:h-[604px]">
                    <img 
                        className="w-full rounded-lg overflow-hidden h-full object-cover absolute top-0 left-0"
                        src={displayImages[0]}
                        alt={`${title} - Main image`}
                        loading="eager"
                    />
                    <div className="absolute bottom-4 left-4">
                        <div className="bg-black/70 border-0 text-white px-4 py-2 rounded-md text-sm">
                            View Gallery ({displayImages.length} photo{displayImages.length > 1 ? 's' : ''})
                        </div>
                    </div>
                </div>
                <div className="col-span-1 grid gap-1">
                    <div className="relative rounded-lg overflow-hidden h-[150px] lg:h-[300px]">
                        <img 
                            className="w-full object-cover h-full absolute top-0 left-0"
                            src={displayImages[1] || displayImages[0]}
                            alt={`${title} - Secondary image`}
                            loading="eager"
                        />
                    </div>
                    <div className="h-[150px] lg:h-[300px] rounded-lg overflow-hidden relative">
                        <img 
                            className="w-full object-cover h-full absolute top-0 left-0"
                            src={displayImages[2] || displayImages[0]}
                            alt={`${title} - Third image`}
                            loading="eager"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

// SSR-compatible property stats component
const PropertyStatsSSR = ({ 
    bedrooms, 
    bathrooms, 
    size 
}: { 
    bedrooms?: number | null, 
    bathrooms?: number | null, 
    size?: number | null 
}) => {
    return (
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {bedrooms && bedrooms > 0 && (
                <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{bedrooms} bed{bedrooms > 1 ? 's' : ''}</span>
                </div>
            )}
            {bathrooms && bathrooms > 0 && (
                <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{bathrooms} bath{bathrooms > 1 ? 's' : ''}</span>
                </div>
            )}
            {size && size > 0 && (
                <div className="flex items-center gap-1">
                    <PropSize className="w-4 h-4" />
                    <span>{size.toLocaleString()} sq ft</span>
                </div>
            )}
        </div>
    );
};

// SSR-compatible share section
const ShareSectionSSR = ({ title }: { title: string }) => {
    return (
        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm cursor-not-allowed opacity-75">
            Share Property
        </div>
    );
};

const LuxePropertyDetailSSR: React.FC<LuxePropertyDetailSSRProps> = ({ property }) => {
    // Validate property data
    if (!property) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
                        <p className="text-gray-600 mb-4">The requested property could not be loaded.</p>
                        <Link
                            href="/luxe/properties"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            ← Back to Luxe Properties
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Prepare images array
    const images = property.images?.map(img => img.crmUrl || img.image).filter(Boolean) || [];
    
    // Format price
    const formatPrice = (price: string | null | undefined) => {
        if (!price) return 'Price on request';
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) return 'Price on request';
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numPrice);
    };

    // Debug output (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.log('SSR Property Data:', {
            title: property.title,
            hasImages: images.length > 0,
            price: property.price,
            hasAgent: !!property.agent,
            hasDescription: !!property.description
        });
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Back Navigation */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/luxe/properties"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        ← Back to Luxe Properties
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Image Gallery */}
                <div className="mb-8">
                    <ImageGallerySSR images={images} title={property.title} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Property Header */}
                        <div className="mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                        {property.title || 'Luxury Property'}
                                    </h1>
                                    <div className="flex items-center text-gray-600 mb-3">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span className="text-sm">
                                            {property.community?.name || 'Premium Location'}
                                            {property.city?.name && `, ${property.city.name}`}
                                        </span>
                                    </div>
                                    <PropertyStatsSSR 
                                        bedrooms={property.bedrooms}
                                        bathrooms={property.bathrooms}
                                        size={property.size}
                                    />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                        {formatPrice(property.price)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {property.offeringType?.name || 'Luxury Property'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property Description */}
                        {property.description && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                                <div className="prose prose-gray max-w-none">
                                    <TipTapView content={property.description} />
                                </div>
                            </div>
                        )}

                        {/* Property Details */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {property.bedrooms && property.bedrooms > 0 && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Bedrooms</span>
                                        <span className="font-medium">{property.bedrooms}</span>
                                    </div>
                                )}
                                {property.bathrooms && property.bathrooms > 0 && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Bathrooms</span>
                                        <span className="font-medium">{property.bathrooms}</span>
                                    </div>
                                )}
                                {property.size && property.size > 0 && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Size</span>
                                        <span className="font-medium">{property.size.toLocaleString()} sq ft</span>
                                    </div>
                                )}
                                {property.type?.name && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Property Type</span>
                                        <span className="font-medium">{property.type.name}</span>
                                    </div>
                                )}
                                {property.offeringType?.name && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Offering Type</span>
                                        <span className="font-medium">{property.offeringType.name}</span>
                                    </div>
                                )}
                                {property.community?.name && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Community</span>
                                        <span className="font-medium">{property.community.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
                            
                            {property.agent ? (
                                <div className="mb-6">
                                    <div className="flex items-center mb-3">
                                        {property.agent.avatarUrl && (
                                            <img
                                                src={property.agent.avatarUrl}
                                                alt={`${property.agent.firstName} ${property.agent.lastName}`}
                                                className="w-12 h-12 rounded-full object-cover mr-3"
                                            />
                                        )}
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {property.agent.firstName || ''} {property.agent.lastName || ''}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Luxury Property Advisor
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {property.agent.phone && (
                                        <a
                                            href={`tel:${property.agent.phone}`}
                                            className="flex items-center justify-center w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors mb-3"
                                        >
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call {property.agent.phone}
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                                            <div className="text-gray-600 text-sm font-medium">LA</div>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                Luxury Property Advisor
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                TRPE Luxe Team
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <a
                                        href="tel:+971-4-xxx-xxxx"
                                        className="flex items-center justify-center w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors mb-3"
                                    >
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call for Details
                                    </a>
                                </div>
                            )}

                            <div className="space-y-3">
                                <ShareSectionSSR title={property.title || 'Luxury Property'} />
                                
                                <div className="text-center">
                                    <div className="text-sm text-gray-600 mb-2">Request a callback</div>
                                    <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm cursor-not-allowed opacity-75">
                                        Contact Form (Enhanced with JS)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LuxePropertyDetailSSR;
