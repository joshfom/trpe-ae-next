import React from "react";
import Link from "next/link";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Selling process in Dubai | Sale a Property in Dubai",
    description: "Selling process in Dubai, Rent a property in Dubai, Find your next home or investment in Dubai. Browse the latest Dubai property for sale or rent.",
    creator: "Joshua Fomubod",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/selling-property-process`,
    },
};

function SellingPropertyProcessPage() {
    return (
        <div className="bg-black min-h-screen pb-20">
            <div className="py-10 bg-black hidden lg:block"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="py-12">
                    <h1 className="text-4xl text-white mb-8">
                        Selling Property Process
                    </h1>
                    <p className="text-gray-300 text-lg max-w-3xl">
                        Follow our comprehensive guide to successfully sell your property in Dubai.
                    </p>
                </div>

                {/* Step 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">1. Appoint a Real Estate Agent</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Appointing the right property consultant is a very important first step. Everything else becomes
                                very easy because a good property consultant will do everything else for you. From pricing to
                                photography and video shoots of your property, listing, advertising and finding prospective buyers –
                                they will handle the entire process for you.
                            </p>

                            <p>
                                The process for formally appointing a property consultant is to sign a Form A. This is Dubai Land
                                Department&apos;s (DLD) official contract between a seller and a real estate agent. It contains the
                                details of both parties and the financial arrangement (i.e. the agreed commission amount) between
                                them.
                                <Link href={'/our-team'} className={'underline ml-1'}>Click here</Link> to meet our team of property
                                consultants.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/choose-agent.jpg" 
                            alt="Choose a real estate agent"
                        />
                    </div>
                </div>

                {/* Step 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/prepare-docs.jpg" 
                            alt="Prepare relevant documents"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">2. Prepare Relevant Documents</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                To sign the Form A, you will need to provide the property consultant with a copy of your passport,
                                visa page, Emirates ID and title deed (or Oqood, if your property is off-plan).
                            </p>

                            <p>
                                Apart from that, make sure you have the following set of documents ready, because you will need them
                                at the Dubai Land Department Trustee office when you transfer the property:
                            </p>
                            <ul className="list-disc pl-8">
                                <li>Original title deed (or Oqood, if your property is off-plan)</li>
                                <li>Floor plan of your property</li>
                                <li>Original mortgage clearance letter from the bank (if applicable)</li>
                                <li>Original No Objection Certificate (NOC) from the developer (if applicable)</li>
                            </ul>
                            <p>
                                In addition to that, if you have done any modifications or renovations to the original property as
                                you had bought it, then you should have documents pertaining to obtaining permits and approvals for
                                the same.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">3. Ensure the Property is in Good Condition</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Needless to say, you should make sure the property is in good condition for viewing by prospective
                                buyers, and for any photography or videography that the property consultant will want to do in order
                                to list your property.
                            </p>

                            <p>
                                Make sure any repairs and maintenance issues are taken care of prior to viewing. The last thing you
                                want is for the buyer to negotiate a lower price due to any unnecessary issues that can easily be
                                avoided.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-inspection.jpg" 
                            alt="Property in good condition"
                        />
                    </div>
                </div>

                {/* Step 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/developer-noc.jpg" 
                            alt="Sign the Form F"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">4. Sign the Form F</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Once you receive an offer you are ready to accept, you will need to sign a Memorandum of
                                Understanding (MOU). This is an official Dubai Land Department (DLD) document known as Form F.
                            </p>

                            <p>
                                At this stage, both parties (you and the buyer) need to provide a security cheque in favour of the
                                other party for an amount which is 10% of the property value. The security cheques from both parties
                                is held by the property consultant; and is not handed over to either party.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="space-y-4">
                        <h2 className="text-2xl text-white">5. Apply for Developer NOC</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                You will now need to apply for a No Objection Certificate (NOC) from the property developer. This
                                usually costs between AED 500 to AED 5000. Usually, both parties will go to the developer&apos;s
                                office to apply for this document. However, in some cases, this can also be done online.
                            </p>
                            <p>
                                An important point to note is that if your property is mortgaged, you will need to get a liability
                                letter from the lending bank. This document is usually valid for a period of 15 days. You can only
                                get an NOC after you have obtained the liability letter.
                            </p>
                            <p>
                                The buyer must first settle this mortgage. It will be done at the DLD Trustee office, where the
                                Trustee office will hold the buyer&apos;s payments and issue a &quot;Restrain Property&quot; certificate. You will
                                receive a clearance letter from your lending bank.
                            </p>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/developer-doc.jpg" 
                            alt="Developer NOC"
                        />
                    </div>
                </div>

                {/* Step 6 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                    <div className="order-2 md:order-1 h-80 rounded-lg overflow-hidden">
                        <img 
                            className="h-full w-full object-cover" 
                            src="/images/property-transfer.jpg" 
                            alt="Transfer the property"
                        />
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-2xl text-white">6. Transfer the property</h2>
                        <div className="space-y-4 text-gray-300">
                            <p>
                                Last but not least, both parties will meet at the Dubai Land Department (DLD) Trustee office
                                accompanied by the property consultant (and also the mortgage broker of the lending bank if the
                                buyer is using a mortgage to buy the property). You will need to take all your original documents
                                with you, which you should already have ready since you have addressed this earlier on in the
                                process.
                            </p>
                            <p>
                                If you had a mortgage on your property, then you should also take your clearance letter with you.
                            </p>
                            <p>
                                If both you and the buyer have mortgages, then the buyer&apos;s lending bank will settle your mortgage
                                with your lending bank. A cash buyer will settle your mortgage directly with your lending bank.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gray-900 rounded-xl p-8 mt-12 text-center">
                    <h2 className="text-2xl text-white mb-4">Ready to sell your property in Dubai?</h2>
                    <p className="text-gray-300 mb-6">Our expert consultants are here to help you through the entire selling process.</p>
                    <Link href="/contact-us" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition duration-300">
                        Contact Us Today
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SellingPropertyProcessPage;
