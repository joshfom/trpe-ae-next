import React from 'react';
import { ChevronDown } from 'lucide-react';
import { AboutStory } from '@/components/luxe';
import { OurAgentsClient } from '@/components/luxe/OurAgentsClient';

interface Agent {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface AboutUsSSRProps {
  agents: Agent[];
}

// SSR-compatible AboutHero component (without scroll behavior)
function AboutHeroSSR() {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1503900311769-9f25e9f06068?q=80&w=3274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Modern glass buildings"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light text-white mb-6 sm:mb-8 lg:mb-12 leading-tight">
            About Us
          </h1>
        </div>

        {/* Scroll Down Button - Static version */}
        <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 border border-gray-900 rounded-full flex items-center justify-center opacity-75">
          <ChevronDown 
            size={16} 
            className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" 
          />
        </div>
      </div>
    </div>
  );
}

// SSR-compatible commitment section (without animations)
function CommitmentSectionSSR() {
  return (
    <section className='w-full py-12 sm:py-16 lg:py-20 bg-slate-900'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        {/* H2 Title */}
        <p className='text-gray-400 text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4'>
          Our Commitment
        </p>
        
        {/* Main Title */}
        <h2 className='text-white text-2xl sm:text-4xl lg:text-6xl font-playfair font-light mb-6 sm:mb-8 leading-tight'>
          Excellence in Every Detail
        </h2>
        
        {/* Description */}
        <p className='text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto'>
          We believe that luxury real estate is more than just property—it&apos;s about creating extraordinary experiences 
          and building lasting relationships with our clients through unparalleled service and expertise.
        </p>
      </div>
    </section>
  );
}

export default function AboutUsSSR({ agents }: AboutUsSSRProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <AboutHeroSSR />
      
      {/* Our Story Section */}
      <AboutStory />

      {/* Commitment Section */}
      <CommitmentSectionSSR />

      {/* Our Agents Section */}
      <OurAgentsClient agents={agents} />
    </div>
  );
}
