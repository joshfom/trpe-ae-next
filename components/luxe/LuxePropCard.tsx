"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Bed, Bath, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface LuxePropCardProps {
  id?: string;
  slug?: string;
  title?: string;
  location?: string;
  price?: number;
  currency?: string;
  beds?: number;
  showPrice?: boolean;
  baths?: number;
  sqft?: number;
  imageUrl?: string;
  rating?: number;
  className?: string;
  status?: "For Sale" | "For Rent" | "Sold";
}

export default function LuxePropCard({
  id,
  slug,
  title = "The Beverly House",
  location = "Beverly Hills, CA",
  price = 290000,
  currency = "AED",
  beds = 3,
  showPrice = true,
  baths = 2,
  sqft = 1500,
  imageUrl = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  rating = 5,
  className = "",
  status = "For Sale"
}: LuxePropCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toLocaleString();
  };

  const formatSqft = (sqft: number) => {
    return sqft.toLocaleString();
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn("bg-white rounded-3xl overflow-hidden transition-all duration-500 relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Electric Circuit Border Effect */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradient for the electric effect */}
            <linearGradient id="electric-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Border path - starts from top-left, goes clockwise */}
          <motion.path
            d="M 24 0 L 376 0 Q 400 0 400 24 L 400 476 Q 400 500 376 500 L 24 500 Q 0 500 0 476 L 0 24 Q 0 0 24 0"
            stroke="url(#electric-gradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            pathLength="1"
            initial={{
              strokeDasharray: "0 1",
              strokeDashoffset: 0,
            }}
            animate={{
              strokeDasharray: isHovered ? "0.15 0.85" : "0 1",
              strokeDashoffset: isHovered ? -2 : 0,
            }}
            transition={{
              duration: isHovered ? 2.5 : 1.5,
              ease: isHovered ? "easeInOut" : "easeOut",
              repeat: isHovered ? Infinity : 0,
              repeatType: "loop"
            }}
            style={{
              opacity: isHovered ? 1 : 0,
            }}
          />
          
          {/* Additional electric sparks */}
          {isHovered && (
            <>
              <motion.circle
                cx="50"
                cy="50"
                r="2"
                fill="#60a5fa"
                filter="url(#glow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.5, 0],
                  x: [0, 300, 0],
                  y: [0, 400, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
              <motion.circle
                cx="350"
                cy="450"
                r="1.5"
                fill="#3b82f6"
                filter="url(#glow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.2, 0],
                  x: [0, -300, 0],
                  y: [0, -400, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8
                }}
              />
            </>
          )}
        </svg>
      </div>
      {/* Property Image */}
      <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden rounded-3xl">
        <motion.img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-3xl"
          whileHover={{ 
            scale: 1.05,
            transition: { 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }
          }}
        />
        
        {/* Status Badge */}
        <motion.div 
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          <span className="text-gray-800 text-sm font-medium">
            {status}
          </span>
        </motion.div>

        {/* Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <motion.div 
        className="py-6 px-4"
        initial={{ opacity: 1 }}
      >
        {/* Location with Icon */}
        <motion.div 
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <MapPin className="w-4 h-4 text-gray-500" />
          <p className="text-gray-600 text-sm font-medium">
            {location}
          </p>
        </motion.div>
        {/* Title */}
        <Link href={`/luxe/property/${slug}`}>
          <motion.h3 
            className="text-lg font-bold text-gray-900 mb-4 leading-tight hover:text-blue-600 transition-colors cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {title}
          </motion.h3>
        </Link>

        {/* Property Details */}
        <motion.div 
          className="flex items-center gap-4 mb-4 text-gray-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{beds}</span>
            <span className="text-xs">beds</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{baths}</span>
            <span className="text-xs">baths</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{formatSqft(sqft)}</span>
            <span className="text-xs">sq.ft</span>
          </div>
        </motion.div>

        {/* Price */}
       {
        showPrice && (
           <motion.div 
          className=" font-bold text-gray-900"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {currency} {formatPrice(price)}
        </motion.div>
        )
       }
         </motion.div>
    </div>
  

  );
}
