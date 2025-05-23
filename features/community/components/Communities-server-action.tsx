"use client"
import React, { useState, useEffect } from 'react';
import { getCommunitiesAction } from '@/actions/get-communities-action';
import Link from 'next/link';
import Image from 'next/image';

interface CommunitiesProps {
  classNames?: string;
}

const Communities = ({ classNames = "" }: CommunitiesProps) => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await getCommunitiesAction();
        setCommunities(data || []);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto lg:pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Loading state handled by parent Suspense component */}
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto lg:pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${classNames}`}>
      {communities && communities.length > 0 ? (
        communities.map((community) => (
          <Link 
            href={`/community/${community.slug}`} 
            key={community.id}
            className="bg-white hover:shadow-lg transition-shadow duration-300 ease-in-out"
          >
            <div className="relative w-full h-60 rounded-lg overflow-hidden">
              {community.image ? (
                <Image 
                  src={community.image} 
                  alt={community.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            <div className="px-4 text-center py-2">
              <h3 className="font-semibold text-lg">{community.name}</h3>
              {community.propertyCount !== undefined && (
                <p className="text-sm text-gray-500">{community.propertyCount} Properties</p>
              )}
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-3 text-center py-10">
          <p>No communities found</p>
        </div>
      )}
    </div>
  );
};

export default Communities;
