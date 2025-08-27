import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {Facebook, Instagram, Linkedin, Youtube} from "lucide-react";

// Define Community interface to match the API response format
interface Community {
  id?: string;
  name: string | null;
  slug: string;
  shortName?: string | null;
  propertyCount?: number;
  rentCount?: number;
  saleCount?: number;
  commercialRentCount?: number;
  commercialSaleCount?: number;
}

interface SiteFooterSSRProps {
    showAbout?: boolean;
    communities?: Community[];
}

function SiteFooterSSR({showAbout = true, communities = []}: SiteFooterSSRProps) {
    return (
        <footer className="bg-black text-white">
            {/* Mobile Search Bar */}
            <div className="lg:hidden border-t border-gray-800">
                <div className="p-4">
                    <div className="flex space-x-2">
                        <Link
                            href="/properties/for-sale"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-center hover:bg-gray-700 transition-colors"
                        >
                            Search Properties
                        </Link>
                        <Link
                            href="/communities"
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors"
                        >
                            Areas
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        
                        {/* Company Info */}
                        <div className="space-y-4">
                            <Link href="/" className="block">
                                <Image
                                    src="/trpe-logo.webp"
                                    alt="TRPE Logo"
                                    width={121}
                                    height={32}
                                    className="h-8 w-auto"
                                />
                            </Link>
                            <p className="text-gray-400 text-sm">
                                Leading real estate agency in Dubai providing exceptional property services.
                            </p>
                            <div className="flex space-x-4">
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Facebook size={20} />
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Instagram size={20} />
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Linkedin size={20} />
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Youtube size={20} />
                                </Link>
                            </div>
                        </div>

                        {/* Properties */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Properties</h3>
                            <div className="space-y-2">
                                <Link href="/properties/for-sale" className="block text-gray-400 hover:text-white transition-colors">
                                    Properties for Sale
                                </Link>
                                <Link href="/properties/for-rent" className="block text-gray-400 hover:text-white transition-colors">
                                    Properties for Rent
                                </Link>
                                <Link href="/properties/commercial" className="block text-gray-400 hover:text-white transition-colors">
                                    Commercial Properties
                                </Link>
                                <Link href="/property-types/apartments" className="block text-gray-400 hover:text-white transition-colors">
                                    Apartments
                                </Link>
                                <Link href="/property-types/villas" className="block text-gray-400 hover:text-white transition-colors">
                                    Villas
                                </Link>
                                <Link href="/property-types/townhouses" className="block text-gray-400 hover:text-white transition-colors">
                                    Townhouses
                                </Link>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Services</h3>
                            <div className="space-y-2">
                                <Link href="/services" className="block text-gray-400 hover:text-white transition-colors">
                                    All Services
                                </Link>
                                <Link href="/list-with-us" className="block text-gray-400 hover:text-white transition-colors">
                                    List with Us
                                </Link>
                                <Link href="/property-management" className="block text-gray-400 hover:text-white transition-colors">
                                    Property Management
                                </Link>
                                <Link href="/valuation" className="block text-gray-400 hover:text-white transition-colors">
                                    Property Valuation
                                </Link>
                            </div>
                        </div>

                        {/* Popular Areas */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Popular Areas</h3>
                            <div className="space-y-2">
                                {communities.slice(0, 6).map((community) => (
                                    <Link 
                                        key={community.slug} 
                                        href={`/communities/${community.slug}`} 
                                        className="block text-gray-400 hover:text-white transition-colors"
                                    >
                                        {community.name}
                                    </Link>
                                ))}
                                <Link href="/communities" className="block text-gray-400 hover:text-white transition-colors">
                                    View All Areas
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    {showAbout && (
                        <div className="mt-12 pt-8 border-t border-gray-800">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">About TRPE</h3>
                                    <div className="space-y-2">
                                        <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                                            About Us
                                        </Link>
                                        <Link href="/team" className="block text-gray-400 hover:text-white transition-colors">
                                            Our Team
                                        </Link>
                                        <Link href="/careers" className="block text-gray-400 hover:text-white transition-colors">
                                            Careers
                                        </Link>
                                        <Link href="/insights" className="block text-gray-400 hover:text-white transition-colors">
                                            Market Insights
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                                    <div className="space-y-2 text-gray-400">
                                        <p>Phone: +971 4 123 4567</p>
                                        <p>Email: info@trpe.ae</p>
                                        <p>Address: Dubai, UAE</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Copyright */}
                    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                        <p>&copy; 2025 TRPE. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default SiteFooterSSR;
