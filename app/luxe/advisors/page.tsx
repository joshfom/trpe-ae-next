"use client"

import React from 'react';
import { LuxeAgentCard, AgentDetails } from '@/components/luxe';
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

const OurTeamPage: React.FC = () => {
  const agents = [
    {
      name: "Hedieh Tazeh",
      title: "Luxury Advisor",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=3387&auto=format&fit=crop",
      description: `With over a decade of experience as a television host and producer, Hedieh Tazeh is a well-known and trusted name in media — admired for her elegance, authenticity, and natural ability to connect with people. Her work in front of the camera was built on trust, presence, and powerful storytelling — qualities that continue to define her today.

With her experience in UK real estate and a strong background in media, Hedieh brings her signature poise and professionalism into a bold new arena: Dubai&apos;s luxury property market. As the face of LUXE by TRPE, the exclusive luxury division of TRPE, she offers a fresh and elevated approach to Dubai&apos;s dynamic property market.

Her goal? To offer each client not just a home — but a complete experience, an elevated lifestyle, and a genuine sense of belonging.

Whether you&apos;re looking for a stunning residence, a high-value investment, or a trusted guide in Dubai&apos;s competitive real estate space, Hedieh Tazeh is here to lead you — with integrity, heart, and style.`
    },
    {
      name: "Arya Parsa",
      title: "Luxury Advisor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
      description: `With a strong foundation in media as both a host, producer and director, Arya Parsa has spent over a decade building trust and presence on screen. Known for his refined communication style and natural ability to connect, Arya&apos;s career has been shaped by authenticity, clarity, and a deep understanding of people.

Having also gained experience in the UK real estate market, Arya now brings this powerful combination of media expertise and property knowledge to Dubai. As a key figure at LUXE by TRPE, he offers clients a tailored and sophisticated approach to luxury living in one of the world&apos;s most vibrant cities.

Arya&apos;s mission is clear: to help clients discover more than just exceptional properties — he aims to deliver an immersive experience, an elevated lifestyle, and a trusted relationship built on integrity and insight.

Whether you are searching for a dream residence or a smart investment, Arya Parsa is here to guide you with professionalism, vision, and style.`
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <motion.div 
        className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=4626&auto=format&fit=crop')"
          }}
          variants={fadeInScale}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <motion.h1 
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 font-playfair leading-tight"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.01 }}
            >
              Meet Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                Agents
              </span>
            </motion.h1>
            <div className="max-w-4xl mx-auto">
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Our distinguished team of luxury real estate professionals brings unparalleled expertise, 
                local market knowledge, and commitment to excellence in every transaction.
              </motion.p>
              <motion.p 
                className="text-base sm:text-lg text-gray-400 leading-relaxed"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Each agent specializes in Dubai&apos;s most prestigious neighborhoods and exclusive properties, 
                ensuring you receive world-class service whether buying, selling, or investing in luxury real estate.
              </motion.p>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-400/10 to-yellow-300/10 rounded-full blur-xl"></div>
      </motion.div>

      {/* Agents Grid Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-200px", amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          variants={fadeInUp}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-playfair"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Luxury Real Estate Experts
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Discover the professionals who make your luxury real estate dreams a reality. 
            Our agents combine market expertise with personalized service to deliver exceptional results.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 100, scale: 0.95 },
                animate: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ 
                y: -8,
                scale: 1.01,
                transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
              }}
            >
              <LuxeAgentCard
                name={agent.name}
                title={agent.title}
                image={agent.image}
                description={agent.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Excellence & Experience Section */}
      <motion.div 
        className="bg-gradient-to-br from-slate-900 via-gray-900 to-black py-12 sm:py-16 lg:py-32"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-200px", amount: 0.4 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
          >
            <motion.h3 
              className="text-sm sm:text-lg md:text-xl text-amber-400 font-medium mb-3 sm:mb-4 tracking-wide uppercase"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Unmatched Excellence
            </motion.h3>
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 font-playfair leading-tight"
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.01 }}
            >
              Luxury Real Estate
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                Redefined
              </span>
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.0, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              With decades of combined experience and billions in luxury property transactions, 
              our team represents the pinnacle of real estate excellence in Dubai&apos;s most exclusive markets.
            </motion.p>
            <motion.p 
              className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.0, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              From waterfront penthouses to private island estates, we curate extraordinary properties 
              for the world&apos;s most discerning clients. Our commitment to discretion, expertise, and 
              white-glove service has made us the trusted choice for luxury real estate in the region.
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.8 }}
              variants={staggerContainer}
            >
              <motion.div 
                className="text-center"
                variants={{
                  initial: { opacity: 0, y: 60 },
                  animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-2 font-playfair">$2.5B+</div>
                <div className="text-gray-300 text-base sm:text-lg">Total Sales Volume</div>
              </motion.div>
              <motion.div 
                className="text-center"
                variants={{
                  initial: { opacity: 0, y: 60 },
                  animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-2 font-playfair">500+</div>
                <div className="text-gray-300 text-base sm:text-lg">Luxury Properties Sold</div>
              </motion.div>
              <motion.div 
                className="text-center"
                variants={{
                  initial: { opacity: 0, y: 60 },
                  animate: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-2 font-playfair">25+</div>
                <div className="text-gray-300 text-base sm:text-lg">Years Combined Experience</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-yellow-300/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-400/3 to-yellow-300/3 rounded-full blur-3xl"></div>
        </div>
      </motion.div>

      {/* Agent details section  */}
      <AgentDetails 
        agents={[
          {
            name: "Micheal Doe",
            title: "Local Agent",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
            phone: "+971 50 123 4567",
            email: "micheal.doe@trpe.ae",
            linkedin: "https://linkedin.com/in/micheal-doe"
          },
          {
            name: "Sarah Johnson",
            title: "Senior Luxury Advisor",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=3387&auto=format&fit=crop",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
            phone: "+971 50 234 5678",
            email: "sarah.johnson@trpe.ae",
            linkedin: "https://linkedin.com/in/sarah-johnson"
          },
          {
            name: "Ahmed Al-Rashid",
            title: "Investment Specialist",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
            phone: "+971 50 345 6789",
            email: "ahmed.alrashid@trpe.ae",
            linkedin: "https://linkedin.com/in/ahmed-alrashid"
          },
          {
            name: "Emma Rodriguez",
            title: "Luxury Property Consultant",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
            phone: "+971 50 456 7890",
            email: "emma.rodriguez@trpe.ae",
            linkedin: "https://linkedin.com/in/emma-rodriguez"
          }
        ]}
      />

      {/* Call to action section  */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 py-24 lg:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=4470&auto=format&fit=crop')"
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-playfair leading-tight">
                Ready to Find Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
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
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </motion.div>
  );
};

export default OurTeamPage;
