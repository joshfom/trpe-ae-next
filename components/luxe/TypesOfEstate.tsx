import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface EstateType {
  id: string;
  title: string;
  itemCount: number;
  imageUrl: string;
  href: string;
}

export function TypesOfEstate() {
  const estateTypes: EstateType[] = [
    {
      id: 'apartment',
      title: 'Apartment',
      itemCount: 42,
      imageUrl: '/api/placeholder/400/500',
      href: '/luxe/properties?type=apartment'
    },
    {
      id: 'villa',
      title: 'Villa',
      itemCount: 119,
      imageUrl: '/api/placeholder/400/500',
      href: '/luxe/properties?type=villa'
    },
    {
      id: 'apartment-2',
      title: 'Apartment',
      itemCount: 99,
      imageUrl: '/api/placeholder/400/500',
      href: '/luxe/properties?type=apartment'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900">
            Types of estate
          </h2>
        </div>

        {/* Estate Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {estateTypes.map((estate, index) => (
            <EstateTypeCard key={`${estate.id}-${index}`} estate={estate} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface EstateTypeCardProps {
  estate: EstateType;
}

function EstateTypeCard({ estate }: EstateTypeCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Image Container */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <Image
          src={estate.imageUrl}
          alt={`${estate.title} properties`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          {/* Title */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-light mb-2">
              {estate.title}
            </h3>
          </div>
          
          {/* Bottom Content */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg sm:text-xl font-light">
                {estate.itemCount} Items
              </span>
            </div>
            
            {/* Arrow Icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 border border-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
              <ArrowRight size={20} className="sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
