'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LuxePropCard from '@/components/luxe/LuxePropCard';

interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  beds: number;
  baths: number;
  sqft: number;
  status: 'For Sale' | 'For Rent';
  imageUrl: string;
}

interface CommunityData {
  id: string;
  name: string;
  imageUrl: string;
  propertyCount: number;
  slug: string;
}

interface FeaturedLuxeListingsClientProps {
  properties: PropertyData[];
  communities?: CommunityData[];
  className?: string;
}

const animationVariants = {
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }
};

export default function FeaturedLuxeListingsClient({ 
  properties, 
  className = '' 
}: FeaturedLuxeListingsClientProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Featured Properties Section */}
      <motion.h2 
        className='text-2xl sm:text-3xl font-playfair mb-4 sm:mb-6 text-center lg:text-left'
        variants={animationVariants.fadeInUp}
      >
        Featured Listings
      </motion.h2>
      
      <motion.div 
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-8'
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
        variants={animationVariants.staggerContainer}
      >
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            variants={animationVariants.fadeInUp}
            whileHover={{ 
              y: index === 0 ? -8 : -10,
              scale: index === 0 ? 1.01 : 1.02,
              transition: { 
                duration: index === 0 ? 0.8 : 0.3, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }
            }}
          >
            <LuxePropCard 
              id={property.id}
              title={property.title}
              location={property.location}
              className='bg-white'
              price={property.price}
              showPrice={false}
              beds={property.beds}
              baths={property.baths}
              sqft={property.sqft}
              status={property.status}
              imageUrl={property.imageUrl}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
