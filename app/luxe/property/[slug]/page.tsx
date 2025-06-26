"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, Home, Maximize2, ChevronDown } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Luxury animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
};

const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
};

export default function PropertyDetailPage() {
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Image */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-200 to-blue-300"
            {...fadeInScale}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            {/* Placeholder for property image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="text-white text-xl font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Property Image
              </motion.div>
            </div>
            
            {/* Property type badge */}
            <motion.div 
              className="absolute top-6 left-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full text-sm font-medium">
                Villa
              </span>
            </motion.div>
            
            {/* Image thumbnails overlay */}
            <motion.div 
              className="absolute bottom-6 right-6 flex space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-16 h-12 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-white/50 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                ></motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Property Details */}
      <motion.section 
        className="py-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Property Info */}
            <motion.div variants={slideInLeft}>
              {/* Estate Name and Location */}
              <motion.div className="mb-8" variants={fadeInUp}>
                <motion.h1 
                  className="text-3xl lg:text-4xl font-light text-slate-900 mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Estate Name
                </motion.h1>
                <motion.div 
                  className="flex items-center text-gray-600 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Emirates Tower, Dubai</span>
                </motion.div>
                
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  <h2 className="text-2xl font-medium text-slate-900 mb-4">Price:</h2>
                  <motion.p 
                    className="text-3xl font-light text-slate-900"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    AED 250,000
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  className="prose prose-gray max-w-none"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  <p className="text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices 
                    gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem 
                    ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
                    ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. 
                    Risus commodo viverra maecenas accumsan lacus vel facilisis.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Image Gallery */}
            <motion.div variants={slideInRight}>
              {/* Main Property Image */}
              <motion.div 
                className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300 mb-4"
                whileHover={{ scale: 1.03, rotateY: 5 }}
                transition={{ duration: 0.4 }}
                style={{ perspective: 1000 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-xl font-medium">Main Property Image</div>
                </div>
              </motion.div>
              
              {/* Thumbnail Images - 3 in a row */}
              <motion.div 
                className="grid grid-cols-3 gap-4"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="relative h-24 lg:h-32 rounded-lg overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300 cursor-pointer"
                    variants={{
                      initial: { opacity: 0, y: 50, scale: 0.8 },
                      animate: { opacity: 1, y: 0, scale: 1 }
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-sm">Image {i + 1}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Floor Plans */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-2xl font-medium text-slate-900 mb-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Floor Plans
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Apartment
            </motion.p>
            
            <motion.div 
              className="space-y-4"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* First floor plan - expanded */}
              <motion.div 
                className="border rounded-lg overflow-hidden"
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="p-4 bg-gray-50 border-b"
                  whileHover={{ backgroundColor: "#f8fafc" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Home className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">5 Beds</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Maximize2 className="w-5 h-5 text-gray-600" />
                        <span>9,642 - 9,642 Sqft</span>
                      </motion.div>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-600 transform rotate-180" />
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Floor plan details */}
                <motion.div 
                  className="p-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                  >
                    <motion.div variants={fadeInUp}>
                      <p className="text-sm text-gray-600 mb-1">Type</p>
                      <p className="font-medium">Split - Sky Mansion</p>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <p className="text-sm text-gray-600 mb-1">Size (Sqft)</p>
                      <p className="font-medium">9,642</p>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <p className="text-sm text-gray-600 mb-1">Floor Plan</p>
                      <div className="flex space-x-2">
                        <motion.div 
                          className="w-12 h-16 bg-gray-200 rounded cursor-pointer"
                          whileHover={{ scale: 1.1, rotateY: 10 }}
                          whileTap={{ scale: 0.95 }}
                        ></motion.div>
                        <motion.div 
                          className="w-12 h-16 bg-gray-200 rounded cursor-pointer"
                          whileHover={{ scale: 1.1, rotateY: 10 }}
                          whileTap={{ scale: 0.95 }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Other floor plans - collapsed */}
              {[
                { beds: 6, sqft: "15,323 - 12,372" },
                { beds: 7, sqft: "16,842 - 16,842" }
              ].map((plan, index) => (
                <motion.div 
                  key={index}
                  className="border rounded-lg"
                  variants={fadeInUp}
                  whileHover={{ 
                    y: -3,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="p-4 bg-white cursor-pointer"
                    whileHover={{ backgroundColor: "#fafafa" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className="flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Home className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">{plan.beds} Beds</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Maximize2 className="w-5 h-5 text-gray-600" />
                          <span>{plan.sqft} Sqft</span>
                        </motion.div>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

              {/* Location */}
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
              >
                <motion.h2 
                  className="text-2xl font-medium text-slate-900 mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Location
                </motion.h2>
                
                {/* Map placeholder */}
                <motion.div 
                  className="relative h-64 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden border"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <div className="text-center">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      </motion.div>
                      <p className="text-gray-700">Interactive Map</p>
                      <p className="text-sm text-gray-500">Emirates Tower, Dubai</p>
                    </div>
                  </motion.div>
                  
                  {/* Map pin */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2 }}
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      scale: { duration: 0.6, delay: 0.5 },
                      y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Amenities */}
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
              >
                <motion.h2 
                  className="text-2xl font-medium text-slate-900 mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Amenities
                </motion.h2>
                
                <motion.div 
                  className="grid grid-cols-3 gap-8"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  {[
                    { name: "Pool", row: 1 },
                    { name: "GYM", row: 1 },
                    { name: "Beach", row: 1 },
                    { name: "Pool", row: 2 },
                    { name: "GYM", row: 2 },
                    { name: "Beach", row: 2 }
                  ].map((amenity, i) => (
                    <motion.div 
                      key={i}
                      className="flex flex-col items-center text-center group cursor-pointer"
                      variants={{
                        initial: { opacity: 0, y: 60, scale: 0.8 },
                        animate: { opacity: 1, y: 0, scale: 1 }
                      }}
                      whileHover={{ 
                        y: -10,
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-colors duration-300"
                        whileHover={{ 
                          rotateY: 360,
                          backgroundColor: "#dbeafe"
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <motion.div 
                          className="w-6 h-6 bg-gray-400 rounded group-hover:bg-blue-400 transition-colors duration-300"
                          whileHover={{ scale: 1.2 }}
                        ></motion.div>
                      </motion.div>
                      <motion.span 
                        className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
                        whileHover={{ fontWeight: 600 }}
                      >
                        {amenity.name}
                      </motion.span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* FAQ */}
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
              >
                <motion.h2 
                  className="text-2xl font-medium text-slate-900 mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  FAQ's
                </motion.h2>
                
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {[
                      {
                        value: "item-1",
                        question: "What are the payment terms for this property?",
                        answer: "Payment terms include flexible options with installment plans available. Contact our sales team for detailed payment schedules and financing options."
                      },
                      {
                        value: "item-2", 
                        question: "What amenities are included in the community?",
                        answer: "The community includes a swimming pool, fully equipped gym, beach access, landscaped gardens, children's play areas, and 24/7 security services."
                      },
                      {
                        value: "item-3",
                        question: "When is the expected handover date?",
                        answer: "The project is scheduled for completion in Q2 2026. Regular construction updates are provided to buyers throughout the development process."
                      }
                    ].map((faq, index) => (
                      <motion.div
                        key={faq.value}
                        variants={fadeInUp}
                      >
                        <AccordionItem 
                          value={faq.value} 
                          className="border rounded-lg px-4 hover:shadow-lg transition-shadow duration-300"
                        >
                          <AccordionTrigger className="py-4 text-left font-medium text-slate-900 hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 text-gray-700">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </motion.div>
              </motion.div>

          {/* Contact Section - Full Width Below */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="max-w-2xl mx-auto">
              <motion.div 
                className="bg-gray-50 rounded-2xl p-8 text-center"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.h3 
                  className="text-2xl font-medium text-slate-900 mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Interested in this property?
                </motion.h3>
                <motion.p 
                  className="text-gray-600 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Get in touch with our expert team for more details and to schedule a viewing.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.button 
                    className="bg-slate-900 text-white py-3 px-8 rounded-full font-medium"
                    variants={fadeInUp}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "#1e293b",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Schedule Viewing
                  </motion.button>
                  <motion.button 
                    className="border border-slate-300 text-slate-900 py-3 px-8 rounded-full font-medium"
                    variants={fadeInUp}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "#f8fafc",
                      borderColor: "#64748b"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Request Info
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-gray-300 rounded-full"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                  <motion.div 
                    className="text-left"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <p className="font-medium text-slate-900">Agent Name</p>
                    <p className="text-sm text-gray-600">Senior Property Consultant</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}