import React from "react";
import Link from "next/link";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Renting process in Dubai | Rent a Property in Dubai",
    description: "Renting process in Dubai, Rent a property in Dubai, Find your next home or investment in Dubai. Browse the latest Dubai property for sale or rent.",
    creator: "Joshua Fomubod",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/renting-property-process`,
    },
};

function RentingPropertyProcessPage() {
    return (
        <div className="bg-black min-h-screen pb-20">
            <div className="py-10 bg-black hidden lg:block"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="py-12">
                    <h1 className="text-4xl text-white mb-8">
                        Renting Property Process
                    </h1>
                    <p className="text-gray-300 text-lg max-w-3xl">
                        Follow our comprehensive guide to successfully rent a property in Dubai.
                    </p>
                </div>

                {/* Step 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">1. Determine Your Budget</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Just like when buying property, the first thing you should do is to determine your budget. How much
                                of your monthly income can you comfortably allocate towards rent? The standard used by most
                                property consultants is 30% of your gross income.
                            </p>

                            <p>
                                Remember, it&apos;s not just the monthly rent you need to budget for. You also need to factor in DEWA
                                deposits (approximately AED 2000 for an apartment and AED 4000 for a villa), security deposits (5%
                                of the annual rent), agent commission (5% of the annual rent) and moving costs.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/plan-budget-buying.jpg" 
                            alt="Plan your budget for renting property"
                        />
                    </div>
                </div>

                {/* Step 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/timeline-buying.jpg" 
                            alt="Timeline for renting property"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">2. Choose Your Location</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                The next thing you want to think about is where you want to live. Based on your preference,
                                lifestyle requirements and convenience, there are various residential and mixed-use communities
                                across Dubai.
                            </p>

                            <p>
                                Location is always important. Consider proximity to your workplace, schools (if you have children),
                                healthcare facilities, supermarkets, public transport and so on. You should also check if the
                                locations you&apos;re interested in have the amenities you consider essential.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">3. Find Properties</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Now is the most suitable time to look for properties. You will now have a good idea of the price
                                range you want to look in and the kind of locations you would prefer. Based on these, you will find
                                properties ranging from cosy studio apartments to family townhouses and spacious luxury villas.
                            </p>

                            <p>
                                There are two ways of going about it: (1) property portals; and (2) appoint a property consultant.
                                While property portals will give you a wide selection to choose from, a property consultant will be
                                able to save you a lot of time by narrowing down your search to only show you properties that meet
                                your requirements.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-search-image.jpg" 
                            alt="Find properties in Dubai"
                        />
                    </div>
                </div>

                {/* Step 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-inspection.jpg" 
                            alt="Inspect properties"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">4. Inspect Properties</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Don&apos;t be afraid to inspect properties a few times and at different times of the day. This will give
                                you a good idea of noise levels, traffic patterns, and general neighborhood ambiance. Check the
                                condition of fixtures, fittings, and appliances. Make sure all electrical outlets, plumbing, and air
                                conditioning are working properly.
                            </p>

                            <p>
                                Ask the property consultant about the community, any maintenance issues, and service charges. Take
                                photos during your inspections so you can compare properties later.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">5. Make an Offer</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Once you have chosen a property, it&apos;s time to make an offer. In Dubai, it is standard practice to
                                negotiate on the asking rent. Your property consultant can advise you on this based on market
                                conditions and the condition of the property. 
                            </p>

                            <p>
                                In addition to the rent, you should also negotiate on the number of rent cheques. Traditionally, 
                                rent in Dubai was paid with one cheque for the full year upfront. However, it is now common to pay 
                                in multiple cheques (2, 4, or even 6 or 12 cheques per year).
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/developer-noc.jpg" 
                            alt="Make an offer"
                        />
                    </div>
                </div>

                {/* Step 6 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/developer-doc.jpg" 
                            alt="Sign tenancy contract"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">6. Sign Tenancy Contract</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Once you and the landlord agree on the terms, you will need to sign a tenancy contract, also known
                                as the RERA Unified Tenancy Contract. This is an official document that protects both the landlord
                                and the tenant. It will include details of the property, the agreed rent, the rent payment schedule,
                                the amount of the security deposit, and any other terms agreed upon by both parties.
                            </p>

                            <p>
                                At this stage, you will also need to provide post-dated cheques for the rent (as per the agreed
                                payment schedule) and pay the security deposit (usually 5% of the annual rent).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 7 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">7. Register Ejari</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Ejari is the Arabic word for &apos;my rent&apos; and is the official registration of your tenancy contract
                                with the Real Estate Regulatory Agency (RERA). This registration is mandatory for all rental
                                properties in Dubai.
                            </p>
                            <p>
                                To register your Ejari, you will need the following documents:
                            </p>
                            <ul className="list-disc pl-8">
                                <li>Original tenancy contract</li>
                                <li>Copy of the title deed</li>
                                <li>Copy of your passport and visa</li>
                                <li>Copy of your Emirates ID</li>
                                <li>Copy of DEWA connection receipt</li>
                            </ul>
                            <p>
                                There is a nominal fee for registering Ejari, which is AED 220. You can register your Ejari online
                                through the Dubai REST app, at any typing center, or at any RERA-approved Ejari registration center.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-transfer.jpg" 
                            alt="Register Ejari"
                        />
                    </div>
                </div>

                {/* Step 8 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/moving-in.jpg" 
                            alt="Connect utilities and move in"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">8. Connect Utilities and Move In</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                The final step is to connect utilities and move in. The main utility provider in Dubai is DEWA
                                (Dubai Electricity and Water Authority). You can apply for a DEWA connection online through their
                                website or the DEWA app.
                            </p>
                            <p>
                                You will need to pay a security deposit (AED 2000 for an apartment, AED 4000 for a villa) and a
                                connection fee (AED 110). You will also need to provide a copy of your tenancy contract, Ejari, and
                                passport.
                            </p>
                            <p>
                                In addition to DEWA, you will also need to set up internet and TV services. The main providers are
                                Etisalat and du.
                            </p>
                            <p>
                                Once all utilities are connected, you can move in and start enjoying your new home!
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gray-900 rounded-xl p-8 mt-12 text-center">
                    <h2 className="text-2xl text-white mb-4">Ready to rent a property in Dubai?</h2>
                    <p className="text-gray-300 mb-6">Our expert consultants are here to help you find your perfect home.</p>
                    <Link href="/contact-us" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition duration-300">
                        Contact Us Today
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RentingPropertyProcessPage;
