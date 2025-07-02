import React from 'react';
import Link from 'next/link';

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

                        <form className='space-y-4 sm:space-y-6'>
                            {/* First Row - Full Name and Email */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                                <div>
                                    <label htmlFor='fullName' className='block text-sm font-medium text-gray-700 mb-2'>
                                        Full Name
                                    </label>
                                    <input
                                        type='text'
                                        id='fullName'
                                        name='fullName'
                                        placeholder='Enter your name'
                                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base'
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                                        Email
                                    </label>
                                    <input
                                        type='email'
                                        id='email'
                                        name='email'
                                        placeholder='Enter your email'
                                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base'
                                    />
                                </div>
                            </div>

                            {/* Second Row - Phone Number and Location */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                                <div>
                                    <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                                        Phone Number
                                    </label>
                                    <div className='flex'>
                                        <span className='inline-flex items-center px-2 sm:px-3 py-2 sm:py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs sm:text-sm rounded-l-md'>
                                            +971
                                        </span>
                                        <input
                                            type='tel'
                                            id='phone'
                                            name='phone'
                                            placeholder='Enter your number'
                                            className='flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base'
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor='location' className='block text-sm font-medium text-gray-700 mb-2'>
                                        Location
                                    </label>
                                    <select
                                        id='location'
                                        name='location'
                                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white appearance-none text-sm sm:text-base'
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                            backgroundPosition: 'right 0.5rem center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '1.5em 1.5em'
                                        }}
                                    >
                                        <option value=''>Choose your location</option>
                                        <option value='dubai'>Dubai</option>
                                        <option value='abu-dhabi'>Abu Dhabi</option>
                                        <option value='sharjah'>Sharjah</option>
                                        <option value='ajman'>Ajman</option>
                                        <option value='ras-al-khaimah'>Ras Al Khaimah</option>
                                        <option value='fujairah'>Fujairah</option>
                                        <option value='umm-al-quwain'>Umm Al Quwain</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                                    Message
                                </label>
                                <textarea
                                    id='message'
                                    name='message'
                                    rows={5}
                                    placeholder='Write your message'
                                    className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base'
                                />
                            </div>

                            {/* Submit Button */}
                            <div className='flex justify-center sm:justify-end'>
                                <button
                                    type='submit'
                                    className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base'
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
