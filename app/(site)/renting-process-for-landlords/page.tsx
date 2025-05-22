import React from "react";
import Link from "next/link";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Renting process for landlords in Dubai | Rent a Property in Dubai",
    description: "Renting process for landlords in Dubai, Rent a property in Dubai, Find your next home or investment in Dubai. Browse the latest Dubai property for sale or rent.",
    creator: "Joshua Fomubod",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/renting-process-for-landlords`,
    },
};

function RentingProcessForLandlordsPage() {
    return (
        <div className="bg-black min-h-screen pb-20">
            <div className="py-10 bg-black hidden lg:block"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="py-12">
                    <h1 className="text-4xl text-white mb-8">
                        Renting Process for Landlords
                    </h1>
                    <p className="text-gray-300 text-lg max-w-3xl">
                        Follow our comprehensive guide to successfully rent out your property in Dubai.
                    </p>
                </div>

                {/* Step 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">1. Decide on Tenure</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                As a property owner, you would like to optimize your rental yield. But there are a few
                                considerations to make. Would you prefer to let your property out for short-term or long-term
                                rentals?
                            </p>

                            <p>
                                In the more touristic locations, short-term rentals are typically known to produce higher returns.
                                However, to be able to do so, you will need to register with the Department of Tourism and Commerce
                                Marketing (DTCM) of Dubai for that.
                            </p>
                            <p>
                                Long-term rentals offer lower but more stable returns. Renting out needs nothing more than duly
                                listing your property to put it on the market.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/choose-agent.jpg" 
                            alt="Choose tenure type"
                        />
                    </div>
                </div>

                {/* Step 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-inspection.jpg" 
                            alt="Appoint real estate agent"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">2. Appoint a Real Estate Agent</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Whichever option you choose, it is important to appoint a credible real estate agency and sign a
                                listing agreement with one of their property consultants. The property consultant you appoint will
                                be able to guide you through the process, get professional photos and videos shot, list your
                                property, advertise it and show it to prospective tenants.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">3. Prepare your Property</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Before getting photos and videos shot, make sure your property is thoroughly cleaned and all
                                maintenance work is up-to-date. If you are renting out a furnished apartment, please make sure the
                                furniture is in clean and in good condition for media shoots and viewings.
                            </p>

                            <p>
                                Remember: first impressions is ever so important. When your property is advertised for sale, the
                                images and videos should be appealing. When a prospective tenant visits the property for a viewing,
                                that first impression is what they will retain and compare with other properties they may view.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-inspection.jpg" 
                            alt="Prepare your property"
                        />
                    </div>
                </div>

                {/* Step 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/developer-noc.jpg" 
                            alt="Submit documents for listing permit"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">4. Submit Documents for Listing Permit</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Every property you list will need a permit from Dubai Land Department (DLD) which allows you to
                                advertise your property. To obtain this permit, you will need to provide copies of the following
                                documents to DLD:
                            </p>

                            <ul className="list-disc pl-8">
                                <li>Title deed</li>
                                <li>Your passport</li>
                                <li>Listing agreement</li>
                            </ul>
                            <p>
                                Your property consultant will be able to help you with this. Once the permit is obtained, your
                                property consultant will legally list your property on various portals and receive rental enquiries.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">5. Sign Tenancy Contract</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Once you agree on the rent and payment terms with a tenant, both parties will need to sign a tenancy
                                contract. This document will contain details of the property, the agreed rent, the amount of the
                                security deposit and any other terms pertaining to responsibilities of both parties with regard to
                                maintenance and repairs, and any other terms that are agree upon.
                            </p>
                            <p>
                                By law, a tenancy contract is only valid for a maximum of one year. For long-term rentals, it should
                                be renewed annually.
                            </p>
                            <p>
                                There is a standard format for this, known as the RERA Unified Tenancy Contract. Your real estate
                                agency can provide you with this. They will take care of all the administration work on your behalf.
                                They will also collect the security deposit and rent cheques from the tenant.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/developer-doc.jpg" 
                            alt="Sign tenancy contract"
                        />
                    </div>
                </div>

                {/* Step 6 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-transfer.jpg" 
                            alt="Register Ejari"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">6. Register Ejari</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Ejari is the official registration of your tenancy contract with the Real Estate Regulatory Agency
                                (RERA). By law, it is the landlord who is supposed to arrange for the Ejari; usually through the
                                real estate agency. However, in practice it is typically the tenant who usually ends up doing.
                            </p>
                            <p>
                                The annual renewal of Ejari is always the tenant&apos;s responsibility.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 7 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">7. Collect payments</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Your real estate agency will collect all rental payments on your behalf and submit it to you.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-transfer.jpg" 
                            alt="Collect payments"
                        />
                    </div>
                </div>

                {/* Step 8 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-transfer.jpg" 
                            alt="Be accessible to tenant"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">8. Be Accessible</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                While your real estate agency will be able to handle most communication on your behalf, you should
                                ensure you are available to resolve any issues the tenant may have; for example, with regard to any
                                major maintenance issues. Some things may still require your approval or action.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gray-900 rounded-xl p-8 mt-12 text-center">
                    <h2 className="text-2xl text-white mb-4">Ready to rent out your property in Dubai?</h2>
                    <p className="text-gray-300 mb-6">Our expert consultants are here to help you through the entire rental process.</p>
                    <Link href="/contact-us" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition duration-300">
                        Contact Us Today
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RentingProcessForLandlordsPage;
