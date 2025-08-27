"use client";
import React from 'react';
import MenuFeaturedProperty from "@/features/site/components/MenuFeaturedProperty";

export default function TestFeaturedPropertiesPage() {
    return (
        <div className="min-h-screen bg-black p-8">
            <h1 className="text-white text-2xl mb-8">Featured Properties Test</h1>
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-white text-xl mb-4">For Sale Properties</h2>
                    <div className="bg-gray-800 rounded-lg">
                        <MenuFeaturedProperty offeringType="for-sale" />
                    </div>
                </div>
                
                <div>
                    <h2 className="text-white text-xl mb-4">For Rent Properties</h2>
                    <div className="bg-gray-800 rounded-lg">
                        <MenuFeaturedProperty offeringType="for-rent" />
                    </div>
                </div>
            </div>
        </div>
    );
}
