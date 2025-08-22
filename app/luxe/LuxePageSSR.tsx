import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight, Search, MapPin, Bed, Bath, Maximize } from "lucide-react";

// Type definitions for props (same as client version)
interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  beds: number;
  baths: number;
  sqft: number;
  status: 'For Sale' | 'For Rent';
  imageUrl: string;
  slug: string;
}

interface CommunityData {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  propertyCount: number;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  slug: string;
  category: string;
}

interface LuxePageSSRProps {
  featuredProperties: PropertyData[];
  featuredCommunities: CommunityData[];
  featuredInsights: BlogPost[];
}

export default function LuxePageSSR({ 
  featuredProperties, 
  featuredCommunities,
  featuredInsights 
}: LuxePageSSRProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://www.nakheelcommunities.com/images/nakheelcommunitieslibraries/communities/palm-jumeirah2801cfc3-6328-423b-b735-3d3bb2a5c39c.jpg?sfvrsn=74da3db1_2')"
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            Luxury Real Estate
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl mb-8 opacity-90">
            Discover Dubai&apos;s Most Exclusive Properties
          </p>
          <p className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto opacity-80">
            From stunning penthouses to waterfront mansions, explore luxury living redefined in the heart of Dubai.
          </p>
          
          {/* Static Search Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="bg-white/20 text-white placeholder-white/70 rounded-lg px-4 py-3 border border-white/30">
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                </select>
                <select className="bg-white/20 text-white placeholder-white/70 rounded-lg px-4 py-3 border border-white/30">
                  <option value="">Location</option>
                  <option value="downtown">Downtown Dubai</option>
                  <option value="marina">Dubai Marina</option>
                  <option value="palm">Palm Jumeirah</option>
                </select>
                <select className="bg-white/20 text-white placeholder-white/70 rounded-lg px-4 py-3 border border-white/30">
                  <option value="">Price Range</option>
                  <option value="1-5m">1M - 5M AED</option>
                  <option value="5-10m">5M - 10M AED</option>
                  <option value="10m+">10M+ AED</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Luxury Properties
              </button>
            </form>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white">
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </div>
      </section>

      {/* Discover Luxury Living Section */}
      <section className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="aspect-[16/10] overflow-hidden rounded-lg mx-4 sm:mx-6">
              <img 
                src="/assets/luxryprop.webp" 
                alt="Luxury Property" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-4 sm:px-6 py-8 sm:py-12">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                  Discover Luxury Living
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed text-left">
                  From stunning gardens to carefully curated interiors, each villa is a sanctuary made for inward reflection and outward beauty. The Ocean Mansions at Jumeirah Asora Bay embody a transformative experience, where nature and timeless architecture converge, creating a life that feels both grounded and extraordinary.
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed text-left">
                  Jumeirah Residences represent an ultra-luxurious and serviced residential development brand, offering a lifestyle defined by exclusivity, originality and sophistication.
                </p>
                <Link 
                  href="/luxe/property/7-bedrooms-jumeirah-asora-bay-jumeirah-dubai-dxb-trpe-402" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[44px]"
                >
                  View Property 
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="flex min-h-[480px] xl:min-h-[520px]">
              <div className="w-1/2 overflow-hidden rounded-l-lg">
                <img 
                  src="/assets/luxryprop.webp" 
                  alt="Luxury Property" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-1/2 flex flex-col justify-center px-8 xl:px-12 py-12 bg-gray-50 rounded-r-lg">
                <div className="max-w-xl">
                  <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-6 xl:mb-8 text-black">
                    Discover Luxury Living
                  </h2>
                  <p className="text-base xl:text-lg text-gray-600 mb-6 xl:mb-8 leading-relaxed">
                    From stunning gardens to carefully curated interiors, each villa is a sanctuary made for inward reflection and outward beauty. The Ocean Mansions at Jumeirah Asora Bay embody a transformative experience, where nature and timeless architecture converge, creating a life that feels both grounded and extraordinary.
                  </p>
                  <p className="text-base xl:text-lg text-gray-600 mb-8 xl:mb-10 leading-relaxed">
                    Jumeirah Residences represent an ultra-luxurious and serviced residential development brand, offering a lifestyle defined by exclusivity, originality and sophistication.
                  </p>
                  <Link 
                    href="/luxe/property/7-bedrooms-jumeirah-asora-bay-jumeirah-dubai-dxb-trpe-402" 
                    className="inline-flex items-center px-6 xl:px-8 py-3 xl:py-4 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-colors text-base xl:text-lg font-medium"
                  >
                    View Property
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Properties Section */}
      <section className="w-full relative bg-white py-16 lg:py-20">
        <div 
          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[420px] overflow-hidden bg-cover bg-center relative rounded-lg mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-7xl"
          style={{
            backgroundImage: "url('https://asset.mansionglobal.com/editorial/dubai-the-hottest-luxury-market-in-the-world-is-getting-a-fresh-influx-of-sparkling-new-builds/assets/NIaw0AnN6P/vela-viento-4-3500x1969.webp')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black from-33% via-black/50 via-66% to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center h-full">
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
                    Premium Properties
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                    Explore cutting-edge architectural masterpieces that define Dubai&apos;s skyline. Each development represents innovation in luxury living with world-class amenities.
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed">
                    From sustainable smart homes to iconic waterfront towers, discover properties that set new standards for modern living.
                  </p>
                </div>
                <div className="hidden lg:block lg:w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="w-full py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Luxury Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Handpicked selection of the finest luxury properties in Dubai
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Link key={property.id} href={`/luxe/property/${property.slug}`}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={property.imageUrl} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        property.status === 'For Sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {property.status}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        {property.currency} {property.price.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.beds} Beds
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.baths} Baths
                      </div>
                      {property.sqft && (
                        <div className="flex items-center">
                          <Maximize className="w-4 h-4 mr-1" />
                          {property.sqft} sqft
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="w-full py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Dubai&apos;s Most Coveted Corners
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the most exclusive luxury communities across Dubai
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCommunities.map((community) => (
              <Link key={community.id} href={`/communities/${community.slug}?type=luxe`}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={community.imageUrl} 
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{community.name}</h3>
                    <p className="text-gray-600 mb-4">{community.location}</p>
                    <p className="text-sm text-gray-500">{community.propertyCount} Properties</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Insights/Blog Section */}
      <section className="w-full py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Luxury Market Insights
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay informed with the latest trends and insights from Dubai&apos;s luxury real estate market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredInsights.map((insight) => (
              <Link key={insight.id} href={`/insights/${insight.slug}`}>
                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={insight.imageUrl} 
                      alt={insight.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {insight.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{insight.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{insight.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{insight.author}</span>
                      <span>{insight.date}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="w-full py-20 lg:py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Connect with our luxury real estate experts today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/properties?type=luxe"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
