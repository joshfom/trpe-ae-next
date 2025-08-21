import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Luxe Insights | TRPE',
  description: 'Discover expert insights and market trends in luxury real estate.',
};

export default function LuxeInsightsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-First Hero Section */}
      <section className='w-full relative h-[50vh] sm:h-[60vh] lg:h-[70vh]'>
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Dubai Market Insights"
          className='w-full h-full object-cover'
        />
        
        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black/60'></div>
        
        {/* Content */}
        <div className='absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6'>
          <h1 className='text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-light mb-4 sm:mb-6 text-center leading-tight'>
            Luxe Insights
          </h1>
          <p className='text-white text-base sm:text-lg lg:text-xl text-center max-w-3xl'>
            Expert insights and market trends in Dubai&apos;s luxury real estate landscape
          </p>
        </div>
      </section>

      {/* Mobile-First Content Section */}
      <section className='w-full py-8 sm:py-12 lg:py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-light text-gray-900 mb-4 sm:mb-6">
            Market Intelligence Coming Soon
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
            Our comprehensive market analysis, investment insights, and luxury real estate trends 
            are being curated by our team of experts to provide you with the most valuable 
            intelligence in Dubai&apos;s premium property market.
          </p>
          <p className="text-sm sm:text-base text-gray-500 mb-8 sm:mb-12">
            Stay informed with data-driven insights that shape luxury real estate decisions.
          </p>
          
          {/* Mobile-First CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/luxe/journals"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              Read Our Journals
            </Link>
            <Link
              href="/luxe/contact-us"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile-First Insights Preview Section */}
      <section className='w-full py-8 sm:py-12 lg:py-16 bg-gray-50'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-light text-center text-gray-900 mb-8 sm:mb-12">
            What to Expect
          </h3>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            {[
              {
                title: 'Market Trends',
                description: 'Comprehensive analysis of Dubai luxury property market movements and forecasts',
                icon: '📈'
              },
              {
                title: 'Investment Insights',
                description: 'Strategic guidance for luxury real estate investment opportunities',
                icon: '💡'
              },
              {
                title: 'Area Spotlights',
                description: 'Deep dives into Dubai\'s most prestigious neighborhoods and developments',
                icon: '🏢'
              },
              {
                title: 'Price Analytics',
                description: 'Detailed pricing trends and valuation insights for luxury properties',
                icon: '💰'
              },
              {
                title: 'Developer Updates',
                description: 'Latest news and launches from Dubai\'s premier luxury developers',
                icon: '🏗️'
              },
              {
                title: 'Regulatory News',
                description: 'Updates on regulations affecting luxury real estate transactions',
                icon: '📋'
              }
            ].map((insight, index) => (
              <div key={index} className='text-center p-6 bg-white rounded-lg shadow-sm'>
                <div className='text-3xl sm:text-4xl mb-4'>{insight.icon}</div>
                <h4 className='text-lg sm:text-xl font-medium text-gray-900 mb-3'>
                  {insight.title}
                </h4>
                <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-First Newsletter Section */}
      <section className='w-full py-8 sm:py-12 lg:py-16 bg-black text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-light mb-4 sm:mb-6">
            Stay Informed
          </h3>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6 sm:mb-8">
            Be the first to receive our luxury market insights when they become available.
          </p>
          <a
            href="/luxe/contact-us"
            className="inline-flex px-6 sm:px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base min-h-[44px] items-center"
          >
            Get Notified
          </a>
        </div>
      </section>
    </div>
  );
}