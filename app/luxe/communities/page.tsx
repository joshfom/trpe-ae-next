import { Metadata } from 'next';
import { getFooterLuxeCommunities } from '@/actions/get-footer-luxe-communities-action';
import LuxuryCommunities from '@/components/luxe/LuxuryCommunities';

interface CommunityData {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  propertyCount: number;
  slug: string;
}

export const metadata: Metadata = {
  title: 'Luxe Communities | Dubai\'s Most Prestigious Neighborhoods | TRPE',
  description: 'Discover Dubai\'s most coveted luxury communities. From Downtown Dubai to Palm Jumeirah, explore world-class amenities and sophisticated living in the UAE\'s premier locations.',
  keywords: 'luxury communities Dubai, prestigious neighborhoods, Downtown Dubai, Palm Jumeirah, Emirates Hills, Dubai Marina, luxury real estate',
};

export default async function LuxeCommunitiesPage() {
  let communitiesData: CommunityData[] = [];
  
  try {
    const luxeCommunities = await getFooterLuxeCommunities() || [];
    
    // Transform luxe communities data to match LuxuryCommunities component format
    communitiesData = luxeCommunities.map(community => ({
      id: community.id,
      name: community.name,
      location: community.name, // Use name as location for now
      imageUrl: community.image || `/images/communities/${community.slug}.jpg`,
      propertyCount: community.propertyCount || 0,
      slug: community.slug
    }));
  } catch (error) {
    console.error('Error fetching communities:', error);
  }
  
  // If no data from API or fallback needed, use default communities
  if (communitiesData.length === 0) {
    communitiesData = [
      {
        id: '1',
        name: 'Downtown Dubai',
        location: 'Downtown Dubai',
        imageUrl: '/images/communities/downtown-dubai.jpg',
        propertyCount: 250,
        slug: 'downtown-dubai'
      },
      {
        id: '2',
        name: 'Palm Jumeirah',
        location: 'Palm Jumeirah',
        imageUrl: '/images/communities/palm-jumeirah.jpg',
        propertyCount: 180,
        slug: 'palm-jumeirah'
      },
      {
        id: '3',
        name: 'Emirates Hills',
        location: 'Emirates Hills',
        imageUrl: '/images/communities/emirates-hills.jpg',
        propertyCount: 95,
        slug: 'emirates-hills'
      },
      {
        id: '4',
        name: 'Dubai Marina',
        location: 'Dubai Marina',
        imageUrl: '/images/communities/dubai-marina.jpg',
        propertyCount: 320,
        slug: 'dubai-marina'
      },
      {
        id: '5',
        name: 'Jumeirah Beach Residence',
        location: 'JBR',
        imageUrl: '/images/communities/jbr.jpg',
        propertyCount: 220,
        slug: 'jumeirah-beach-residence'
      },
      {
        id: '6',
        name: 'Business Bay',
        location: 'Business Bay',
        imageUrl: '/images/communities/business-bay.jpg',
        propertyCount: 280,
        slug: 'business-bay'
      }
    ];
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl lg:text-6xl font-playfair font-light mb-6">
            Luxe Communities
          </h1>
          <p className="text-xl lg:text-2xl font-light opacity-90 leading-relaxed">
            Discover Dubai's most prestigious neighborhoods where luxury meets lifestyle
          </p>
        </div>
      </section>

      {/* Communities Section */}
      <LuxuryCommunities 
        communities={communitiesData}
        className="py-20"
      />

      {/* Additional Content Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-playfair font-light text-gray-900 mb-6">
              Why Choose Luxe Communities?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Each luxury community offers unique amenities, world-class facilities, and exclusive lifestyle experiences 
              that define premium living in Dubai.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Properties</h3>
              <p className="text-gray-600">Exclusive access to the finest luxury properties in Dubai's most sought-after locations.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Prime Locations</h3>
              <p className="text-gray-600">Strategically positioned in Dubai's most prestigious and well-connected neighborhoods.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Luxury Amenities</h3>
              <p className="text-gray-600">World-class facilities including spas, golf courses, marinas, and exclusive club memberships.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
