import React from 'react';
import { Mail, Phone, Calendar, User, BookOpen, Home } from "lucide-react";
import Link from 'next/link';

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

interface LuxeAdvisorSSRProps {
    advisor: Advisor;
    journalArticles: JournalArticle[];
}

// SSR-compatible Tab Button
const TabButtonSSR = ({ 
    id, 
    icon: Icon, 
    label, 
    count,
    isActive = false
}: { 
    id: 'journals' | 'listings'; 
    icon: any; 
    label: string; 
    count?: number; 
    isActive?: boolean;
}) => (
    <button
        disabled
        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-medium cursor-not-allowed ${
            isActive
                ? 'bg-black text-white shadow-lg opacity-75'
                : 'border border-gray-500/30 text-gray-500 opacity-75'
        }`}
    >
        <Icon size={18} />
        <span>{label}</span>
        {count !== undefined && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                isActive ? 'bg-white/20' : 'bg-gray-500/20'
            }`}>
                {count}
            </span>
        )}
    </button>
);

// SSR-compatible Journal Card
const JournalCardSSR = ({ article }: { article: JournalArticle }) => (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl overflow-hidden border border-white/20">
        {article.coverUrl && (
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={article.coverUrl} 
                    alt={article.title || 'Article image'}
                    className="w-full h-full object-cover"
                />
            </div>
        )}
        <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                {article.title || 'Untitled Article'}
            </h3>
            <p className="text-gray-400 mb-4 line-clamp-3">
                {article.metaDescription || 'Luxury real estate insights and market analysis.'}
            </p>
            <div className="flex items-center justify-between">
                <span className="text-sm text-white">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recently published'}
                </span>
                <Link 
                    href={`/luxe/insights/${article.slug}`}
                    className="text-black hover:text-gray-700 transition-colors text-sm font-medium"
                >
                    Read More →
                </Link>
            </div>
        </div>
    </div>
);

const LuxeAdvisorSSR: React.FC<LuxeAdvisorSSRProps> = ({ advisor, journalArticles }) => {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-[#0a0a0a]">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(advisorJsonLD) }}
            />

            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
                    <div className="w-full h-full" style={{
                        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)'
                    }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
                        {/* Left - Content */}
                        <div className="lg:col-span-3 text-center lg:text-left">
                            <div className="mb-6">
                                <span className="inline-block px-4 py-2 bg-gradient-to-r from-white/20 to-gray-300/20 text-white rounded-full text-sm font-medium tracking-wide uppercase">
                                    Luxury Property Advisor
                                </span>
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 font-playfair leading-tight">
                                {advisor?.firstName} {advisor?.lastName}
                            </h1>
                            
                            <h2 className="text-xl sm:text-2xl lg:text-3xl text-white mb-8 font-medium">
                                {advisor?.title || 'Luxury Property Specialist'}
                            </h2>
                            
                            {advisor?.bio && (
                                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
                                    {advisor.bio}
                                </p>
                            )}

                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                                {advisor?.email && (
                                    <a 
                                        href={`mailto:${advisor.email}`}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/20 to-gray-300/20 text-white rounded-full hover:from-white/30 hover:to-gray-300/30 transition-all duration-300 border border-white/30"
                                    >
                                        <Mail size={18} />
                                        <span>Email</span>
                                    </a>
                                )}
                                {advisor?.phone && (
                                    <a 
                                        href={`tel:${advisor.phone}`}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/20 to-gray-300/20 text-white rounded-full hover:from-white/30 hover:to-gray-300/30 transition-all duration-300 border border-white/30"
                                    >
                                        <Phone size={18} />
                                        <span>Call</span>
                                    </a>
                                )}
                                <button 
                                    disabled
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/20 to-gray-300/20 text-white rounded-full border border-white/30 opacity-75 cursor-not-allowed"
                                >
                                    <Calendar size={18} />
                                    <span>Schedule</span>
                                </button>
                            </div>

                            {/* RERA License */}
                            {advisor?.rera && (
                                <div className="text-center lg:text-left">
                                    <span className="text-sm text-gray-400">
                                        RERA License: <span className="text-white font-mono">{advisor.rera}</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right - Image */}
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-white/20 to-gray-300/20 border border-white/30">
                                    {advisor?.avatarUrl ? (
                                        <img 
                                            src={advisor.avatarUrl} 
                                            alt={`${advisor.firstName} ${advisor.lastName}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User size={120} className="text-white/50" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Decorative elements */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/30 to-gray-300/30 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-white/20 to-gray-300/20 rounded-full blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] py-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Tab Navigation - Static for SSR */}
                    <div className="flex flex-wrap gap-4 justify-center mb-12">
                        <TabButtonSSR 
                            id="listings" 
                            icon={Home} 
                            label="Listings" 
                            count={advisor?.properties?.length || 0}
                            isActive={true}
                        />
                        <TabButtonSSR 
                            id="journals" 
                            icon={BookOpen} 
                            label="Journal Articles" 
                            count={journalArticles.length}
                        />
                    </div>

                    {/* Content Area - Show listings by default in SSR */}
                    <div className="min-h-[400px]">
                        {/* Listings Section - Default for SSR */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-8 text-center">
                                Property Listings
                            </h3>
                            {advisor?.properties && advisor.properties.length > 0 ? (
                                <p className="text-center text-gray-400 py-20">
                                    {advisor.properties.length} properties available. Enable JavaScript to view interactive listings.
                                </p>
                            ) : (
                                <div className="text-center py-20">
                                    <Home size={64} className="mx-auto text-white/30 mb-4" />
                                    <h4 className="text-xl font-medium text-white mb-2">No Current Listings</h4>
                                    <p className="text-gray-400">
                                        {advisor?.firstName} doesn&apos;t have any active listings at the moment.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Journal Articles Section - Available in SSR */}
                        {journalArticles.length > 0 && (
                            <div className="mt-16">
                                <h3 className="text-2xl font-bold text-white mb-8 text-center">
                                    Journal Articles ({journalArticles.length})
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {journalArticles.slice(0, 6).map((article) => (
                                        <JournalCardSSR key={article.id} article={article} />
                                    ))}
                                </div>
                                {journalArticles.length > 6 && (
                                    <div className="text-center mt-8">
                                        <p className="text-gray-400">
                                            And {journalArticles.length - 6} more articles...
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LuxeAdvisorSSR;
