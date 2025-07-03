"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import 'swiper/css';
import Link from "next/link";
import React from "react";
import LuxeHero from '@/components/luxe/LuxeHero';
import { LuxeMainSearch } from "@/components/luxe/LuxeMainSearch";
import { LuxeBlogSection, LuxePropCard, LuxuryCommunities, LuxeTopNavigation } from '@/components/luxe';
import { LuxeNewsGrid } from "@/components/luxe/luxe-news-grid";
import LuxeFooter from "@/components/luxe/luxe-footer";
import { TypesOfEstate } from "@/components/luxe/TypesOfEstate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ArrowRight, 
  Wifi, 
  Clock, 
  Users, 
  Coffee, 
  Shield, 
  Car, 
  CheckCircle, 
  Building, 
  MapPin, 
  Star, 
  Mail, 
  Phone, 
  Calendar 
} from "lucide-react";
import FeaturedLuxeListingsClient from "@/components/luxe/FeaturedLuxeListingsClient";

// Property data type
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
  slug: string;
}

interface LuxePageContentProps {
  featuredProperties: PropertyData[];
}

// Apple-style animation variants - Optimized for faster entry
const animationVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  fadeInScale: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.02,
      },
    },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  parallaxVariants: {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
};

export default function LuxePageContent({ featuredProperties }: LuxePageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const thirdSectionRef = useRef<HTMLDivElement>(null);
  const darkSectionRef = useRef<HTMLDivElement>(null);
  const luxuryCommunitiesRef = useRef<HTMLDivElement>(null);
  const villasSectionRef = useRef<HTMLDivElement>(null);
  const apartmentsSectionRef = useRef<HTMLDivElement>(null);
  const trustSectionRef = useRef<HTMLDivElement>(null);
  const blogSectionRef = useRef<HTMLDivElement>(null);
  const dubaiSectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  
  // ...existing scroll and parallax code...
  // Parallax scroll effects for hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax scroll effects for sections
  const { scrollYProgress: searchProgress } = useScroll({
    target: searchRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: firstProgress } = useScroll({
    target: firstSectionRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: secondProgress } = useScroll({
    target: secondSectionRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: featuredProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: thirdProgress } = useScroll({
    target: thirdSectionRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: darkProgress } = useScroll({
    target: darkSectionRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: luxuryProgress } = useScroll({
    target: luxuryCommunitiesRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: villasProgress } = useScroll({
    target: villasSectionRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: apartmentsProgress } = useScroll({
    target: apartmentsSectionRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: trustProgress } = useScroll({
    target: trustSectionRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: blogProgress } = useScroll({
    target: blogSectionRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: dubaiProgress } = useScroll({
    target: dubaiSectionRef,
    offset: ["start end", "end start"]
  });
  
  const { scrollYProgress: footerProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end start"]
  });
  
  // Transform values for hero parallax effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.6, 0.8]);
  
  // Transform values for section parallax effects
  const searchY = useTransform(searchProgress, [0, 1], ["0%", "-20%"]);
  const firstY = useTransform(firstProgress, [0, 1], ["0%", "-15%"]);
  const secondY = useTransform(secondProgress, [0, 1], ["0%", "-10%"]);
  const featuredY = useTransform(featuredProgress, [0, 1], ["0%", "-25%"]);
  const thirdY = useTransform(thirdProgress, [0, 1], ["0%", "-15%"]);
  const darkY = useTransform(darkProgress, [0, 1], ["0%", "-30%"]);
  const luxuryY = useTransform(luxuryProgress, [0, 1], ["0%", "-20%"]);
  const villasY = useTransform(villasProgress, [0, 1], ["0%", "-35%"]);
  const apartmentsY = useTransform(apartmentsProgress, [0, 1], ["0%", "-35%"]);
  const trustY = useTransform(trustProgress, [0, 1], ["0%", "-25%"]);
  const blogY = useTransform(blogProgress, [0, 1], ["0%", "-20%"]);
  const dubaiY = useTransform(dubaiProgress, [0, 1], ["0%", "-40%"]);
  const footerY = useTransform(footerProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div className="min-h-screen bg-white">
      {/* ...existing hero and content sections... */}
      {/* Full-width Hero Section with Parallax */}
    <section 
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100vh - 340px)' }} // Subtract approximate search section height
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-[120vh]"
        style={{ y: backgroundY }}
      >
        <img
        src="/assets/db-hero.jpg"
        alt="Luxury workspace"
        className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Overlay that gets darker as user scrolls */}
      <motion.div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Hero Content */}
      <motion.div 
        className="relative z-10 h-full flex items-center justify-center text-center px-4"
        style={{ y: textY }}
      >
        <div className="max-w-4xl">
        <motion.h1
          className="text-6xl md:text-8xl font-playfair text-white mb-6 "
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Elevate 

          <br />
         Your Living
        </motion.h1>
         
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
      >
        <div className="flex flex-col items-center">
        <span className="text-sm mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
        </div>
      </motion.div>
    </section>

      {/* Content sections with curtain effect */}
      <div className="relative z-20 bg-white">
        
        {/* Main Search Section */}
        <motion.section
          ref={searchRef}
          className="py-12 bg-white relative z-30"
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-50px" }}
          variants={animationVariants.staggerContainer}
          style={{
            y: searchY,
            marginTop: useTransform(scrollYProgress, [0, 0.3], ["0vh", "-20vh"])
          }}
        >
          <LuxeMainSearch />
        </motion.section>

        {/* ...existing sections... */}

        {/* Featured Listings Section */}
        <motion.section 
          ref={featuredRef}
          className='w-full py-8 sm:py-12 bg-white relative z-30'
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: featuredY }}
        >
          <FeaturedLuxeListingsClient properties={featuredProperties} />
        </motion.section>

        {/* ...rest of existing sections... */}
      </div>
    </div>
  );
}
