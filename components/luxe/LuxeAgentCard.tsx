import React from "react";
import Image from "next/image";

interface LuxeAgentCardProps {
  name: string;
  title: string;
  image: string;
  description: string;
  phone?: string;
  email?: string;
}

const LuxeAgentCard: React.FC<LuxeAgentCardProps> = ({
  name,
  title,
  image,
  description,
  phone,
  email
}) => {
  return (
    <div className="group relative bg-white  overflow-hidden transition-all duration-500 transform hover:-translate-y-2">
      {/* Agent Image */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Agent Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-2xl font-bold font-playfair mb-1">{name}</h3>
        <p className="text-lg text-gray-300 mb-3">{title}</p>
        <p className="text-sm text-gray-200 leading-relaxed mb-4">{description}</p>
        
        {/* Contact Buttons */}
        <div className="flex gap-3">
          {phone && (
            <a 
              href={`tel:${phone}`}
              className="flex items-center justify-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm font-medium">Call</span>
            </a>
          )}
          {email && (
            <a 
              href={`mailto:${email}`}
              className="flex items-center justify-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Email</span>
            </a>
          )}
        </div>
      </div>
      
      {/* Static Info (always visible) */}
      <div className="p-6 bg-white">
        <h3 className="text-xl font-bold font-playfair text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600">{title}</p>
      </div>
    </div>
  );
};

export default LuxeAgentCard;
