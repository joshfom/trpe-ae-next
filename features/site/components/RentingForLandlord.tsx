import React from 'react';
import Image from "next/image";
import {StickyScroll} from "@/features/site/components/StickyScrollReveal";

function RentingForLandlord() {
    const content = [
        {
            title: "1. Decide on Tenure",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        As a property owner, you would like to optimize your rental yield. But there are a few considerations to make. Would you prefer to let your property out for short-term or long-term rentals?

                    </p>

                    <p>
                        In the more touristic locations, short-term rentals are typically known to produce higher returns. However, to be able to do so, you will need to register with the Department of Tourism and Commerce Marketing (DTCM) of Dubai for that.
                    </p>
                    <p>
                        Long-term rentals offer lower but more stable returns. Renting out needs nothing more than duly listing your property to put it on the market.
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
            title: "2. Appoint a Real Estate Agent",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Whichever option you choose, it is important to appoint a credible real estate agency and sign a listing agreement with one of their property consultants. The property consultant you appoint will be able to guide you through the process, get professional photos and videos shot, list your property, advertise it and show it to prospective tenants.
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
            title: "3. Prepare your Property",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Before getting photos and videos shot, make sure your property is thoroughly cleaned and all maintenance work is up-to-date. If you are renting out a furnished apartment, please make sure the furniture is in clean and in good condition for media shoots and viewings.
                    </p>

                    <p>
                        Remember: first impressions is ever so important. When your property is advertised for sale, the images and videos should be appealing. When a prospective tenant visits the property for a viewing, that first impression is what they will retain and compare with other properties they may view.
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
            title: "4. Submit Documents for Listing Permit",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Every property you list will need a permit from Dubai Land Department (DLD) which allows you to advertise your property. To obtain this permit, you will need to provide copies of the following documents to DLD:
                    </p>

                    <ul className={'pl-8'}>
                        <li>Title deed</li>
                        <li>Your passport </li>
                        <li>Listing agreement </li>
                    </ul>
                    <p>
                        Your property consultant will be able to help you with this. Once the permit is obtained, your property consultant will legally list your property on various portals and receive rental enquiries.
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
            title: "5. Sign Tenancy Contract",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Once you agree on the rent and payment terms with a tenant, both parties will need to sign a tenancy contract. This document will contain details of the property, the agreed rent, the amount of the security deposit and any other terms pertaining to responsibilities of both parties with regard to maintenance and repairs, and any other terms that are agree upon.
                    </p>
                    <p>
                        By law, a tenancy contract is only valid for a maximum of one year. For long-term rentals, it should be renewed annually.
                    </p>
                    <p>
                        There is a standard format for this, known as the RERA Unified Tenancy Contract. Your real estate agency can provide you with this. They will take care of all the administration work on your behalf. They will also collect the security deposit and rent cheques from the tenant.
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
                        Ejari is the official registration of your tenancy contract with the Real Estate Regulatory Agency (RERA). By law, it is the landlord who is supposed to arrange for the Ejari; usually through the real estate agency. However, in practice it is typically the tenant who usually ends up doing.
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
            title: "7. Collect payments",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        Your real estate agency will collect all rental payments on your behalf and submit it to you.
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
            title: "8. Be Accessible",
            description: (
                <div className={'space-y-4'}>
                    <p>
                        While your real estate agency will be able to handle most communication on your behalf, you should ensure you are available to resolve any issues the tenant may have; for example, with regard to any major maintenance issues. Some things may still require your approval or action.
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
            description:(
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
            <div className="py-10 bg-black hidden lg:block"></div>

            <div className={'max-w-7xl py-12 px-6 mx-auto'}>
                <h1 className="text text-2xl lg:text-4xl text-white">
                    Renting Process for Landlords
                </h1>
            </div>
            <StickyScroll content={content}/>
        </div>
    );
}

export default RentingForLandlord;