'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export function AboutHero() {
  const scrollToStory = () => {
    const storySection = document.getElementById('our-story');
    if (storySection) {
      storySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/api/placeholder/1920/1080"
          alt="Modern glass buildings"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light text-gray-900 mb-6 sm:mb-8 lg:mb-12 leading-tight">
            About Us
          </h1>
        </div>

        {/* Scroll Down Button */}
        <button
          onClick={scrollToStory}
          className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 border border-gray-900 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-300 group"
          aria-label="Scroll to Our Story section"
        >
          <ChevronDown 
            size={16} 
            className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:animate-bounce" 
          />
        </button>
      </div>
    </div>
  );
}
