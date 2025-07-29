import React from 'react';
import LuxeContactForm from './components/LuxeContactForm';

export default function LuxeContactPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Contact Us */}
            <section className='w-full relative h-[50vh] sm:h-[60vh] lg:h-[70vh]'>
                {/* Background Image - Modern building/skyscraper */}
                <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Modern Building"
                    className='w-full h-full object-cover'
                />
                
                {/* Dark overlay */}
                <div className='absolute inset-0 bg-black/60'></div>
                
                {/* Content */}
                <div className='absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6'>
                    <h1 className='text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-light mb-6 sm:mb-8 text-center leading-tight'>
                        Contact Us
                    </h1>
                    
                    {/* Scroll down indicator */}
                    <div className='absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2'>
                        <div className='w-10 h-10 sm:w-12 sm:h-12 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer'>
                            <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className='w-full py-12 sm:py-16 bg-gray-50'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {/* Description Text */}
                    <div className='text-center mb-8 sm:mb-12'>
                        <p className='text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto'>
                            We&apos;d love to hear from you. Whether you have questions about our luxury real estate services, need assistance with property investment, or want to schedule a consultation, our team is here to help you every step of the way.
                        </p>
                    </div>

                    {/* Contact Form */}
                    <div className='bg-white rounded-lg shadow-sm p-6 sm:p-8'>
                        <h2 className='text-xl sm:text-2xl font-playfair mb-6 sm:mb-8 text-gray-800'>
                            Send us a message
                        </h2>

                        <LuxeContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
