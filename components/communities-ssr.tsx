import React from 'react';
import Link from 'next/link';

interface CommunityType {
    id: string;
    name: string | null;
    label: string;
    image: string;
    slug: string;
    featured?: boolean;
    displayOrder?: number;
    propertyCount?: number;
    properties?: Array<{ id: string }>;
}

interface CommunitiesSSRProps {
    communities: CommunityType[];
}

export default function CommunitiesSSR({ communities }: CommunitiesSSRProps) {
    return (
        <section className="w-full bg-black">
            <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto text-white">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 lg:mb-8">
                        Top Communities In Dubai
                    </h3>

                    {/* SSR Grid - Works on all screen sizes without JavaScript */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 lg:mt-8">
                        {communities.slice(0, 8).map((community, index) => (
                            <div key={community.id || index} className="relative h-[300px] sm:h-[350px] lg:h-[400px] w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
                                <img 
                                    className="object-cover absolute w-full h-full"
                                    src={community.image || 'https://trpe.ae/wp-content/uploads/2024/03/downtown-dxb_result.webp'}
                                    alt={community.label || community.name || ''}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/30 hover:bg-black/50 transition-colors"/>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center">
                                        {community.label || community.name}
                                    </h3>
                                    <Link 
                                        href={`/communities/${community.slug}`}
                                        className="border rounded-full py-2 sm:py-3 px-4 sm:px-6 border-white hover:bg-white hover:text-black bg-transparent font-semibold transition-colors min-h-[44px] flex items-center"
                                    >
                                        View Community
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Call to action */}
                    <div className="flex justify-center mt-6 lg:mt-8">
                        <Link 
                            href="/communities"
                            className="border rounded-full py-3 px-6 border-white hover:bg-white hover:text-black bg-transparent font-semibold transition-colors min-h-[44px] flex items-center"
                        >
                            View All Communities
                        </Link>
                    </div>

                    {/* Inform users about enhanced experience */}
                    <noscript>
                        <div className="text-center mt-4 text-gray-300 text-sm">
                            Enable JavaScript for an enhanced carousel experience on desktop
                        </div>
                    </noscript>
                </div>
            </div>
        </section>
    );
}