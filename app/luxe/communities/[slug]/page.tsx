import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFooterLuxeCommunities } from '@/actions/get-footer-luxe-communities-action';

interface CommunityPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the community page
export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const communities = await getFooterLuxeCommunities();
  const community = communities?.find(c => c.slug === params.slug);
  
  if (!community) {
    return {
      title: 'Community Not Found | TRPE Luxe',
      description: 'The requested luxury community could not be found.',
    };
  }

  return {
    title: `${community.name} | Luxury Properties in Dubai | TRPE Luxe`,
    description: `Discover luxury properties in ${community.name}, one of Dubai's most prestigious communities. Experience world-class amenities and sophisticated living.`,
    keywords: `${community.name}, luxury properties Dubai, ${community.name} real estate, Dubai luxury communities`,
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const communities = await getFooterLuxeCommunities();
  const community = communities?.find(c => c.slug === params.slug);
  
  if (!community) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        {community.image && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${community.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl lg:text-6xl font-playfair font-light mb-6">
            {community.name}
          </h1>
          <p className="text-xl lg:text-2xl font-light opacity-90 leading-relaxed">
            Discover luxury living in one of Dubai's most prestigious communities
          </p>
          {community.propertyCount && community.propertyCount > 0 && (
            <div className="mt-8">
              <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-medium">
                {community.propertyCount} Luxury Properties Available
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Community Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-playfair font-light text-gray-900 mb-6">
                About {community.name}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {community.name} represents the pinnacle of luxury living in Dubai. This prestigious community 
                offers an exclusive lifestyle with world-class amenities, sophisticated architecture, and 
                unparalleled service standards.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Experience the finest in luxury real estate with properties that combine contemporary design 
                with timeless elegance, all set within one of Dubai's most sought-after locations.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-700">Premium luxury properties</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-700">World-class amenities and facilities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-700">Prime location in Dubai</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-700">Exclusive lifestyle experiences</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {community.image ? (
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-[500px] bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Image coming soon</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl lg:text-4xl font-playfair font-light text-gray-900 mb-6">
            Interested in {community.name}?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Our luxury property specialists are ready to help you find the perfect property 
            in this prestigious community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/luxe/contact-us"
              className="inline-block bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Contact Our Advisors
            </a>
            <a
              href="/luxe/properties"
              className="inline-block border border-black text-black px-8 py-3 rounded-md font-medium hover:bg-black hover:text-white transition-colors"
            >
              View Properties
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Generate static params for all communities
export async function generateStaticParams() {
  try {
    const communities = await getFooterLuxeCommunities();
    
    return communities?.map((community) => ({
      slug: community.slug,
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
