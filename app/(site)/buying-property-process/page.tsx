import React from "react";
import Link from "next/link";

export const metadata = {
    title: 'Buying Property Process | Dubai Real Estate',
    description: 'A step-by-step guide to buying property in Dubai | Plan your budget, think about timelines, consider locations, find properties, sign the MOU, apply for developer NOC, get manager&apos;s cheque(s), transfer the property',
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/buying-property-process`,
    },
}

function BuyingPropertyProcessPage() {
    return (
        <div className="bg-black min-h-screen pb-20">
            <div className="py-10 bg-black hidden lg:block"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="py-12">
                    <h1 className="text-4xl text-white mb-8">
                        Buying Property Process
                    </h1>
                    <p className="text-gray-300 text-lg max-w-3xl">
                        Follow this comprehensive step-by-step guide to navigate the process of buying property in Dubai.
                    </p>
                </div>

                {/* Step 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">1. Plan Your Budget</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                It&apos;s tempting to start looking for properties before anything else. Of course, it helps to know
                                what&apos;s out there and what it costs. But the first thing you should do is to understand what your
                                financial resources are like, how much you can put aside towards property purchase and how much you
                                would need as your safety net.
                            </p>

                            <p>
                                Based on that, you decide whether or not you want to pay for your property in cash or opt for a home loan. In the latter case, it is always advisable to appoint a qualified mortgage broker. They can help you find the most suitable home finance deals.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/plan-budget-buying.jpg" 
                            alt="Plan your budget for buying property"
                        />
                    </div>
                </div>

                {/* Step 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/timeline-buying.jpg" 
                            alt="Timeline for buying property"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">2. Think About Timelines</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Your budget is likely to influence this decision. You will need to factor in up-front costs such as
                                broker&apos;s commission, transfer fees and so on. Read this article to get a detailed breakdown on costs
                                related to buying your property in Dubai.
                            </p>

                            <p>
                                If you are keen on moving into a new home as soon as possible or to invest in a property for quicker
                                rental returns, you should only explore properties that are ready to move in; possibly already
                                tenanted.
                            </p>
                            <p>
                                If you are considering a move in the longer term or planning on capital gains, exploring off-plan
                                properties is the way to go. This will allow you to benefit from current promotions, lower prices
                                and developers&apos; payment plans.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">3. Consider Locations</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                The next thing you want to think about is where you want to live. Based on your preference, lifestyle requirements and convenience, there are various residential and mixed-use communities across Dubai.
                            </p>

                            <p>
                                If you are buying for investment instead of personal use, then consider locations that are in high demand in the rental market. We recommend appointing a qualified property consultant. They will be able to guide you and save you the time you would have spent in doing this research.
                            </p>
                            <p>
                                <Link href={'/contact-us'} className="underline text-blue-400 hover:text-blue-300">Click here</Link> to meet our team of expert consultants.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-location-buying.jpg" 
                            alt="Property locations in Dubai"
                        />
                    </div>
                </div>

                {/* Step 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-search-image.jpg" 
                            alt="Find properties in Dubai"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">4. Find Properties</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Now is the most suitable time to look for properties. You will now have a good idea of the price range you want to look in, when you would like to take possession and the kind of locations you would prefer. Based on these, you will find properties ranging from cosy studio apartments to family townhouses and spacious luxury villas.
                            </p>

                            <p>
                                There are two ways of going about it: (1) property portals; and (2) appoint a property consultant. While property portals will give you a wide selection to choose from, a property consultant will be able to save you a lot of time by narrowing down your search to only show you properties that meet your requirements.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">5. Sign the MOU (Form F)</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>Once you have chosen your property, it&apos;s time to make an offer. If you are buying directly from a developer, that&apos;s easy. You pay the booking amount or down payment, sign the Sale and Purchase Agreement (SPA) and proceed as directed.
                            </p>

                            <p>
                                If you are buying from the secondary market (i.e. an individual seller) then either you agree to the price or make an offer to the seller based on your calculations in Step 1. – Plan Your Budget. Once both parties agree on the terms of the deal, the details are officially documented in a Memorandum of Understanding (MoU) in an official Dubai Land Department (DLD) document known as Form F.
                            </p>
                            <p>At this stage, both parties need to provide a security cheque in favour of the other party for an amount which is 10% of the property value. The security cheques from both parties is held by the property consultant; and is not handed over to either party.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/developer-noc.jpg" 
                            alt="Signing MOU for property purchase"
                        />
                    </div>
                </div>

                {/* Step 6 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/developer-doc.jpg" 
                            alt="Developer NOC for property purchase"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">6. Apply for Developer NOC</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                If you are buying from the secondary market, then the seller needs to apply for a No Objection Certificate (NOC) from the property developer. This usually costs between AED 500 to AED 5000. Usually, both parties will go to the developer&apos;s office to apply for this document. However, in some cases this can also be done online.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 7 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">7. Get Manager&apos;s Cheque(s)</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                The down payment for your property purchase has ot be in the form of a manager&apos;s cheque. Cash payments are no longer accepted by the Dubai Land Department (DLD) and DLD Trustee offices. Therefore, you should contact your bank to make sure they issue a manager&apos;s cheque for the amount equivalent to the down payment.
                            </p>
                            <p>
                                Typically, this process takes no longer than a few hours at most. The bank will ask you for the seller&apos;s details and documents. So please make sure you carry those with you.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/cheque.jpg" 
                            alt="Manager's cheque for property purchase"
                        />
                    </div>
                </div>

                {/* Step 8 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-transfer.jpg" 
                            alt="Property transfer in Dubai"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">8. Transfer the property</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Finally, on the date of your appointment at a Dubai Land Department (DLD) Trustee office, you should attend along with the seller and the property consultant(s). If you have applied for a mortgage, the lending bank&apos;s representative will also be there to hand over cheques pertaining to your loan amount(s).
                            </p>
                            <p>
                                Once all the charges and fees are paid, the DLD will issue a title deed that mentions the property details and certifies you as the new owner of the property.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gray-900 rounded-xl p-8 mt-12 text-center">
                    <h2 className="text-2xl text-white mb-4">Ready to start your property journey in Dubai?</h2>
                    <p className="text-gray-300 mb-6">Our expert consultants are here to help you navigate the entire buying process.</p>
                    <Link href="/contact-us" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition duration-300">
                        Contact Us Today
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BuyingPropertyProcessPage;
