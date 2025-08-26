"use client"

import React, { useState } from 'react';
import { Mail, Phone, Calendar, User, BookOpen, Home } from "lucide-react";
import ListWithAgent from "@/features/agents/components/ListWithAgent";
import ListingsGridWithSkeleton from "@/features/properties/components/ListingsGrid";

interface Advisor {
    id: string;
    firstName: string | null;
    lastName: string | null;
    title: string | null;
    bio: string | null;
    phone: string | null;
    email: string | null;
    avatarUrl: string | null;
    rera: string | null;
    slug: string;
    properties?: any[];
    insights?: any[];
    author?: any;
}

interface JournalArticle {
    id: string;
    title: string | null;
    coverUrl: string | null;
    metaDescription: string | null;
    publishedAt: string | null;
    slug: string;
}

interface LuxeAdvisorClientProps {
    advisor: Advisor;
    journalArticles: JournalArticle[];
}

const LuxeAdvisorClient: React.FC<LuxeAdvisorClientProps> = ({ advisor, journalArticles }) => {
    const [activeTab, setActiveTab] = useState<'journals' | 'listings'>('listings');

    const advisorJsonLD = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": `${advisor?.firstName} ${advisor?.lastName}`,
        "jobTitle": "Luxury Property Advisor",
        "image": advisor?.avatarUrl,
        "url": `${process.env.NEXT_PUBLIC_URL}/luxe/advisors/${advisor?.slug}`,
        "email": advisor?.email,
        "telephone": advisor?.phone,
        "description": advisor?.bio,
        "worksFor": {
            "@type": "Organization",
            "name": "The Real Property Experts - Luxe"
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dubai",
            "addressCountry": "UAE"
        }
    };

    const TabButton = ({ 
        id, 
        icon: Icon, 
        label, 
        count 
    }: { 
        id: 'journals' | 'listings'; 
        icon: any; 
        label: string; 
        count?: number; 
    }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                activeTab === id
                    ? 'bg-black text-white shadow-lg'
                    : 'border border-gray-500/30 text-gray-500 hover:border-gray-500/60 hover:bg-gray-500/10'
            }`}
        >
            <Icon size={18} />
            <span>{label}</span>
            {count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === id ? 'bg-white/20' : 'bg-gray-500/20'
                }`}>
                    {count}
                </span>
            )}
        </button>
    );

    const JournalCard = ({ article }: { article: JournalArticle }) => (
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 group">
            {article.coverUrl && (
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={article.coverUrl} 
                        alt={article.title || 'Article image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
            )}
            <div className="p-6">
                <h4 className="text-xl font-semibold mb-3 text-white group-hover:text-white transition-colors duration-300">
                    {article.title}
                </h4>
                {article.metaDescription && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {article.metaDescription}
                    </p>
                )}
                {article.publishedAt && (
                    <p className="text-white text-sm">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                )}
                <a 
                    href={`/luxe/journal/${article.slug}`}
                    className="inline-block mt-4 text-black hover:text-gray-700 transition-colors duration-300 font-medium"
                >
                    Read More →
                </a>
            </div>
        </div>
    );

    const JournalsEmptyState = () => (
        <div className="text-center py-16">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-12 border border-white/20 max-w-2xl mx-auto">
                <BookOpen className="w-16 h-16 text-white/60 mx-auto mb-6" />
                <h4 className="text-2xl font-semibold text-white mb-4">
                    Journal Coming Soon
                </h4>
                <p className="text-gray-300 text-lg leading-relaxed">
                    {advisor?.firstName} is preparing exclusive insights and market analysis. 
                    Check back soon for expert commentary on Dubai&apos;s luxury real estate market.
                </p>
                <div className="mt-8">
                    <button className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-all duration-300">
                        <Mail className="mr-2" size={16} />
                        Get Notified
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-black pt-12 lg:pt-24 text-white min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(advisorJsonLD)}}
            />
            
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto p-6 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Advisor Profile Card */}
                <div className="py-6">
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] shadow-lg rounded-xl p-6 flex items-center justify-center flex-col gap-4 border border-white/20">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl text-center font-semibold bg-gradient-to-r  bg-clip-text text-white">
                                {advisor?.firstName + ' ' + advisor?.lastName}
                            </h1>
                            <div className="flex justify-between items-center">
                                <p className="text-center text-gray-300">Luxury Property Advisor</p>
                                {advisor?.rera && (
                                    <p className="text-center pl-2 text-gray-400">
                                        BRN: <span className="font-semibold text-white">{advisor.rera}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="w-full h-[500px] relative">
                            <div className="relative h-[500px] w-full lg:w-[90%] mx-auto border border-white/30 rounded-3xl overflow-hidden shadow-xl">
                                <img 
                                    className="object-cover absolute inset-0 w-full h-full" 
                                    src={advisor.avatarUrl || '/images/defaults/agent.jpg'} 
                                    alt={`${advisor.firstName} ${advisor.lastName}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col w-full lg:w-[90%] justify-between">
                            <div className="flex justify-between gap-4">
                                <a 
                                    className="inline-flex items-center justify-center bg-black text-white font-semibold w-1/2 py-2 rounded-3xl px-4 hover:bg-gray-900 transition-all duration-300" 
                                    href={`tel:${advisor.phone || '+971 50 523 2712'}`}
                                >
                                    <Phone className="mr-2" size={20}/>
                                    <span className="text-lg">Call</span>
                                </a>
                                <a 
                                    className="inline-flex items-center justify-center border border-white/50 text-white hover:bg-white hover:text-black w-1/2 py-2 rounded-3xl px-4 transition-all duration-300" 
                                    href={`mailto:${advisor.email || 'info@trpe.ae'}`}
                                >
                                    <Mail className="mr-2" size={20}/>
                                    <span className="text-lg">Email</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="col-span-1 lg:col-span-2 pt-6 lg:px-16 h-full justify-between flex flex-col">
                    <div className="space-y-4 flex-1">
                        <h2 className="text-4xl font-semibold text-white">
                            About {advisor?.firstName}
                        </h2>

                        {advisor?.bio && (
                            <div className="space-y-2 text-gray-300 flex-1 overflow-y-auto mt-6 text-lg leading-relaxed" 
                                 dangerouslySetInnerHTML={{__html: advisor.bio}}>
                            </div>
                        )}
                    </div>

                    <div className="py-6 w-full flex justify-between items-center">
                        <div className="space-x-3 flex items-center">
                            <div className="flex space-x-3 items-center">
                                <div className="flex items-center">
                                    <svg
                                        viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                        className="h-6 w-6 mr-2" preserveAspectRatio="xMidYMid meet"
                                        fill="#000000">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
                                           strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path fill="#00247D"
                                                  d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"></path>
                                            <path fill="#CF1B2B"
                                                  d="M25.14 23l9.712 6.801a3.977 3.977 0 0 0 .99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8a3.988 3.988 0 0 0-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2a3.994 3.994 0 0 0-.991 1.749L7.372 13h3.487z"></path>
                                            <path fill="#EEE"
                                                  d="M36 21H21v10h2v-5.836L31.335 31H32a3.99 3.99 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9a3.983 3.983 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4.001 4.001 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4a3.985 3.985 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A3.968 3.968 0 0 0 0 9v.059L5.628 13H0v2h15V5h-2z"></path>
                                            <path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"></path>
                                        </g>
                                    </svg>
                                    <span className="text-gray-300">English</span>
                                </div>
                            </div>
                        </div>
                        <ListWithAgent agent={advisor as any}/>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-wrap gap-4 justify-center">
                    <TabButton 
                        id="listings" 
                        icon={User} 
                        label="Listings" 
                    />
                    <TabButton 
                        id="journals" 
                        icon={BookOpen} 
                        label="Journal" 
                        count={journalArticles.length}
                    />
     
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                {activeTab === 'journals' && (
                    <div>
                        <h3 className="text-4xl font-semibold mb-8 text-white">
                            {advisor?.firstName}&apos;s Journal
                        </h3>
                        
                        {journalArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {journalArticles.map((article) => (
                                    <JournalCard key={article.id} article={article} />
                                ))}
                            </div>
                        ) : (
                            <JournalsEmptyState />
                        )}
                    </div>
                )}

                {activeTab === 'listings' && (
                    <div>
                        <h3 className="text-4xl font-semibold mb-8 text-white">
                            {advisor?.firstName}&apos;s Luxury Listings
                        </h3>

                        {advisor?.properties && advisor?.properties?.length > 0 ? (
                            <ListingsGridWithSkeleton listings={advisor?.properties as any}/>
                        ) : (
                            <div className="text-center py-16">
                                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-12 border border-white/20 max-w-2xl mx-auto">
                                    <Home className="w-16 h-16 text-white/60 mx-auto mb-6" />
                                    <h4 className="text-2xl font-semibold text-white mb-4">
                                        Curating Exclusive Properties
                                    </h4>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        {advisor?.firstName} is currently curating an exclusive selection of luxury properties. 
                                        Please contact directly for private viewings and off-market opportunities.
                                    </p>
                                    <div className="mt-8 flex gap-4 justify-center">
                                        <a 
                                            href={`tel:${advisor.phone || '+971 50 523 2712'}`}
                                            className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-all duration-300"
                                        >
                                            <Phone className="mr-2" size={16} />
                                            Call Now
                                        </a>
                                        <a 
                                            href={`mailto:${advisor.email || 'info@trpe.ae'}`}
                                            className="inline-flex items-center px-6 py-3 border border-white/50 text-white hover:bg-white hover:text-black rounded-full transition-all duration-300"
                                        >
                                            <Mail className="mr-2" size={16} />
                                            Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LuxeAdvisorClient;
