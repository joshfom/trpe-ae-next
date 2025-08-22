"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CommunitiesProps {
  classNames?: string;
}

const Communities = ({ classNames = "" }: CommunitiesProps) => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before making API calls
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side after mounting
    if (!mounted || typeof window === 'undefined') {
      return;
    }

    const fetchCommunities = async () => {
      try {
        // Add a small delay to ensure the component is fully mounted
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = await fetch('/api/communities/list');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const data = responseData.communities || responseData || [];
        setCommunities(data);
      } catch (error) {
        console.warn('Communities: Error fetching communities:', error);
        setCommunities([]); // Set empty array instead of keeping loading state
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [mounted]); // Depend on mounted state

  // Don't render anything complex during SSR
  if (!mounted) {
    return (
      <div className={`max-w-7xl mx-auto lg:pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${classNames}`}>
        {/* Loading state handled by parent Suspense component */}
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`max-w-7xl mx-auto lg:pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${classNames}`}>
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
