import React from 'react';
import Link from "next/link";
import HomeAboutCard from "@/components/home/home-about-card";

function HomeAboutSection() {
    const ourProcess = [
        {
            title: 'Selling',
            image: '/images/selling.jpg',
            url: '/selling-property-process'
        },

        {
            title: 'Buying',
            image: '/images/buying.jpg',
            url: '/buying-property-process'
        },
        {
            title: 'Renting',
            image: '/images/leasing.jpg',
            url: '/renting-property-process'
        },

        {
            title: 'Insights',
            image: '/images/research.jpg',
            url: '/insights'
        }
    ]
    
    return (
        <section className="w-full bg-black text-white">
            <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Mobile-first content section */}
                    <div className="space-y-6 lg:space-y-8 w-full lg:max-w-4xl mx-auto mb-8 lg:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white text-center">
                            Leading Property Consultancy and Estate Agency
                        </h2>

                        <div className="space-y-4 text-center text-sm sm:text-base leading-relaxed">
                            <p>
                                At TRPE Real Estate we specialize in navigating the dynamic and vibrant real estate landscape of Dubai. Our team, led by seasoned professionals with extensive experience in both Dubai and London, is dedicated to helping you find the perfect property investment or a dream home.
                            </p>
                            <p>
                                Our founders bring a wealth of knowledge from London&apos;s prestigious real estate market, ensuring that every transaction is handled with the utmost expertise and professionalism. With The Real Property Experts, you&apos;re not just investing in property; you&apos;re investing in a legacy of excellence and success.
                            </p>
                            <p>
                                Contact us to discover unparalleled opportunities in Dubai&apos;s booming real estate market. Whether you&apos;re a first-time buyer, a seasoned investor or looking to rent a property, TRPE is your trusted partner.
                            </p>
                        </div>

                        <div className="flex justify-center pt-4">
                            <Link
                                className="py-3 px-6 rounded-full border border-white hover:bg-white hover:text-black font-semibold transition-colors min-h-[44px] flex items-center"
                                href="/about-us"
                            >
                                Learn more about TRPE
                            </Link>
                        </div>
                    </div>

                    {/* Mobile-first process grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {ourProcess.map((process, index) => (
                            <HomeAboutCard aboutCard={process} key={index}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeAboutSection;