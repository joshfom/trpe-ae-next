import React from 'react';
import LuxePropertyDetailSSR from '../luxe/property/[slug]/LuxePropertyDetailSSR';

// Mock property data for testing
const mockProperty = {
    id: 'test-property',
    title: 'Test Luxury Property',
    slug: 'test-luxury-property',
    price: '5000000',
    bedrooms: 4,
    bathrooms: 5,
    size: 3500,
    description: '<p>This is a beautiful luxury property with stunning views and premium finishes.</p>',
    community: {
        id: 'test-community',
        name: 'Palm Jumeirah',
        slug: 'palm-jumeirah'
    },
    city: {
        id: 'test-city',
        name: 'Dubai',
        slug: 'dubai'
    },
    type: {
        id: 'test-type',
        name: 'Apartment',
        slug: 'apartment'
    },
    offeringType: {
        id: 'test-offering',
        name: 'For Sale',
        slug: 'for-sale'
    },
    agent: {
        id: 'test-agent',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+971-50-123-4567',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    },
    images: [
        {
            id: 'img1',
            crmUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
        },
        {
            id: 'img2',
            crmUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
        },
        {
            id: 'img3',
            crmUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
        }
    ]
};

// Test component to verify SSR content
export default function TestSSRPropertyPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold p-4 bg-blue-100">SSR Property Test Page</h1>
            <LuxePropertyDetailSSR property={mockProperty as any} />
        </div>
    );
}
