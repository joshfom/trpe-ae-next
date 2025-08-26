"use client"
import React, {memo, useCallback} from 'react';
import {Crown} from "lucide-react";
import { useRouter } from 'next/navigation';

interface AdminCommunityCardProps {
    community: CommunityType
}

const AdminCommunityCard = memo(({community}: AdminCommunityCardProps) => {
    const router = useRouter();

    const handleEditClick = useCallback(() => {
        router.push(`/admin/communities/${community.id}/edit`);
    }, [community.id, router]);

    const handleLuxeToggle = useCallback(() => {
        // This can be implemented later as a separate quick action
        console.log('Toggle luxe for community:', community.id);
    }, [community.id]);

    return (
        <div className={'bg-white p-4 rounded-lg shadow-sm border'}>
            <div className="relative">
                {community.image && (
                    <img 
                        src={community.image} 
                        alt={community.name || 'Community image'}
                        className={'h-60 w-full object-cover rounded-lg'}
                    />
                )}
                {!community.image && (
                    <div className={'h-60 w-full bg-gray-200 rounded-lg flex items-center justify-center'}>
                        <span className={'text-gray-500'}>No Image</span>
                    </div>
                )}
                
                {community.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Featured
                    </div>
                )}
                
                {community.isLuxe && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <Crown size={12} />
                        Luxe
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h3 className={'text-lg font-semibold mb-2'}>{community.name}</h3>
                
                {community.metaDesc && (
                    <p className={'text-sm text-gray-600 mb-4 line-clamp-2'}>
                        {community.metaDesc}
                    </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Order: {community.displayOrder}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                        community.isLuxe ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                        {community.isLuxe ? 'Luxe' : 'Standard'}
                    </span>
                </div>

                <div className={'flex gap-2'}>
                    <button 
                        onClick={handleLuxeToggle}
                        className={`text-sm py-1 px-3 border rounded-2xl transition-colors ${
                            community.isLuxe 
                                ? 'border-purple-300 text-purple-700 hover:bg-purple-50' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {community.isLuxe ? 'Disable Luxe' : 'Enable Luxe'}
                    </button>
                    <button 
                        onClick={handleEditClick} 
                        className={'text-sm py-1 px-3 border border-blue-300 text-blue-700 rounded-2xl hover:bg-blue-50 transition-colors'}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
});

AdminCommunityCard.displayName = 'AdminCommunityCard';

export default AdminCommunityCard;