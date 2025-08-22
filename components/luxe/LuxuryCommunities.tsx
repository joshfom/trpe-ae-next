"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface CommunityCardProps {
  id?: string;
  title: string;
  itemCount: number;
  imageUrl: string;
  href?: string;
  description: string;
  index: number;
  isExpanded: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const CommunityCard = ({ 
  title, 
  itemCount, 
  imageUrl, 
  href = "#", 
  description,
  index,
  isExpanded,
  onHover,
  onLeave
}: CommunityCardProps) => {
  return (
    <Link href={href}>
      <motion.div 
        className="relative cursor-pointer overflow-hidden rounded-lg h-[500px] bg-gray-100"
        animate={{
          flex: isExpanded ? "3 1 0%" : "1 1 0%",
          transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
        }}
        onHoverStart={onHover}
        onHoverEnd={onLeave}
        whileHover={{ 
          scale: 1.01,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        style={{ 
          minWidth: isExpanded ? "300px" : "120px",
          flex: isExpanded ? "3 1 0%" : "1 1 0%"
        }}
      >
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          opacity: isExpanded ? 1 : 0.3,
          scale: isExpanded ? 1 : 1.1,
          transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Dark Overlay */}
      <motion.div 
        className="absolute inset-0 bg-black"
        animate={{
          opacity: isExpanded ? 0.4 : 0.6,
          transition: { duration: 0.7 }
        }}
      />

      {/* Collapsed State - Number and Vertical Title */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-center text-white"
        animate={{
          opacity: isExpanded ? 0 : 1,
          transition: { duration: 0.4, ease: "easeInOut" }
        }}
        style={{ pointerEvents: isExpanded ? 'none' : 'auto' }}
      >
        <motion.div
          className="text-4xl font-bold opacity-30 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.3 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>
        
        {/* Vertical Text */}
        <motion.div
          className="flex justify-center items-center h-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
        >
          <h3
            className="text-lg font-medium tracking-wider"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              letterSpacing: '0.15em',
              lineHeight: '1.2'
            }}
          >
            {title}
          </h3>
        </motion.div>
      </motion.div>

      {/* Expanded State - Full Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-between p-8 text-white"
        animate={{
          opacity: isExpanded ? 1 : 0,
          transition: { duration: 0.5, delay: isExpanded ? 0.3 : 0 }
        }}
        style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
      >
        {/* Top Content */}
        <div>
          <motion.div
            className="text-4xl font-bold opacity-30 mb-2"
            animate={{
              scale: isExpanded ? 1 : 0.8,
              transition: { duration: 0.5, delay: 0.2 }
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.div>
          <motion.h3
            className="text-2xl font-bold mb-4"
            animate={{
              y: isExpanded ? 0 : 20,
              opacity: isExpanded ? 1 : 0,
              transition: { duration: 0.5, delay: 0.3 }
            }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-lg text-gray-200 leading-relaxed"
            animate={{
              y: isExpanded ? 0 : 30,
              opacity: isExpanded ? 1 : 0,
              transition: { duration: 0.5, delay: 0.4 }
            }}
            style={{ 
              maxWidth: isExpanded ? "400px" : "200px",
              display: isExpanded ? "block" : "none"
            }}
          >
            {description}
          </motion.p>
        </div>
        
        {/* Bottom Content */}
        <motion.div 
          className="flex items-center justify-between"
          animate={{
            y: isExpanded ? 0 : 40,
            opacity: isExpanded ? 1 : 0,
            transition: { duration: 0.5, delay: 0.5 }
          }}
        >
          <span className="text-lg font-medium">
            {itemCount} Properties
          </span>
          
          <motion.div 
            className="flex items-center justify-center"
            whileHover={{ 
              x: 5,
              transition: { duration: 0.2 }
            }}
          >
            <ArrowRight className="size-7 text-white" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
    </Link>
  );
};

const MobileCommunityCard = ({ 
  title, 
  itemCount, 
  imageUrl, 
  href = "#", 
  description,
  index
}: Omit<CommunityCardProps, 'isExpanded' | 'onHover' | 'onLeave'>) => {
  return (
    <Link href={href}>
      <motion.div 
        className="relative cursor-pointer overflow-hidden rounded-lg h-[350px] sm:h-[400px] bg-gray-100"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, delay: index * 0.1, ease: "easeOut" }
        }}
        viewport={{ once: false, amount: 0.3 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
      >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
        {/* Top Content */}
        <div>
          <div className="text-2xl font-bold opacity-30 mb-2">
            {String(index + 1).padStart(2, '0')}
          </div>
          <h3 className="text-xl font-bold mb-3">
            {title}
          </h3>
          <p className="text-sm text-gray-200 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
        
        {/* Bottom Content */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {itemCount} Properties
          </span>
          
          <motion.div 
            className="flex items-center justify-center"
            whileHover={{ 
              x: 3,
              transition: { duration: 0.2 }
            }}
          >
            <ArrowRight className="size-5 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
    </Link>
  );
};

interface CommunityData {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  propertyCount: number;
  slug: string;
}

interface LuxuryCommunitiesProps {
  className?: string;
  communities: CommunityData[];
}

export default function LuxuryCommunities({ className = "", communities }: LuxuryCommunitiesProps) {
  const [expandedIndex, setExpandedIndex] = useState(0); // Default first card expanded
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Debug: Log communities data
  console.log('LuxuryCommunities received:', communities);

  // Transform communities data for display
  const transformedCommunities = (communities || []).map((community, index) => ({
    id: community.id || `fallback-${index}`,
    title: community.name,
    itemCount: community.propertyCount,
    imageUrl: community.imageUrl,
    href: `/communities/${community.slug}`,
    description: `Discover luxury living in ${community.name}, ${community.location}. Experience world-class amenities and sophisticated design in one of Dubai's most prestigious communities.`
  }));

  // Use up to 4 communities for display
  const finalCommunities = transformedCommunities.slice(0, 4);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || finalCommunities.length === 0) return;
    
    const interval = setInterval(() => {
      setExpandedIndex((prev) => (prev + 1) % finalCommunities.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating, finalCommunities.length]);

  // Handle empty communities case or provide fallback
  if (!communities || communities.length === 0) {
    return (
      <motion.section 
        className={`w-full py-16 bg-gray-50 ${className}`}
        initial={{ opacity: 0 }}
        whileInView={{ 
          opacity: 1,
          transition: { duration: 0.8, ease: "easeOut" }
        }}
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" }
            }}
            viewport={{ once: false, amount: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Dubai&apos;s Most Coveted Corners
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Explore the most exclusive luxury communities across Dubai
            </p>
          </motion.div>
          
          {/* Fallback/Sample Communities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Palm Jumeirah",
                location: "Dubai, UAE",
                imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                propertyCount: 50
              },
              {
                name: "Downtown Dubai",
                location: "Dubai, UAE", 
                imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                propertyCount: 75
              },
              {
                name: "Dubai Marina",
                location: "Dubai, UAE",
                imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                propertyCount: 60
              },
              {
                name: "Jumeirah Beach Residence",
                location: "Dubai, UAE",
                imageUrl: "https://images.unsplash.com/photo-1569163139820-de6bfbef0cfc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                propertyCount: 45
              }
            ].map((community, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, delay: index * 0.1 }
                }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={community.imageUrl} 
                    alt={community.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{community.name}</h3>
                  <p className="text-gray-600 mb-4">{community.location}</p>
                  <p className="text-sm text-gray-500">{community.propertyCount} Luxury Properties</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  const handleCardHover = (index: number) => {
    setIsAutoRotating(false); // Stop auto-rotation on hover
    setExpandedIndex(index);
  };

  const handleCardLeave = () => {
    // Resume auto-rotation after a delay
    setTimeout(() => {
      setIsAutoRotating(true);
    }, 2000);
  };

  return (
    <motion.section 
      className={`w-full py-16 bg-gray-50 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ 
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" }
      }}
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
          }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <h2 className="text-4xl lg:text-5xl font-playfair font-light text-gray-900 mb-4">
            Dubai&apos;s Most Coveted Corners
          </h2>
        </motion.div>
        
        {/* Expandable Communities Cards */}
        {/* Desktop: Horizontal flex layout */}
        <motion.div 
          className="hidden lg:flex gap-2 h-[500px] w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
          }}
          viewport={{ once: false, amount: 0.3 }}
          style={{ width: '100%' }}
        >
          {finalCommunities.map((community, index) => (
            <CommunityCard
              key={community.id}
              title={community.title}
              itemCount={community.itemCount}
              imageUrl={community.imageUrl}
              href={community.href}
              description={community.description}
              index={index}
              isExpanded={expandedIndex === index}
              onHover={() => handleCardHover(index)}
              onLeave={handleCardLeave}
            />
          ))}
        </motion.div>

        {/* Mobile: Grid/Column layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
          }}
          viewport={{ once: false, amount: 0.3 }}
        >
          {finalCommunities.map((community, index) => (
            <MobileCommunityCard
              key={community.id}
              title={community.title}
              itemCount={community.itemCount}
              imageUrl={community.imageUrl}
              href={community.href}
              description={community.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
