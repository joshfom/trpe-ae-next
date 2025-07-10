"use client";

import {motion, useScroll, useTransform} from "framer-motion";
import React, {useRef} from "react";
import 'swiper/css';
import Link from "next/link";
import {LuxeMainSearch} from "@/components/luxe/LuxeMainSearch";
import {LuxeBlogSection, LuxuryCommunities} from '@/components/luxe';
import FeaturedLuxeListingsClient from '@/components/luxe/FeaturedLuxeListingsClient';
import {ChevronDown} from "lucide-react";

// Type definitions for props
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

interface CommunityData {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  propertyCount: number;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  slug: string;
  category: string;
}

interface LuxePageClientProps {
  featuredProperties: PropertyData[];
  featuredCommunities: CommunityData[];
  featuredInsights: BlogPost[];
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

export default function LuxePageClient({ 
  featuredProperties, 
  featuredCommunities,
  featuredInsights 
}: LuxePageClientProps) {
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
        src="https://www.nakheelcommunities.com/images/nakheelcommunitieslibraries/communities/palm-jumeirah2801cfc3-6328-423b-b735-3d3bb2a5c39c.jpg?sfvrsn=74da3db1_2"
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
          className="text-4xl md:text-5xl font-playfair text-white mb-6 "
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Elevate  
         Your Living!
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

        {/* First Image + Content Section */}
        <motion.section 
          ref={firstSectionRef}
          className='w-full relative py-8 sm:py-12 bg-white z-30'
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-150px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: firstY }}
        >
          {/* Mobile: Image container */}
          <motion.div 
            className='w-full lg:w-1/2 lg:hidden'
            variants={animationVariants.fadeInScale}
          >
            <motion.img 
              src="/assets/luxryprop.webp" 
              alt="Luxury Property" 
              className="w-full h-64 sm:h-96 object-cover"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
            />
          </motion.div>
          
          {/* Desktop: Image container */}
          <motion.div 
            className='w-full lg:w-1/2 hidden lg:block'
            variants={animationVariants.slideInLeft}
          >
            <motion.img 
              src="/assets/luxryprop.webp" 
              alt="Luxury Property" 
              className="w-full h-auto object-cover rounded-r-3xl"
              whileHover={{ 
                scale: 1.01, 
                rotateY: 1,
                transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
            />
          </motion.div>
          
          {/* Mobile: Content below image */}
          <motion.div 
            className='lg:hidden px-4 sm:px-6 py-8'
            variants={animationVariants.fadeInUp}
          >
            <div className='text-center'>
              <motion.h2 
                className='font-playfair text-2xl sm:text-3xl font-bold mb-4 sm:mb-6'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Discover Luxury Living
              </motion.h2>
              <motion.p 
                className='text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-justify leading-relaxed'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                From stunning gardens to carefully curated interiors, each
villa is a sanctuary made for inward reflection and outward
beauty. The Ocean Mansions at Jumeirah Asora Bay
embody a transformative experience, where nature and
timeless architecture converge, creating a life that feels
both grounded and extraordinary.
              </motion.p>
              <motion.p 
                className='text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed text-justify'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Jumeirah Residences represent an ultra-luxurious and
serviced residential development brand, offering a lifestyle
defined by exclusivity, originality and sophistication.
 </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link href="/luxe/property/7-bedrooms-jumeirah-asora-bay-jumeirah-dubai-dxb-trpe-402" className='inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-3xl hover:bg-white hover:text-black hover:border-slate-200 border border-transparent transition-colors text-sm sm:text-base'>
                    View Property 
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Desktop: Absolute positioned content over image */}
          <div className="absolute inset-0 hidden lg:block">
            <div className='max-w-7xl py-8 sm:py-12 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]'>
              {/* Left side - Full width image on desktop, hidden on mobile */}
              <div className='relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]'>
              </div>
              
              {/* Right side - Content */}
              <motion.div 
                className='w-full lg:w-1/2 flex flex-col'
                variants={animationVariants.slideInRight}
              >
                <div className='flex-grow flex flex-col justify-center'>
                  <div className='lg:pl-12 flex flex-col gap-2 sm:gap-4 text-center lg:text-left'>
                    <motion.h2 
                      className='font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-black'
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ amount: 0.8 }}
                      transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      Discover Luxury Living
                    </motion.h2>
                    <motion.p 
                      className='text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-justify leading-relaxed'
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ amount: 0.8 }}
                      transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                       From stunning gardens to carefully curated interiors, each
villa is a sanctuary made for inward reflection and outward
beauty. The Ocean Mansions at Jumeirah Asora Bay
embody a transformative experience, where nature and
timeless architecture converge, creating a life that feels
both grounded and extraordinary.
 </motion.p>
                    <motion.p 
                      className='text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-justify leading-relaxed'
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ amount: 0.8 }}
                      transition={{ duration: 1.0, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      Jumeirah Residences represent an ultra-luxurious and
serviced residential development brand, offering a lifestyle
defined by exclusivity, originality and sophistication.
 </motion.p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ amount: 0.8 }}
                      transition={{ duration: 1.0, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <Link href="/luxe/property/7-bedrooms-jumeirah-asora-bay-jumeirah-dubai-dxb-trpe-402" className='inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-3xl hover:bg-white hover:text-black hover:border-slate-200 border border-transparent transition-colors text-sm sm:text-base'>
                          View Property
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Second Image + Content Section with Background Overlay */}
        <motion.section 
          ref={secondSectionRef}
          className='w-full relative  bg-white z-30'
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-50px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: secondY }}
        >
          <motion.div 
            className='w-full max-h-[400px] sm:max-h-[600px] lg:max-h-[800px] overflow-hidden'
            variants={animationVariants.fadeInScale}
          >
            <motion.img 
              src="https://asset.mansionglobal.com/editorial/dubai-the-hottest-luxury-market-in-the-world-is-getting-a-fresh-influx-of-sparkling-new-builds/assets/NIaw0AnN6P/vela-viento-4-3500x1969.webp" 
              alt="Luxury Development" 
              className="w-full h-full object-cover"
              whileHover={{ 
            scale: 1.01,
            transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
            />
          </motion.div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-black from-33% via-black/50 via-66% to-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          ></motion.div>
          <div className="absolute inset-0">
            <div className='max-w-7xl py-8 sm:py-12 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]'>
              {/* Left side - Content */}
              <motion.div 
            className='w-full lg:w-1/2 flex flex-col'
            variants={animationVariants.slideInLeft}
              >
            <div className='flex-grow flex flex-col justify-center'>
              <div className='lg:pr-12 flex flex-col gap-2 sm:gap-4 text-center lg:text-left'>
            <motion.h2 
              className='font-playfair text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Premium Properties
            </motion.h2>
            <motion.p 
              className='text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 leading-relaxed'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{}}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Explore cutting-edge architectural masterpieces that define Dubai&apos;s skyline. Each development represents innovation in luxury living with world-class amenities.
            </motion.p>
            <motion.p 
              className='text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 leading-relaxed'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{}}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              From sustainable smart homes to iconic waterfront towers, discover properties that set new standards for modern living.
            </motion.p>
              </div>
            </div>
              </motion.div>

              {/* Right side - Image placeholder (hidden on mobile) */}
              <div className='relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[600px] lg:block hidden'>
              </div>
            </div>
          </div>
        </motion.section>

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
          <FeaturedLuxeListingsClient 
            properties={featuredProperties}
          />
        </motion.section>

        {/* Third Image + Content Section (Right aligned image) */}
        <motion.section 
          ref={thirdSectionRef}
          className='w-full relative py-8 sm:py-12 bg-white z-30'
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-50px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: thirdY }}
        >
          {/* Mobile: Image container */}
          <motion.div 
            className='w-full lg:w-1/2 lg:ml-auto lg:hidden'
            variants={animationVariants.fadeInScale}
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1734437406517-f2f731579114?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Luxury Property" 
              className="w-full h-64 sm:h-80 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
          
          {/* Desktop: Image container */}
          <motion.div 
            className='w-full lg:w-1/2 ml-auto hidden lg:block'
            variants={animationVariants.slideInRight}
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1734437406517-f2f731579114?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Luxury Property" 
              className="w-full h-auto object-cover rounded-3xl"
              whileHover={{ scale: 1.02, rotateY: -2 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
          
          {/* Mobile: Content below image */}
          <motion.div 
            className='lg:hidden px-4 sm:px-6 py-8'
            variants={animationVariants.fadeInUp}
          >
            <div className='text-center'>
              <motion.h2 
                className='font-playfair text-2xl sm:text-3xl font-bold mb-4 sm:mb-6'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Exclusive Properties
              </motion.h2>
              <motion.p 
                className='text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Discover rare opportunities in Dubai&apos;s most coveted neighborhoods. These exclusive properties offer privacy, prestige, and unmatched luxury amenities.
              </motion.p>
              <motion.p 
                className='text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                From private beach access to helicopter landing pads, each property is designed for the most discerning buyers.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{}}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/properties" className='inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-3xl hover:bg-white hover:text-black hover:border-slate-200 border border-transparent transition-colors text-sm sm:text-base'>
                    Explore Properties
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Desktop: Absolute positioned content over image */}
          <div className="absolute inset-0 hidden lg:block">
            <div className='max-w-7xl py-8 sm:py-12 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]'>
              {/* Left side - Content */}
              <motion.div 
                className='w-full lg:w-1/2 flex flex-col'
                variants={animationVariants.slideInLeft}
              >
                <div className='flex-grow flex flex-col justify-center'>
                  <div className='lg:pr-12 flex flex-col gap-2 sm:gap-4 text-center lg:text-left'>
                    <motion.h2 
                      className='font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-black'
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{}}
                      transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      Exclusive Properties
                    </motion.h2>
                    <motion.p 
                      className='text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed'
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{}}
                      transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      Discover rare opportunities in Dubai&apos;s most coveted neighborhoods. These exclusive properties offer privacy, prestige, and unmatched luxury amenities.
                    </motion.p>
                    <motion.p 
                      className='text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed'
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{}}
                      transition={{ duration: 1.0, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      From private beach access to helicopter landing pads, each property is designed for the most discerning buyers.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{}}
                      transition={{ duration: 1.0, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link href="/properties" className='inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-3xl hover:bg-white hover:text-black hover:border-slate-200 border border-transparent transition-colors text-sm sm:text-base'>
                          Explore Properties
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Right side - Image placeholder (hidden on mobile) */}
              <div className='relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[600px]'>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Dark Section with Centered Content */}
        <motion.section 
          ref={darkSectionRef}
          className='w-full py-12 sm:py-16 lg:py-20 bg-slate-900 mb-8 relative z-40'
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: darkY }}
        >
          <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            {/* H2 Title */}
            <motion.p 
              className='text-gray-400 text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4'
              variants={animationVariants.fadeInUp}
            >
              Premium Collection
            </motion.p>
            
            {/* Main Title */}
            <motion.h2 
              className='text-white text-2xl sm:text-4xl lg:text-6xl font-playfair font-light mb-6 sm:mb-8 leading-tight'
              variants={animationVariants.fadeInUp}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.01 }}
            >
              Extraordinary Living Spaces
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              className='text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto'
              variants={animationVariants.fadeInUp}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Experience the pinnacle of luxury living in Dubai&apos;s most prestigious developments. Each property is meticulously crafted to offer unparalleled comfort, sophistication, and lifestyle amenities that exceed every expectation.
            </motion.p>
          </div>
        </motion.section>

        {/* Luxury Communities Section */}
        <motion.section 
          ref={luxuryCommunitiesRef}
          className="w-full relative z-40"
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: luxuryY }}
        >
          <LuxuryCommunities communities={featuredCommunities} />
        </motion.section>

        {/* Special and Different Villa Section */}
        <motion.section 
          ref={villasSectionRef}
          className='w-full relative h-[600px] lg:h-[700px] mb-8 overflow-hidden z-30'
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: villasY }}
        >
          {/* Background Image */}
          <motion.img 
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Special Villa"
            className='w-full h-full object-cover'
            variants={animationVariants.parallaxVariants}
          />
          
          {/* Gradient Overlay - Left to Right (Dark to Transparent) */}
          <motion.div 
            className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 1.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          ></motion.div>
          
          {/* Content - Text on Left */}
          <div className='absolute inset-0 flex items-center'>
            <div className='max-w-7xl mx-auto px-4 w-full'>
              <motion.div 
                className='max-w-xl text-white'
                variants={animationVariants.slideInLeft}
              >
                <motion.h2 
                  className='text-4xl lg:text-6xl font-playfair font-light mb-6'
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.8 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  Special & Different Villas
                </motion.h2>
                <motion.p 
                  className='text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed'
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  Discover extraordinary luxury villas that redefine elegance and sophistication. Each property offers unique architectural design and premium amenities.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Link href="/luxe/dubai/properties" className='inline-flex items-center px-8 py-4 bg-white text-black rounded-3xl hover:bg-gray-100 transition-colors font-medium'>
                      Explore Special Villas
                      <motion.svg 
                        className='ml-2 w-5 h-5' 
                        fill='none' 
                        stroke='currentColor' 
                        viewBox='0 0 24 24'
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                      </motion.svg>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Apartment with Unique Designs Section */}
        <motion.section 
          ref={apartmentsSectionRef}
          className='w-full relative h-[600px] lg:h-[700px]  mb-8 overflow-hidden z-30'
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-50px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: apartmentsY }}
        >
          {/* Background Image */}
          <motion.img 
            src="https://cdn.prod.website-files.com/654dd415726d2251fb5b8fe2/657572306c651f281ab078bb_Balcony-of-a-luxury-waterfront-apartment-Dubai-1-2880x1200-c-default.jpg"
            alt="Unique Apartment Design"
            className='w-full h-full object-cover'
            variants={animationVariants.parallaxVariants}
          />
          
          {/* Gradient Overlay - Right to Left (Dark to Transparent) */}
          <motion.div 
            className='absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{}}
            transition={{ duration: 1, delay: 0.3 }}
          ></motion.div>
          
          {/* Content - Text on Right */}
          <div className='absolute inset-0 flex items-center'>
            <div className='max-w-7xl mx-auto px-4 w-full'>
              <motion.div 
                className='max-w-xl ml-auto text-white text-right'
                variants={animationVariants.slideInRight}
              >
                <motion.h2 
                  className='text-4xl lg:text-6xl font-playfair font-light mb-6'
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Apartments with Unique Designs
                </motion.h2>
                <motion.p 
                  className='text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Experience innovative architectural concepts and cutting-edge interior designs. Each apartment features distinctive layouts and premium finishes.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, x: -10 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href="/luxe/dubai/properties" className='inline-flex items-center px-8 py-4 bg-white text-black rounded-3xl hover:bg-gray-100 transition-colors font-medium'>
                      Discover Unique Apartments
                      <motion.svg 
                        className='ml-2 w-5 h-5' 
                        fill='none' 
                        stroke='currentColor' 
                        viewBox='0 0 24 24'
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                      </motion.svg>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>   
        
        
        
             {/* Built on Trust Section with Simple Animations */}
        <motion.section 
          ref={trustSectionRef}
          className='w-full bg-black text-white py-6 lg:py-12 relative z-30'
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-50px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: trustY }}
        >
          {/* Background image left aligned - full width */}
            <div className="absolute inset-0 ">
            <img 
              src="/assets/head.webp" 
              alt="" 
              className="w-full h-full object-left scale-[0.6] -ml-24 object-none "
            />
            {/* Gradient overlay for blending with black background */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
            </div>

            {/* Section Title */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-20 relative z-10'>
              <motion.div 
                className='text-center'
                variants={animationVariants.fadeInUp}
              >
                <h2 className='text-3xl sm:text-4xl lg:text-5xl font-playfair font-light text-white mb-6 leading-tight'>
                  Built on Trust. Grown Through Resilience.
                </h2>
              </motion.div>
            </div>

            {/* Timeline Content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
              <div className='grid lg:grid-cols-2 gap-12 lg:gap-20 items-start'>

               
                {/* Left Section - Fixed Story Content */}
                <motion.div 
                  className='lg:pr-8 '
                  variants={animationVariants.slideInLeft}
                >
                  <motion.div 
                    className='prose prose-lg max-w-none hidden'
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <p className='text-gray-200 leading-relaxed mb-6'>
                      In a world that celebrates noise, we chose something quieter. TRPE didn&apos;t begin with a billboard or a bold claim. It began with a single key handed over in trust. A young agent in London, showing homes not as products, but as places where lives quietly unfold.
                    </p>
                    <p className='text-gray-200 leading-relaxed mb-6'>
                      From that beginning, something rare took shape. Word by word. Name by name. Clients became believers. Believers became our community. No noise. No pressure. Only presence.
                    </p>
                    <p className='text-gray-200 leading-relaxed mb-8'>
                      When Dubai opened its doors to global ambition, we brought the same mindset to a new skyline. We didn&apos;t follow trends, we followed trust. TRPE Luxe was never built to compete. It was built to belong. This is our story. Not in headlines but in homes.
                    </p>
                    
                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ amount: 0.8 }}
                      transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <Link href="/luxe/about-us" className='inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-3xl hover:bg-gray-100 transition-colors text-base'>
                          Discover Our Story
                        </Link>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Right Section - Simple Timeline Animation */}
                <motion.div 
                  className='relative'
                  variants={animationVariants.slideInRight}
                >
                  {/* Vertical timeline line */}
                  <motion.div 
                    className='absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-500 to-gray-300'
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ amount: 0.3 }}
                    transition={{ 
                      duration: 1.0, 
                      delay: 0.2, 
                      ease: [0.25, 0.46, 0.45, 0.94] 
                    }}
                    style={{ transformOrigin: 'top' }}
                  />

                  {/* Timeline Cards - Simple Staggered Animation */}
                  <div className='relative pl-20 space-y-8'>
                    {[
                      {
                        year: "2019",
                        title: "The First Key",
                        description: "One agent. One promise. A first showing that felt like a beginning, not a sale.",
                        color: "from-gray-600 to-gray-700"
                      },
                      {
                        year: "2020",
                        title: "A Small Start", 
                        description: "A modest studio in London. But ambition, taste, and integrity ran deep.",
                        color: "from-slate-600 to-slate-700"
                      },
                      {
                        year: "2021",
                        title: "Growth Through Trust",
                        description: "No ads. Just names passed hand to hand. Clients returned and brought others.",
                        color: "from-zinc-600 to-zinc-700"
                      },
                      {
                        year: "2022",
                        title: "Dubai Chapter",
                        description: "A bold new skyline. The same quiet values. A bridge between cultures.",
                        color: "from-neutral-600 to-neutral-700"
                      },
                      {
                        year: "2024",
                        title: "The Luxe Vision",
                        description: "TRPE Luxe was born not to be loud, but to be lasting.",
                        color: "from-stone-600 to-stone-700"
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className='relative'
                        initial={{ 
                          opacity: 0, 
                          y: 40
                        }}
                        whileInView={{ 
                          opacity: 1, 
                          y: 0
                        }}
                        viewport={{ 
                          amount: 0.3,
                          margin: "-100px"
                        }}
                        transition={{ 
                          duration: 0.6, 
                          delay: index * 0.1 + 0.1, 
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      >
                        {/* Timeline dot indicator */}
                        <motion.div 
                          className={`absolute -left-[5.5rem] top-8 w-12 h-12 bg-gradient-to-br ${item.color} rounded-3xl border-2 border-gray-200 flex items-center justify-center`}
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{}}
                          transition={{ 
                            duration: 0.5, 
                            delay: index * 0.1 + 0.2, 
                            ease: [0.25, 0.46, 0.45, 0.94] 
                          }}
                          whileHover={{
                            scale: 1.2,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <span className='text-white font-bold text-sm'>{item.year}</span>
                        </motion.div>

                        {/* Card Content */}
                        <motion.div
                          className='bg-white rounded-3xl p-6 border border-gray-200 transform-gpu relative overflow-hidden'
                          whileHover={{
                            y: -8,
                            scale: 1.02,
                            borderColor: "rgb(156 163 175)",
                            transition: { 
                              duration: 0.4, 
                              ease: [0.25, 0.46, 0.45, 0.94] 
                            }
                          }}
                          style={{
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          {/* Accent line - now matches the card's border radius */}
                          <motion.div 
                            className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${item.color} rounded-tl-3xl rounded-bl-3xl`}
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{}}
                            transition={{ 
                              duration: 0.5, 
                              delay: index * 0.1 + 0.4, 
                              ease: [0.25, 0.46, 0.45, 0.94] 
                            }}
                            style={{ transformOrigin: 'top' }}
                          />

                          {/* Year badge */}
                          <motion.div 
                            className={`inline-flex items-center px-3 py-1 rounded-3xl text-white text-sm font-medium bg-gradient-to-r ${item.color} mb-4`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{}}
                            transition={{ 
                              duration: 0.4, 
                              delay: index * 0.1 + 0.3, 
                              ease: [0.25, 0.46, 0.45, 0.94] 
                            }}
                          >
                            {item.year}
                          </motion.div>
                          
                          {/* Content */}
                          <div className='relative z-10'>
                            <motion.h3 
                              className='text-xl font-playfair font-medium text-gray-900 mb-3'
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{}}
                              transition={{ 
                                duration: 0.4, 
                                delay: index * 0.1 + 0.4, 
                                ease: [0.25, 0.46, 0.45, 0.94] 
                              }}
                            >
                              {item.title}
                            </motion.h3>
                            <motion.p 
                              className='text-gray-600 leading-relaxed'
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{}}
                              transition={{ 
                                duration: 0.4, 
                                delay: index * 0.1 + 0.5, 
                                ease: [0.25, 0.46, 0.45, 0.94] 
                              }}
                            >
                              {item.description}
                            </motion.p>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

        {/* Latest Blog Section */}
        <motion.div
          ref={blogSectionRef}
          className="relative z-35"
          style={{ y: blogY }}
        >
          <LuxeBlogSection posts={featuredInsights} />
        </motion.div>

        {/* Dubai Cityscape Section */}
        <motion.section 
          ref={dubaiSectionRef}
          className='w-full relative h-[500px] lg:h-[600px] overflow-hidden mb-8 z-40'
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-50px" }}
          variants={animationVariants.staggerContainer}
          style={{ y: dubaiY }}
        >
          {/* Background Image - Dubai cityscape with palm trees */}
          <motion.img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Dubai Cityscape"
            className='w-full h-full object-cover'
            variants={animationVariants.parallaxVariants}
          />
          
          {/* Light overlay for better text readability */}
          <motion.div 
            className='absolute inset-0 bg-white/20'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{}}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.div>
          
          {/* Content Container */}
          <div className='absolute inset-0 flex items-center'>
            <div className='max-w-7xl mx-auto px-4 w-full'>
              <motion.div 
                className='flex flex-col lg:flex-row items-center justify-between'
                variants={animationVariants.staggerContainer}
              >
                {/* Left Side - Text Content */}
                <motion.div 
                  className='max-w-2xl mb-8 lg:mb-0'
                  variants={animationVariants.slideInLeft}
                >
                  <motion.h2 
                    className='text-3xl lg:text-5xl font-playfair font-light text-slate-800 mb-6 leading-tight'
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    Discover Dubai&apos;s Most Prestigious Developments
                    <br />
                    Where Luxury Meets Innovation
                  </motion.h2>
                </motion.div>
                
                {/* Right Side - Button */}
                <motion.div 
                  className='flex-shrink-0'
                  variants={animationVariants.slideInRight}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      href="/luxe/dubai/properties" 
                      className='inline-flex items-center px-12 py-4 bg-slate-900 text-white rounded-3xl hover:bg-slate-800 transition-colors font-medium text-lg'
                    >
                      View All Properties
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
        {/* Footer */}
        <motion.div
          ref={footerRef}
          className="relative z-30"
          style={{ y: footerY }}
        >
        </motion.div>

      </div>
    </div>
  );
}
