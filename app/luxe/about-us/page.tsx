"use client"

import { motion } from "framer-motion";
import { AboutHero, AboutStory, TypesOfEstate, OurAgents } from '@/components/luxe';

// Mobile-friendly animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export default function AboutPage() {
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <AboutHero />
      
      {/* Our Story Section */}
      <AboutStory />

      {/* Types of Estate Section */}
      <TypesOfEstate />

      {/* Dark Section with Centered Content - Mobile Optimized */}
      <motion.section 
        className='w-full py-12 sm:py-16 lg:py-20 bg-slate-900'
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          {/* H2 Title */}
          <motion.p 
            className='text-gray-400 text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4'
            variants={fadeInUp}
          >
            Our Commitment
          </motion.p>
          
          {/* Main Title */}
          <motion.h2 
            className='text-white text-2xl sm:text-4xl lg:text-6xl font-playfair font-light mb-6 sm:mb-8 leading-tight'
            variants={{
              initial: { opacity: 0, y: 80, scale: 0.95 },
              animate: { opacity: 1, y: 0, scale: 1 }
            }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.01 }}
          >
            Excellence in Every Detail
          </motion.h2>
          
          {/* Description */}
          <motion.p 
            className='text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto'
            variants={{
              initial: { opacity: 0, y: 60 },
              animate: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            We believe that luxury real estate is more than just property—it's about creating extraordinary experiences 
            and building lasting relationships with our clients through unparalleled service and expertise.
          </motion.p>
        </div>
      </motion.section>

      {/* Our Agents Section */}
      <OurAgents />
    </motion.div>
  );
}

export const metadata = {
  title: 'About Us | Luxe Real Estate',
  description: 'Learn about our story and commitment to luxury real estate excellence.',
};
