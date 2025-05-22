"use client"
import React from 'react';
import Image from "next/image";
import {StickyScroll} from "@/features/site/components/StickyScrollReveal";

function RentingForTenant() {
    const content = [
        {
            title: "1. Consider Your Budget",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Rent is the most significant– the largest percentage of your income – investment into your
                        living space. The starting point is the key question: how much do I want to spend on my living
                        space? There is, of course, no right or wrong answer. It varies for each individual based on
                        lifestyle, income and so on. Knowing your budget will help you narrow down your property search.
                    </p>
                </div>
            ),
            content: (
                <div
                    className="h-full flex flex-col items-start justify-center">
                    <div className={'h-full w-full relative'}>
                        <Image className={'h-full w-full object-cover'} src="/images/choose-agent.jpg" alt="choose agent" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                    </div>
                </div>
            ),
        },
        {
            title: "2. Choose the Location",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Depending on your preferences and requirements, you should choose a location that has amenities
                        that
                        you need within close proximity, is well connected to ease your journey to places you frequently
                        visit and is convenient for you to travel to and from work.
                    </p>

                    <p>
                        Property portals offer a snapshot of the various locations across the city. But the best way to
                        know
                        whether or not any given location is suitable for you is to visit the community.
                    </p>


                    <p>
                        Appointing a real estate agent and discussing your requirements with them will save you a lot of
                        time. As your property consultant, they will be able to make recommendations and find you
                        suitable properties.
                    </p>
                </div>
            ),
            content: (
                <div
                    className="h-full flex flex-col items-start justify-center">
                    <div className={'h-full w-full relative'}>
                        <Image className={'h-full w-full object-cover'}
                               src="/images/prepare-docs.jpg"
                               alt="Buying time line" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                    </div>
                </div>
            ),
        },

        {
            title: "3. View Each Property ",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Going for a viewing will give you a much better idea of how the property actually looks.
                        Sometimes, properties may look nice in pictures but may not be what you were hoping for as a
                        home; even as a tenant. Being there in person will also give you the opportunity to ensure
                        everything is as it should be, and allow you to identify any issues that need to be addressed
                        before you move in.
                    </p>

                    <p>
                        Viewing a property will also give you a better understanding of the community and location.
                    </p>
                </div>
            ),
            content: (
                <div
                    className="h-full flex flex-col items-start justify-center"
                >
                    <div className={'h-full w-full relative'}>
                        <Image className={'h-full w-full object-cover'}
                               src="/images/property-inspection.jpg"
                               alt="property inspection" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                    </div>
                </div>
            ),
        },


        {
            title: "4. Agree Payment Terms ",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Once you find the property you like, make sure you agree on the payment terms with the landlord.
                        This could be by way of the annual rent, number of installments, terms and conditions of
                        maintenance and so on.
                    </p>

                    <p>
                        Commission and security deposit are discussions you should have with your property consultant;
                        not with the landlord.
                    </p>
                </div>
            ),
            content: (
                <div
                    className="h-full flex flex-col items-start justify-center">
                    <div className={'h-full w-full relative'}>
                        <Image className={'h-full w-full object-cover'}
                               src="/images/developer-noc.jpg"
                               alt="find properties" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                    </div>
                </div>
            ),
        },


        {
            title: "5. Sign Tenancy Contract ",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Once you agree on the rent and payment terms with the landlord, both parties will need to sign a
                        tenancy contract. It will contain details of the property, the agreed rent, the amount of the
                        security deposit and any other terms pertaining to responsibilities of both parties with regard
                        to maintenance and repairs, and any other terms that are agree upon.
                    </p>
                    <p>
                        By law, a tenancy contract is only valid for a maximum of one year. For long-term rentals, it
                        should be renewed annually.
                    </p>
                    <p>
                        There is a standard format for this, known as the RERA Unified Tenancy Contract. Your property
                        consultant can provide you with this. The real estate agency will take care of all the
                        administration work on your behalf and submit documents and payments to the landlord.
                    </p>
                </div>
            ),
            content: (
                <div
                    className="h-full flex flex-col items-start justify-center">
                    <div className={'h-full w-full relative'}>
                        <Image className={'h-full w-full object-cover'}
                               src="/images/developer-doc.jpg"
                               alt="developer noc" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                    </div>
                </div>
            ),
        },


        {
            title: "6. Register Ejari",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Ejari is the official registration of your tenancy contract with the Real Estate Regulatory
                        Agency (RERA). By law, it is the landlord who is supposed to arrange for the Ejari; usually
                        through the real estate agency. However, in practice it is typically the tenant who usually ends
                        up doing.
                    </p>
                    <p>
                        The annual renewal of Ejari is always the tenant’s responsibility.
                    </p>
                </div>
            ),
            content: (
                <div
                    className="h-full flex flex-col items-start justify-center">
                    <div className={'h-full w-full relative'}>
                        <Image className={'h-full w-full object-cover'}
                               src="/images/property-transfer.jpg"
                               alt="transfer property" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                    </div>
                </div>
            ),
        },


        {
            title: "",
            description: (
                <div className={'h-40'}>

                </div>
            ),
            content: (
                <div
                    className="h-full flex flex-col items-start justify-center">
                    <div className={'h-full w-full relative'}>
                        <Image className={'h-full w-full object-cover'}
                               src="/images/property-transfer.jpg"
                               alt="property transfer" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                    </div>
                </div>
            ),
        },


    ];

    return (
        <div className="bg-black">

            <div className={'max-w-7xl py-12 px-6 mx-auto'}>
                <h1 className="text text-2xl lg:text-4xl pt-6 text-white">
                    Renting Property Process for Tenants
                </h1>
            </div>
            <StickyScroll content={content}/>
        </div>
    );
}

export default RentingForTenant;