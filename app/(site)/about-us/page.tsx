import React from 'react';
import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import BoxReveal from "@/features/site/components/BoxReveal";

export const metadata: Metadata = {
    title: "About Us | Dubai Real Estate | Buy, Sell or Rent Property in Dubai - TRPE AE",
    description: "Discover Dubai property expertise at TRPE. Learn about our team, values, and commitment to helping you find your perfect home.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/about-us`,
    },
};


function ContactPage() {

    const aboutJsonLD = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "url": "https://trpe.ae/about-us",
        "name": "TRPE Real Estate",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+971 4 554 1374",
            "contactType": "customer service"
        }
    }


    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(aboutJsonLD)}}
            />
            <div className="bg-black py-10 hidden lg:block"></div>

            <section className={'w-full bg-black text-white py-12 lg:pt-44 px-6'}>
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 pb-12">
                    <div className={'py-12 w-full lg:w-1/2 space-y-4 lg:pr-12'}>
                        <BoxReveal boxColor={"rgb(255,255,255)"} duration={0.5}>
                            <h1 className="text-4xl pb-4 font-semibold text-white">
                                About Us
                            </h1>
                        </BoxReveal>


                        <BoxReveal boxColor={"rgb(255,255,255)"} duration={0.5}>
                            <p className={'text-white'}>
                                TRPE Real Estate was founded by real estate veterans who have made a
                                significant mark in London&apos;s elite real estate market. Now, we bring our extensive
                                experience and innovative strategies to Dubai – one of the world’s fastest-growing
                                property markets – offering clients unmatched insights and investment opportunities.
                            </p>
                        </BoxReveal>


                        <BoxReveal boxColor={"rgb(255,255,255)"} duration={0.5}>
                            <p className={'text-white'}>
                                Our team’s deep understanding of both markets enables us to provide exceptional service,
                                tailored solutions and a global perspective that sets us apart. We believe in creating
                                wealth through real estate, and our mission is to guide you every step of the way.
                            </p>
                        </BoxReveal>


                        <BoxReveal boxColor={"rgb(252,252,252)"} duration={0.5}>
                            <p className={'text-white'}>
                                At TRPE, we are committed to excellence, integrity, and success. We don’t just sell and
                                rent
                                properties; we build lasting relationships and create opportunities for profitable
                                returns
                                for our clients.
                            </p>
                        </BoxReveal>

                        <BoxReveal boxColor={"rgb(255,255,255)"} duration={0.5}>
                            <p className={'text-white'}>
                                Connect with our team today for a one-to-one consultation.
                            </p>
                        </BoxReveal>


                        <BoxReveal boxColor={"rgb(255,255,255)"} duration={0.5}>
                            <div className="py-6">
                                <Link
                                    className={'border rounded-full px-6  py-2 bg-transparent text-white font-semibold hover:text-black hover:bg-white'}
                                    href={'/communities'}>
                                    View Properties
                                </Link>
                            </div>
                        </BoxReveal>


                    </div>
                    <div className={'grid grid-cols-2 gap-2 lg:gap-6 w-full lg:w-1/2'}>
                        <div className={'space-y-2 lg:space-y-8'}>
                            <div>
                                <img className={'h-80 object-cover w-72 rounded-2xl'}
                                     src="/images/about-guy.jpg"
                                     alt="invest"/>
                            </div>
                            <div>
                                <img className={'h-80 object-cover w-72 rounded-2xl'}
                                     src="/images/about-3-people.jpeg"
                                     alt="invest"/>
                            </div>
                        </div>
                        <div className={'space-y-2 lg:space-y-8 -mt-12 lg:-mt-24'}>
                            <div>
                            <img className={'h-80 object-cover w-72 rounded-2xl'}
                                     src="/images/agent-client.jpeg"
                                     alt="invest"/>

                            </div>
                            <div>
                                <img className={'h-80 object-cover w-72 rounded-2xl'}
                                     src="/images/about-2-people.jpeg"
                                     alt="invest"/>
                            </div>
                        </div>
                    </div>
                </div>

            </section>


            {/*OUR EXPERTS*/}

            <section className="py-12 p-6 bg-black text-white">
                <div className="max-w-7xl mx-auto border-t py-12">
                    <h3 className="text-3xl font-semibold text-white text-center pt-6">
                        Meet Our Experts
                    </h3>
                    <div className="mt-6 space-y-4 max-w-4xl mx-auto">
                        <p className="text-center">

                            TRPE Real Estate prides itself in the investment we make in our team, by continually training and staying up-to-date on the latest trends. Our experienced team will cherry-pick the right strategies and properties for your property.

                        </p>
                        <p className="text-center">
                        The process of finding the right property or real estate expert can be gruelling, especially alone. We have some of the most well-trained experts that can hand hold you to find or list your property. Our team have a wealth of experience in all aspects of real estate and can bring you sound advice that will make the process smoother. Get in touch with one of our experts today and leave us to take care of your search.
                    </p>
                        <div className="pt-6 flex flex-col lg:flex-row justify-center gap-8">
                            <Link
                                className={'border text-center rounded-full px-6 uppercase py-2 bg-transparent text-white font-semibold hover:text-black hover:bg-white'}
                                href={'/our-team'}>
                                Meet the Team
                            </Link>
                            {/*<Link*/}
                            {/*    className={'border-b-2 px-6 text-center uppercase py-2 bg-transparent text-white font-semibold hover:text-black hover:bg-white'}*/}
                            {/*    href={'/meet-experts'}>*/}
                            {/*    Meet the team*/}
                            {/*</Link>*/}
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}

export default ContactPage;