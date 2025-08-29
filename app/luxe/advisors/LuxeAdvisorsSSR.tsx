import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Agent {
  name: string;
  title: string;
  image: string;
  description: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  slug?: string;
}

interface LuxeAdvisorsSSRProps {
  agents: Agent[];
}

// SSR-compatible Hero Section (without animations)
function HeroSectionSSR() {
  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1715168437311-18b9ec0830c1?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center z-10 bg-no-repeat bg-slate-800/40" />
      
      <div className="relative z-10 max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="text-center flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 font-playfair leading-tight">
            Meet Our
            <span className="block text-white">
              Advisors
            </span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 sm:mb-8">
              Our distinguished team of luxury real estate professionals brings unparalleled expertise, 
              local market knowledge, and commitment to excellence in every transaction.
            </p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              Each advisor specializes in Dubai&apos;s most prestigious neighborhoods and exclusive properties, 
              ensuring you receive world-class service whether buying, selling, or investing in luxury real estate.
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-white/20 to-gray-300/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-white/10 to-gray-300/10 rounded-full blur-xl"></div>
    </div>
  );
}

// SSR-compatible Excellence Section (without animations)
function ExcellenceSectionSSR() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black py-12 sm:py-16 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-sm sm:text-lg md:text-xl text-white font-medium mb-3 sm:mb-4 tracking-wide uppercase">
            Unmatched Excellence
          </h3>
          <h3 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 font-playfair leading-tight">
            Luxury Real Estate
            <span className="block text-white">
              Redefined
            </span>
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-6 sm:mb-8">
            With decades of combined experience and billions in luxury property transactions, 
            our team represents the pinnacle of real estate excellence in Dubai&apos;s most exclusive markets.
          </p>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 sm:mb-12">
            From waterfront penthouses to private island estates, we curate extraordinary properties 
            for the world&apos;s most discerning clients. Our commitment to discretion, expertise, and 
            white-glove service has made us the trusted choice for luxury real estate in the region.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-playfair">$2.5B+</div>
              <div className="text-gray-300 text-base sm:text-lg">Total Sales Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-playfair">500+</div>
              <div className="text-gray-300 text-base sm:text-lg">Luxury Properties Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-playfair">25+</div>
              <div className="text-gray-300 text-base sm:text-lg">Years Combined Experience</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-white/5 to-gray-300/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-white/3 to-gray-300/3 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

// SSR-compatible CTA Section (without animations)
function CTASectionSSR() {
  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 py-24 lg:py-32"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=4470&auto=format&fit=crop')"
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-playfair leading-tight">
              Ready to Find Your
              <span className="block text-white">
                Dream Property?
              </span>
            </h3>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl">
              Connect with our luxury real estate experts today and discover exclusive properties 
              that match your lifestyle and investment goals.
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
              From waterfront penthouses to private estates, we have access to Dubai&apos;s most 
              prestigious properties before they hit the market.
            </p>
          </div>

          {/* Right CTA */}
          <div className="flex-shrink-0 text-center lg:text-right">
            <button className="inline-flex items-center justify-center px-12 py-4 bg-black text-white font-semibold text-lg rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Contact Our Team
            </button>
            <p className="text-white/70 text-sm mt-4 max-w-xs">
              Schedule a consultation with our luxury property specialists
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
    </div>
  );
}

const LuxeAdvisorsSSR: React.FC<LuxeAdvisorsSSRProps> = ({ agents }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSectionSSR />

      {/* Excellence & Experience Section */}
      <ExcellenceSectionSSR />

      {/* Agent details section - SSR Safe */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {agents.map((agent, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-8 lg:gap-16`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {agent.name}
                    </h3>
                    <p className="text-xl text-black mb-4">
                      {agent.title}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {agent.description}
                    </p>
                  </div>

                  {/* Contact & Links */}
                  <div className="space-y-3">
                    {agent.phone && (
                      <p className="text-gray-700">
                        <span className="font-medium">Phone:</span>{' '}
                        <a 
                          href={`tel:${agent.phone}`}
                          className="text-black hover:text-gray-700"
                        >
                          {agent.phone}
                        </a>
                      </p>
                    )}
                    {agent.email && (
                      <p className="text-gray-700">
                        <span className="font-medium">Email:</span>{' '}
                        <a 
                          href={`mailto:${agent.email}`}
                          className="text-black hover:text-gray-700"
                        >
                          {agent.email}
                        </a>
                      </p>
                    )}
                    {agent.linkedin && (
                      <p className="text-gray-700">
                        <span className="font-medium">LinkedIn:</span>{' '}
                        <a 
                          href={agent.linkedin}
                          className="text-black hover:text-gray-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Profile
                        </a>
                      </p>
                    )}
                  </div>

                  {/* View Profile Button */}
                  {agent.slug && (
                    <div className="pt-4">
                      <Link
                        href={`/luxe/advisors/${agent.slug}`}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        View Full Profile
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action section */}
      <CTASectionSSR />
    </div>
  );
};

export default LuxeAdvisorsSSR;
