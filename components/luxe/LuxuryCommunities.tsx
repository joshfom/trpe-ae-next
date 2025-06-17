import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CommunityCardProps {
  id?: string;
  title: string;
  itemCount: number;
  imageUrl: string;
  href?: string;
}

const CommunityCard = ({ title, itemCount, imageUrl, href = "#" }: CommunityCardProps) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden">
      {/* Background Image */}
    <div className="relative h-[500px] w-full">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
    </div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
        {/* Property Type */}
        <div className="self-start">
          <span className="text-lg font-medium">
            {title}
          </span>
        </div>
        
        {/* Bottom Content */}
        <div className="flex items-center justify-between">
          {/* Item Count */}
          <span className="text-lg font-medium">
            {itemCount} Items
          </span>
          
          {/* Arrow Icon */}
          <div className="flex items-center justify-center transition-colors duration-300">
            <ArrowRight className="size-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface LuxuryCommunitiesProps {
  className?: string;
}

export default function LuxuryCommunities({ className = "" }: LuxuryCommunitiesProps) {
  const communities = [
    {
      id: "apartments",
      title: "Apartment",
      itemCount: 42,
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      href: "/communities/apartments"
    },
    {
      id: "villas",
      title: "Villa",
      itemCount: 119,
      imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      href: "/communities/villas"
    },
    {
      id: "penthouses",
      title: "Apartment",
      itemCount: 99,
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      href: "/communities/penthouses"
    }
  ];

  return (
    <section className={`w-full py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-playfair font-light text-gray-900 mb-4">
            Luxury Communities
          </h2>
        </div>
        
        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <CommunityCard
              key={community.id}
              title={community.title}
              itemCount={community.itemCount}
              imageUrl={community.imageUrl}
              href={community.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
