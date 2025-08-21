import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface LuxeInsightPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: LuxeInsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    title: `Insight: ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | TRPE Luxe`,
    description: 'Expert luxury real estate insights from TRPE.',
  };
}

export default async function LuxeInsightPage({ params }: LuxeInsightPageProps) {
  const { slug } = await params;
  
  // In a real implementation, you would fetch the insight data here
  // For now, we'll show a coming soon page
  
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-First Hero Section */}
      <section className='w-full relative h-[40vh] sm:h-[50vh] lg:h-[60vh]'>
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Dubai Market Analysis"
          className='w-full h-full object-cover'
        />
        
        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black/70'></div>
        
        {/* Content */}
        <div className='absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6'>
          <div className='max-w-4xl mx-auto text-center'>
            <p className='text-white text-sm sm:text-base mb-2 uppercase tracking-wider'>
              Luxury Market Insight
            </p>
            <h1 className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-light leading-tight'>
              {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h1>
          </div>
        </div>
      </section>

      {/* Mobile-First Content Section */}
      <section className='w-full py-8 sm:py-12 lg:py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Breadcrumb */}
          <nav className='mb-6 sm:mb-8'>
            <div className='flex items-center space-x-2 text-sm text-gray-500'>
              <Link href='/luxe' className='hover:text-gray-700 transition-colors'>
                Luxe
              </Link>
              <span>›</span>
              <Link href='/luxe/insights' className='hover:text-gray-700 transition-colors'>
                Insights
              </Link>
              <span>›</span>
              <span className='text-gray-900'>
                {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </nav>

          {/* Main Content */}
          <div className='text-center'>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-light text-gray-900 mb-4 sm:mb-6">
              Insight Coming Soon
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
              This luxury market insight is being prepared by our team of experts. 
              Our comprehensive analysis will provide valuable intelligence on Dubai&apos;s 
              premium real estate market trends and investment opportunities.
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-8 sm:mb-12">
              Stay tuned for in-depth market analysis and strategic insights.
            </p>
            
            {/* Mobile-First Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/luxe/insights"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
              >
                ← Back to Insights
              </Link>
              <Link
                href="/luxe/contact-us"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
              >
                Contact Our Experts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-First Related Section */}
      <section className='w-full py-8 sm:py-12 lg:py-16 bg-gray-50'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-light text-center text-gray-900 mb-8 sm:mb-12">
            Related Resources
          </h3>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            {[
              {
                title: 'Market Reports',
                description: 'Comprehensive quarterly reports on Dubai luxury real estate',
                href: '/luxe/insights',
                icon: '📊'
              },
              {
                title: 'Investment Guides',
                description: 'Strategic guidance for luxury property investments',
                href: '/luxe/insights',
                icon: '🎯'
              },
              {
                title: 'Area Analysis',
                description: 'Detailed insights into Dubai\'s premium neighborhoods',
                href: '/luxe/insights',
                icon: '🏙️'
              }
            ].map((resource, index) => (
              <a 
                key={index} 
                href={resource.href}
                className='block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='text-3xl sm:text-4xl mb-4'>{resource.icon}</div>
                <h4 className='text-lg sm:text-xl font-medium text-gray-900 mb-3'>
                  {resource.title}
                </h4>
                <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}