import React from 'react';
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - Dubai Real Estate | Buy, Sell or Rent Property in Dubai",
    description: "Website Privacy Policy - Find your next home or investment in Dubai. Browse the latest Dubai property for sale or rent.",
    creator: "Joshua Fomubod",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/privacy-policy`,
    },
};

function Page() {
    return (
        <div>
            <div className="py-10 bg-black hidden lg:block">

            </div>

            <div className="lg:max-w-5xl mx-auto space-y-8 py-12 px-6">
                <h1 className="text-3xl font-bold">
                    TRPE Real Estate Privacy Policy
                </h1>

                <div>
                    <p>At TRPE Real Estate, we prioritize your privacy and are dedicated to protecting your personal
                        information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your
                        personal data when you interact with our website and services. By accessing our website or using
                        our services, you agree to the practices described in this Privacy Policy.</p>
                </div>

                <div className={'space-y-4'}>
                    <h3 className="font-bold text-xl">
                        Types of Data We Collect
                    </h3>
                    <p>
                        We may collect various types of personal data when you visit our website or use our services.
                        The types of data we collect include:
                    </p>

                    <div className={'py-2'}>
                        <span className="font-bold">
                            1. Personal Information:
                        </span> This may include your name, email address, phone number, postal address, and any other
                        information you voluntarily provide to us.
                    </div>

                    <div className={'py-2'}>
                        <span className="font-bold">
                            2. Usage Data:
                        </span> We automatically collect information about your interactions with our website, such as
                        your IP address, device information, browser type, referring/exit pages, and operating system.
                    </div>

                    <div className={'py-2'}>
                        <span className="font-bold">
                             3. Cookies and Tracking Technologies:</span>  We may use cookies, beacons, and similar
                        technologies to collect information about your
                        browsing activities. These technologies help us analyze trends, administer the website, track
                        users’ movements around the site, and gather demographic information.
                    </div>


                </div>

                <div className="space-y-4">
                    <h4 className={'font-bold text-xl'}>
                        Use of Data
                    </h4>

                    <div>
                        <p>We use the collected data for various purposes, including:</p>
                    </div>
                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                                1. Providing and Improving Services:
                            </span> We use your data to deliver the services you request and to enhance your experience
                            on our website. This includes personalizing content, improving functionality, and developing
                            new features.
                        </p>
                    </div>


                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                               2. Communication:
                            </span> We may use your contact information to respond to your inquiries, provide customer
                            support, and send you important updates or notifications related to our services.
                        </p>
                    </div>


                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                               3. Marketing:
                            </span> With your consent, we may send you promotional emails about our services, special
                            offers, or other information that may be of interest to you. You have the option to opt-out
                            of receiving such communications at any time.
                        </p>
                    </div>

                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                               4. Legal Compliance:
                            </span> We may use your data to comply with applicable laws, regulations, legal processes,
                            or enforceable governmental requests.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className={'font-bold text-xl'}>
                        Sharing of Data
                    </h4>

                    <div>
                        <p>We understand the importance of maintaining your privacy and do not sell, trade, or rent your
                            personal data to third parties without your consent. However, we may share your data in the
                            following circumstances:</p>
                    </div>
                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                                1. Service Providers:
                            </span> We may share your personal data with trusted service providers who assist us in
                            operating our website, conducting business, or providing services to you. These third-party
                            providers are obligated to maintain the confidentiality and security of your data.
                        </p>
                    </div>


                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                               2. Legal Requirements:
                            </span> We may disclose your personal data if required to do so by law or in response to a
                            valid request from a governmental authority.
                        </p>
                    </div>


                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                              3. Business Transfers:
                            </span> In the event of a merger, acquisition, or sale of all or a portion of our assets,
                            your personal data may be transferred to the acquiring entity as part of the transaction. We
                            will notify you via email or prominent notice on our website before your data becomes
                            subject to a different privacy policy.
                        </p>
                    </div>


                </div>

                <div className="space-y-4">
                    <h4 className={'font-bold text-xl'}>
                        Your Choices and Rights
                    </h4>

                    <div>
                        <p>You have certain rights regarding your personal data, including:
                        </p>
                    </div>
                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                               1. Access and Correction:
                            </span> You may request access to the personal data we hold about you and update or correct
                            any inaccuracies.
                        </p>
                    </div>


                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                               2. Opt-Out:
                            </span> You can opt-out of receiving promotional emails from us by following the
                            instructions provided in the email. Please note that even if you opt-out, we may still send
                            you non-promotional communications, such as those related to transactions or services.
                        </p>
                    </div>


                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                              3. Data Retention:
                            </span> We will retain your personal data for as long as necessary to fulfill the purposes
                            outlined in this Privacy Policy unless a longer retention period is required or permitted by
                            law.
                        </p>
                    </div>


                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                               4. Data Transfer:
                            </span> If you are located in a different country, your data may be transferred to and
                            processed in other jurisdictions. By using our services, you consent to such transfer and
                            processing.
                        </p>
                    </div>


                    <div className="py-2">
                        <p>
                            <span className="font-bold">
                               5. Cookies and Tracking Technologies:
                            </span> You can manage your preferences regarding cookies and similar tracking technologies
                            through
                            your browser settings or other opt-out mechanisms.
                        </p>
                    </div>


                </div>

                <div className="space-y-4">
                    <h4 className={'font-bold text-xl'}>
                        Children’s Privacy
                    </h4>

                    <div>
                        <p>
                            Our services are not intended for individuals under the age of 16. We do not knowingly
                            collect personal data from children. If you believe we have inadvertently collected personal
                            data from a child, please contact us to request deletion of the information.
                        </p>
                    </div>

                </div>


                <div className="space-y-4">
                    <h4 className={'font-bold text-xl'}>
                        Changes to this Privacy Policy
                    </h4>

                    <div>
                        <p>
                            We reserve the right to update this Privacy Policy at any time. We will notify you of any
                            changes by posting the revised policy on our website with the updated effective date. We
                            encourage you to review this Privacy Policy periodically for any updates.
                        </p>
                    </div>

                </div>


                <div className="space-y-4">
                    <h4 className={'font-bold text-xl'}>
                        Contact Us
                    </h4>

                    <div>
                        <p>
                            If you have any questions, concerns, or requests regarding this Privacy Policy or the
                            handling of your personal data, please contact us.
                        </p>
                        <p>
                            TRPE Real Estate is reachable on <br/>

                            <span className="font-bold">Tel:</span> +971 4 2286623 <br/>
                            <span className="font-bold">Email:</span> info@trpe.ae <br/>

                            <span className="font-bold">Address:</span> Office 1001, Park Place Tower, Sheikh Zayed
                            Road, Dubai, UAE
                        </p>
                    </div>

                </div>


            </div>

        </div>
    );
}

export default Page;