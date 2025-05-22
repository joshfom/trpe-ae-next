import React from 'react';
import type {Metadata} from "next";
import JoinUsForm from "@/features/site/components/JoinUsForm";

export const metadata: Metadata = {
    title: "Join TRPE | Dubai Real Estate | Join Our Team",
    description: "Join TRPE Real Estate team. Start your career in Dubai real estate. Browse the latest Dubai property for sale or rent.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/join-us`,
    },
};


function ContactPage() {
    return (
        <div className={'bg-black text-white'}>


            <div className={'h-[700px] relative'}>
                <img
                    className={'h-full w-full object-cover'}
                    src="/images/career-cover-2.jpeg" alt=""/>
                <div className="inset-0 bg-black/40 absolute">
                    <div className="max-w-7xl py-4 px-6 mx-auto flex flex-col justify-end pb-12 items-center h-full">
                        <div className="py-4 px-6  rounded-3xl">
                            <h2 className="text-2xl uppercase lg:text-4xl text-center">
                                Create opportunities. Don&apos;t wait for them. <br/> Build
                                Your Real Estate Success Story with us.
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:pt-24 px-6  py-12">
                <div className={'space-y-4 text-justify'}>
                    <h2 className="text-2xl lg:text-4xl">
                        Welcome to TRPE  Careers
                    </h2>

                    <p>
                        At TRPE Real Estate, we believe in the power of exceptional talent. We are committed to building
                        a team of professionals who share our passion for excellence, innovation and customer
                        satisfaction. Our dynamic work environment fosters growth, collaboration and success; empowering
                        our employees to achieve their full potential.
                    </p>
                    <p>
                        Join us on our journey to redefine the real estate landscape. Whether you&apos;re a seasoned
                        professional or just starting your career, TRPE offers a range of opportunities that cater to
                        diverse skills and aspirations.
                    </p>
                    <p>
                        From sales and marketing to operations and support, we provide the platform for you to thrive
                        and make a real impact.
                    </p>
                </div>

                <div className="space-y-4 text-justify">
                    <h2 className="text-2xl lg:text-4xl">
                        Why TRPE Real Estate?
                    </h2>

                    <p>
                        <span className="font-semibold">Innovative Work Environment:</span>
                        Embrace real estate technology, AI and industry best practices to stay ahead in a competitive
                        market.
                    </p>

                    <p>
                        <span className="font-semibold">Professional Growth:</span>
                        Benefit from on-the-job training and development programs designed to enhance your skills and
                        advance your career.
                    </p>


                    <p>
                        <span className="font-semibold">Committed to Excellence:</span>
                        Work with a company that has the desire to raise the bar and a reputation for excellence in the
                        real estate industry.
                    </p>


                    <p>
                        <span className="font-semibold">Client-Centric Approach: </span>
                        Play a key role in delivering exceptional service and solutions to our valued clients, ensuring their real estate needs are met and their expectations exceeded.
                    </p>



                </div>
            </div>

            <div className="pt-12 mx-auto max-w-7xl">
                <h3 className={'text-center text-2xl lg:text-3xl uppercase'}>Ready to make a difference? <br /> Discover your potential at TRPE. </h3>
            </div>
            <div className="max-w-7xl mx-auto relative pt-12 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                    <img className={'h-[600px] w-full object-cover rounded-2xl'} src="/images/career/career-team.jpeg"
                         alt=""/>
                </div>
                <div>
                    <img className={'h-[600px] w-full object-cover rounded-2xl'} src="/images/career/career-black.jpg"
                         alt=""/>
                </div>
                <div>
                    <img className={'h-[600px] w-full object-cover rounded-2xl'} src="/images/career/career-high-5.jpg"
                         alt=""/>
                </div>
                <div className="absolute inset-0 bg-black/40">
                    <div className="max-w-7xl py-4 px-6 mx-auto flex flex-col justify-center pb-24 items-center h-full">
                        <div className="py-4 px-6  rounded-3xl">
                            <h1 className="text-3xl mt-24 lg:text-6xl text-center">
                                Our Culture
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pb-12 grid grid-col-1 lg:grid-cols-3 text-justify gap-6  mx-auto  max-w-7xl">
                <p className={'px-2'}>
                    We are a team of result-oriented professionals who thrive in a fast-paced environment. We believe in
                    the power of diverse perspectives and welcome candidates from all backgrounds.
                </p>
                <p className={'px-2'}>
                    Our team operates with the agility of a startup, fostering innovation and collaboration. We are
                    committed to building strong, cohesive teams that deliver exceptional
                    results.

                </p>

                <p className={'px-2'}>
                    Explore our current openings and take the first step towards a rewarding career with TRPE. We look
                    forward to welcoming you to our team and supporting your journey to success.
                </p>


            </div>



            <div className="py-12  mx-auto max-w-7xl">

                <div className="mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        <div className={'px-6'}>
                            <h3 className={'text-3xl font-semibold mb-6 '}>
                                Our Team is Our Most Valuable Asset
                            </h3>
                            <div className={'grid gap-4 grid-cols-3'}>

                                <div className={'col-span-1 flex items-center justify-center'}>

                                    <p className="ml-8 text-[80px] lg:text-[160px] ">
                                        WE
                                    </p>
                                </div>
                                <div className={'col-span-2 mt-8 flex items-center justify-center'}>
                                    <ul className={'list-disc space-y-2 pl-8'}>
                                        <li>Share a common goal</li>
                                        <li>Love what we do</li>
                                        <li>Celebrate achievements</li>
                                        <li>Alleviate failures</li>
                                        <li>Work hard</li>
                                        <li>Aim high</li>
                                        <li>Are fun</li>
                                        <li>Have each others back</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                        <div className={'px-6'}>
                            <img className={'w-full h-96 object-cover rounded-3xl'}
                                 src="/images/career/career-lady-front.jpeg" alt=""/>
                        </div>
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-6 relative py-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                    <img className={'h-[600px] w-full object-cover rounded-2xl'}
                         src="/images/career/careers-hand-shake.jpeg"
                         alt=""/>
                </div>
                <div>
                    <img className={'h-[600px] w-full object-cover rounded-2xl'} src="/images/career/career-lady.jpeg"
                         alt=""/>
                </div>
                <div>
                    <img className={'h-[600px] w-full object-cover rounded-2xl'}
                         src="/images/career/careers-hands-up.jpg"
                         alt=""/>
                </div>
                <div className="absolute inset-0 bg-black/40">
                    <div className="max-w-7xl py-4 px-6 mx-auto flex flex-col justify-center pb-24 items-center h-full">
                        <div className="py-4 px-6  rounded-3xl">
                            <h2 className="text-3xl mt-32 lg:text-6xl text-center">
                                OUR ETHOS

                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative pb-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className={'text-justify space-y-3 px-2'}>
                    <h3 className="font-semibold">
                        EXCELLENCE
                    </h3>
                    <p>
                        We believe in harnessing talent and cultivating superstars who excel in their roles. We provide
                        the roadmap to excellence and the tools to pave the way forward.
                        </p>
                    <p>
                        All you need is the desire to
                        unlock your hidden potential to achieve the greatness you know you deserve.  Your success is our success.
                    </p>


                </div>
                <div className={'text-justify space-y-3 px-2'}>
                    <h3 className="font-semibold">
                        EMPOWERMENT
                    </h3>
                    <p>
                        We choose to pursue sustainable expansion rather than running after rapid growth.

                    </p>

                    <p>
                        Onboarding like-minded people, we build a team that augments our corporate culture – one we can empower and place our trust in – as they steadfastly uphold our core values.


                    </p>
                </div>
                <div className={'space-y-3 px-2 text-justify'}>
                    <h3 className="font-semibold">
                        ENRICHMENT
                    </h3>
                    <p>
                        We map our journey of success in a manner such that every employee enjoys the pursuit of their success while helping us attain ours.

                    </p>

                    <p>
                        Our aim is to create a professional ecosystem within which every team member feels valued. We harness a culture of support whereby colleagues are inspired by each other’s success stories and are motivated to add to their own.

                    </p>
                    {/*<p>*/}
                    {/*    We believe in making coming to work a positive experience by providing a workspace where your career growth and satisfaction are our top priorities.*/}

                    {/*</p>*/}
                </div>
            </div>


            <div className="py-12 lg:py-24 max-w-7xl px-6 mx-auto flex flex-col  lg:flex-row-reverse gap-12">
                <div className={'w-full lg:w-1/2 flex justify-center items-center'}>
                    <div className={'rounded-3xl mx-auto h-full w-full '}>

                        <img
                            className={'w-full h-full object-cover rounded-3xl'}
                            src="/images/career/career-join.jpeg"
                            alt=""/>

                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <h3 className="text-3xl">
                        Interested in Joining TRPE?
                    </h3>
                    <p className="pt-4">
                        If you are determined to succeed and ready to start your real estate career with us, then apply
                        now. We would love to hear from you!

                    </p>

                    <JoinUsForm/>
                </div>


            </div>
        </div>
    );
}

export default ContactPage;