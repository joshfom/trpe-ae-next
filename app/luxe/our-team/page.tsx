import React from 'react';
import { LuxeAgentCard, AgentDetails } from '@/components/luxe';

const OurTeamPage: React.FC = () => {
  const agents = [
    {
      name: "Micheal Doe",
      title: "Local Agent",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
      description: "Specializing in luxury residential properties with over 15 years of experience in Dubai's premium real estate market. Known for exceptional client service and market expertise.",
      phone: "+971 50 123 4567",
      email: "micheal.doe@trpe.ae"
    },
    {
      name: "Sarah Johnson",
      title: "Senior Luxury Advisor",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=3387&auto=format&fit=crop",
      description: "Expert in waterfront properties and penthouses. Sarah brings a keen eye for luxury and a deep understanding of high-end client expectations.",
      phone: "+971 50 234 5678",
      email: "sarah.johnson@trpe.ae"
    },
    {
      name: "Ahmed Al-Rashid",
      title: "Investment Specialist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop",
      description: "Focused on investment opportunities and commercial real estate. Ahmed provides strategic insights for both local and international investors.",
      phone: "+971 50 345 6789",
      email: "ahmed.alrashid@trpe.ae"
    },
    {
      name: "Emma Rodriguez",
      title: "Luxury Property Consultant",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
      description: "Specializing in villa estates and exclusive developments. Emma's multilingual abilities serve our diverse international clientele.",
      phone: "+971 50 456 7890",
      email: "emma.rodriguez@trpe.ae"
    },
    {
      name: "James Wilson",
      title: "Senior Property Advisor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3387&auto=format&fit=crop",
      description: "With expertise in both residential and commercial sectors, James offers comprehensive real estate solutions for discerning clients.",
      phone: "+971 50 567 8901",
      email: "james.wilson@trpe.ae"
    },
    {
      name: "Fatima Al-Zahra",
      title: "Luxury Market Specialist",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=3571&auto=format&fit=crop",
      description: "Local market expert with deep knowledge of Dubai's luxury neighborhoods. Fatima ensures seamless transactions for high-value properties.",
      phone: "+971 50 678 9012",
      email: "fatima.alzahra@trpe.ae"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=4626&auto=format&fit=crop')"
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-playfair leading-tight">
              Meet Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                Agents
              </span>
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                Our distinguished team of luxury real estate professionals brings unparalleled expertise, 
                local market knowledge, and commitment to excellence in every transaction.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Each agent specializes in Dubai&apos;s most prestigious neighborhoods and exclusive properties, 
                ensuring you receive world-class service whether buying, selling, or investing in luxury real estate.
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-400/10 to-yellow-300/10 rounded-full blur-xl"></div>
      </div>

      {/* Agents Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-playfair">
            Luxury Real Estate Experts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the professionals who make your luxury real estate dreams a reality. 
            Our agents combine market expertise with personalized service to deliver exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {agents.map((agent, index) => (
            <LuxeAgentCard
              key={index}
              name={agent.name}
              title={agent.title}
              image={agent.image}
              description={agent.description}
              phone={agent.phone}
              email={agent.email}
            />
          ))}
        </div>
      </div>

      {/* Excellence & Experience Section */}
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-lg md:text-xl text-amber-400 font-medium mb-4 tracking-wide uppercase">
              Unmatched Excellence
            </h3>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 font-playfair leading-tight">
              Luxury Real Estate
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                Redefined
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
              With decades of combined experience and billions in luxury property transactions, 
              our team represents the pinnacle of real estate excellence in Dubai&apos;s most exclusive markets.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mb-12">
              From waterfront penthouses to private island estates, we curate extraordinary properties 
              for the world&apos;s most discerning clients. Our commitment to discretion, expertise, and 
              white-glove service has made us the trusted choice for luxury real estate in the region.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2 font-playfair">$2.5B+</div>
                <div className="text-gray-300 text-lg">Total Sales Volume</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2 font-playfair">500+</div>
                <div className="text-gray-300 text-lg">Luxury Properties Sold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2 font-playfair">25+</div>
                <div className="text-gray-300 text-lg">Years Combined Experience</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-yellow-300/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-400/3 to-yellow-300/3 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Agent details section  */}
      <AgentDetails 
        agents={[
          {
            name: "Micheal Doe",
            title: "Local Agent",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
            phone: "+971 50 123 4567",
            email: "micheal.doe@trpe.ae",
            linkedin: "https://linkedin.com/in/micheal-doe"
          },
          {
            name: "Sarah Johnson",
            title: "Senior Luxury Advisor",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=3387&auto=format&fit=crop",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
            phone: "+971 50 234 5678",
            email: "sarah.johnson@trpe.ae",
            linkedin: "https://linkedin.com/in/sarah-johnson"
          },
          {
            name: "Ahmed Al-Rashid",
            title: "Investment Specialist",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
            phone: "+971 50 345 6789",
            email: "ahmed.alrashid@trpe.ae",
            linkedin: "https://linkedin.com/in/ahmed-alrashid"
          },
          {
            name: "Emma Rodriguez",
            title: "Luxury Property Consultant",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
            phone: "+971 50 456 7890",
            email: "emma.rodriguez@trpe.ae",
            linkedin: "https://linkedin.com/in/emma-rodriguez"
          }
        ]}
      />

      {/* Call to action section  */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 py-24 lg:py-32">
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
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-playfair leading-tight">
                Ready to Find Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  Dream Property?
                </span>
              </h2>
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
              <button className="inline-flex items-center justify-center px-12 py-4 bg-black text-white font-semibold text-lg rounded-full hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-2xl">
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
    </div>
  );
};

export default OurTeamPage;
