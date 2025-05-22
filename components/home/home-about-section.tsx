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

        <section className="py-12 px-6 w-full bg-black text-white">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6 lg:px-8">
                    <div className="space-y-8 lg:space-y-4 w-full lg:max-w-4xl mx-auto">
                        <h2 className={'text-2xl lg:text-4xl font-semibold text-white text-center'}>
                            Leading Property Consultancy and Estate Agency
                        </h2>

                        <p className="text-center ">
                            At TRPE Real Estate we specialize in navigating the dynamic and vibrant real estate landscape of Dubai. Our team, led by seasoned professionals with extensive experience in both Dubai and London, is dedicated to helping you find the perfect property investment or a dream home.
                        </p>
                        <p className={'text-center'}>
                            Our founders bring a wealth of knowledge from London&apos;s prestigious real estate market, ensuring that every transaction is handled with the utmost expertise and professionalism. With The Real Property Experts, you’re not just investing in property; you’re investing in a legacy of excellence and success.
                        </p>
                        <p className={'text-center'}>
                            Contact us to discover unparalleled opportunities in Dubai’s booming real estate market. Whether you’re a first-time buyer, a seasoned investor or looking to rent a property, TRPE is your trusted partner.
                            Our founders bring a wealth of knowledge from London&apos;s prestigious real estate market, ensuring that every transaction is handled with the utmost expertise and professionalism. With The Real Property Experts, you’re not just investing in property; you’re investing in a legacy of excellence and success.
                        </p>

                        <div className="py-4 flex justify-center">
                            <Link
                                className={'py-2 px-6 rounded-full border border-white hover:bg-white hover:text-black  font-semibold mt-4'}
                                href={'/about-us'}>
                                Learn more about TRPE
                            </Link>
                        </div>
                    </div>

                </div>

                <div className={'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 py-12 gap-3 lg:gap-6'}>
                    {
                        ourProcess.map((process, index) => (
                            <HomeAboutCard aboutCard={process} key={index}/>
                        ))
                    }

                </div>
            </div>

        </section>
    );
}

export default HomeAboutSection;