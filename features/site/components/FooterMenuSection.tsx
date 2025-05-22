"use client"
import React from 'react';
import FooterGridNavigation from "@/features/site/components/FooterGridNavigation";

function FooterMenuSection() {

    const menuItems = [
        {
            title: 'Buying Process',
            image: '/images/buying-process-bg.webp',
            url: '/buying-process',
            caption: 'A step by step guide to acquiring your property in Dubai. Speak to one of our Dubai experts if you need more information.'
        },
        {
            title: 'Selling Process',
            image: '/images/selling-process-bg.webp',
            url: '/selling-process',
            caption: 'A step by step guide to selling your property in Dubai. Speak to one of our Dubai experts if you need more information.'
        },
        {
            title: 'Areas',
            image: '/images/areas-bg.webp',
            url: '/communities',
            caption: 'Here are our area guides that will allow you to choose the most suitable area for your tastes. Speak to one of our Dubai experts if you need more information.'
        },
        {
            title: 'Off Plan',
            image: '/images/off-plan-bg.webp',
            url: '/off-plan',
            caption: 'Here are our development guides that will allow you to choose the most suitable development for your tastes. Speak to one of our Dubai experts if you need more information.'
        }
    ]

    return (
        <div className="bg-black p-6">
            <div className={'max-w-7xl mx-auto grid col-span-1 md:grid-cols-2 lg:grid-cols-4 py-12 gap-4'}>
                {
                    menuItems.map((menuItem, index) => (
                        <FooterGridNavigation
                            key={index}
                            {...menuItem}
                        />
                    ))
                }

            </div>
        </div>
    );
}

export default FooterMenuSection;