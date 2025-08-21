import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxe Properties | TRPE',
  description: 'Explore our exclusive collection of luxury properties in Dubai.',
};

export default function LuxePropertiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-First Hero Section */}
      <section className='w-full relative h-[50vh] sm:h-[60vh] lg:h-[70vh]'>
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury Properties in Dubai"
          className='w-full h-full object-cover'
        />
        
        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black/50'></div>
        
        {/* Content */}
        <div className='absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6'>
          <h1 className='text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-light mb-4 sm:mb-6 text-center leading-tight'>
            Luxe Properties
          </h1>
          <p className='text-white text-base sm:text-lg lg:text-xl text-center max-w-3xl'>
            Discover our exclusive collection of luxury properties in Dubai&apos;s most prestigious locations
          </p>
        </div>
      </section>

      {/* Mobile-First Content Section */}
      <section className='w-full py-8 sm:py-12 lg:py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-light text-gray-900 mb-4 sm:mb-6">
            Coming Soon
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
            Our curated collection of Dubai&apos;s finest luxury properties is being prepared for you. 
            Each property represents the pinnacle of sophisticated living and investment excellence.
          </p>
          <p className="text-sm sm:text-base text-gray-500 mb-8 sm:mb-12">
            Stay tuned for an extraordinary showcase of premium real estate opportunities.
          </p>
          
          {/* Mobile-First CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/luxe/contact-us"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              Contact Our Advisors
            </a>
            <a
              href="/luxe"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              Explore Luxe
            </a>
          </div>
        </div>
      </section>

      {/* Mobile-First Features Section */}
      <section className='w-full py-8 sm:py-12 lg:py-16 bg-gray-50'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            {[
              {
                title: 'Exclusive Listings',
                description: 'Access to off-market and pre-launch luxury properties',
                icon: '🏆'
              },
              {
                title: 'Expert Guidance',
                description: 'Personalized service from Dubai luxury property specialists',
                icon: '👥'
              },
              {
                title: 'Premium Locations',
                description: 'Properties in Dubai\'s most sought-after neighborhoods',
                icon: '📍'
              }
            ].map((feature, index) => (
              <div key={index} className='text-center p-6 bg-white rounded-lg shadow-sm'>
                <div className='text-3xl sm:text-4xl mb-4'>{feature.icon}</div>
                <h3 className='text-lg sm:text-xl font-medium text-gray-900 mb-3'>
                  {feature.title}
                </h3>
                <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}