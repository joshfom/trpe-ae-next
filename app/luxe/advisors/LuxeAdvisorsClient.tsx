"use client"

import React from 'react';
import {AgentDetails} from '@/components/luxe';
import {motion} from "framer-motion";

// Simplified, performance-optimized animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

interface Agent {
  name: string;
  title: string;
  image: string;
  description: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  slug?: string;
}

interface LuxeAdvisorsClientProps {
  agents: Agent[];
}

const LuxeAdvisorsClient: React.FC<LuxeAdvisorsClientProps> = ({ agents }) => {
  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.div 
        className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1715168437311-18b9ec0830c1?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      >
        <div className="absolute inset-0 bg-cover bg-center z-10 bg-no-repeat bg-slate-800/40" />
        
        <div className="relative z-10 max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <motion.div 
        className="text-center flex flex-col items-center justify-center h-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
          >
        <motion.h1 
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 font-playfair leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Meet Our
          <span className="block text-white">
            Advisors
          </span>
        </motion.h1>
        <div className="max-w-4xl mx-auto">
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Our distinguished team of luxury real estate professionals brings unparalleled expertise, 
            local market knowledge, and commitment to excellence in every transaction.
          </motion.p>
          <motion.p 
            className="text-base sm:text-lg text-gray-400 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Each advisor specializes in Dubai&apos;s most prestigious neighborhoods and exclusive properties, 
            ensuring you receive world-class service whether buying, selling, or investing in luxury real estate.
          </motion.p>
        </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-white/20 to-gray-300/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-white/10 to-gray-300/10 rounded-full blur-xl"></div>
      </motion.div>

      {/* Excellence & Experience Section */}
      <motion.div 
        className="bg-gradient-to-br from-slate-900 via-gray-900 to-black py-12 sm:py-16 lg:py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h3 
              className="text-sm sm:text-lg md:text-xl text-white font-medium mb-3 sm:mb-4 tracking-wide uppercase"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Unmatched Excellence
            </motion.h3>
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 font-playfair leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Luxury Real Estate
              <span className="block text-white">
                Redefined
              </span>
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              With decades of combined experience and billions in luxury property transactions, 
              our team represents the pinnacle of real estate excellence in Dubai&apos;s most exclusive markets.
            </motion.p>
            <motion.p 
              className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 sm:mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              From waterfront penthouses to private island estates, we curate extraordinary properties 
              for the world&apos;s most discerning clients. Our commitment to discretion, expertise, and 
              white-glove service has made us the trusted choice for luxury real estate in the region.
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-playfair">$2.5B+</div>
                <div className="text-gray-300 text-base sm:text-lg">Total Sales Volume</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-playfair">500+</div>
                <div className="text-gray-300 text-base sm:text-lg">Luxury Properties Sold</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-playfair">25+</div>
                <div className="text-gray-300 text-base sm:text-lg">Years Combined Experience</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-white/5 to-gray-300/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-white/3 to-gray-300/3 rounded-full blur-3xl"></div>
        </div>
      </motion.div>

      {/* Agent details section - passing real agent data */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <AgentDetails agents={agents} />
      </motion.div>

      {/* Call to action section */}
      <motion.div 
        className="relative w-full overflow-hidden bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 py-24 lg:py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=4470&auto=format&fit=crop')"
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div 
            className="flex flex-col lg:flex-row items-center justify-between gap-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-playfair leading-tight">
                Ready to Find Your
                <span className="block text-white">
                  Dream Property?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl">
                Connect with our luxury real estate experts today and discover exclusive properties 
                that match your lifestyle and investment goals.
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
                From waterfront penthouses to private estates, we have access to Dubai&apos;s most 
                prestigious properties before they hit the market.
              </p>
            </div>

            {/* Right CTA */}
            <div className="flex-shrink-0 text-center lg:text-right">
              <button className="inline-flex items-center justify-center px-12 py-4 bg-black text-white font-semibold text-lg rounded-full hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Contact Our Team
              </button>
              <p className="text-white/70 text-sm mt-4 max-w-xs">
                Schedule a consultation with our luxury property specialists
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
      </motion.div>
    </motion.div>
  );
};

export default LuxeAdvisorsClient;
