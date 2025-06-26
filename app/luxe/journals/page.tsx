"use client"

import { LuxeNewsGrid } from '@/components/luxe/luxe-news-grid';
import { motion } from "framer-motion";

// Animation variants following the main page pattern
const fadeInUp = {
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export default function InsightsPage() {
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section - Latest News */}
      <motion.section 
        className="relative h-[500px] sm:h-[600px] lg:h-[800px] overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        {/* Background Image */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
          }}
          variants={fadeInScale}
        >
          {/* Overlay for text readability */}
          <motion.div 
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          ></motion.div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
          >
            <motion.h1 
              className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-playfair text-white mb-6 sm:mb-8 drop-shadow-lg leading-tight"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.01 }}
            >
              Latest News
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Stay updated with the latest trends and insights from Dubai's luxury real estate market
            </motion.p>
          </motion.div>
        </div>
      </motion.section>


      {/* Latest News Section */}
      <motion.section 
        className="py-12 sm:py-16 lg:py-20 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-200px", amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-light text-slate-900 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Latest News
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Stay informed with the latest developments, trends, and insights 
              from Dubai&apos;s dynamic luxury real estate market.
            </motion.p>
          </motion.div>

          <motion.div
            variants={{
              initial: { opacity: 0, y: 80 },
              animate: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <LuxeNewsGrid />
          </motion.div>
        </div>
      </motion.section>
      
    </motion.div>
  );
}
