import React from "react";
import Image from "next/image";

interface AgentDetailItemProps {
  name: string;
  title: string;
  image: string;
  description: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  isReversed?: boolean;
}

const AgentDetailItem: React.FC<AgentDetailItemProps> = ({
  name,
  title,
  image,
  description,
  phone,
  email,
  linkedin,
  isReversed = false
}) => {
  return (
    <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-start gap-8 lg:gap-12 py-12 border-b border-gray-200 last:border-b-0`}>
      {/* Agent Image */}
      <div className="w-full lg:w-1/3 flex-shrink-0">
        <img 
          src={image}
          alt={name}
          className="w-full h-64 lg:h-[500px] object-cover"
        />
      </div>
      
      {/* Agent Info */}
      <div className="w-full lg:w-2/3 flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center max-w-2xl h-full">
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-playfair">
            {name}
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            {title}
          </p>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
            <p>{description}</p>
          </div>
          
          {/* Contact Icons */}
          <div className="flex items-center gap-4">
            {phone && (
              <a 
                href={`tel:${phone}`}
                className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                aria-label="Call"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </a>
            )}
            
            {email && (
              <a 
                href={`mailto:${email}`}
                className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                aria-label="Email"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            )}
            
            {linkedin && (
              <a 
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AgentDetailsProps {
  agents: Array<{
    name: string;
    title: string;
    image: string;
    description: string;
    phone?: string;
    email?: string;
    linkedin?: string;
  }>;
}

const AgentDetails: React.FC<AgentDetailsProps> = ({ agents }) => {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-playfair">
            Meet Our Specialists
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get to know the dedicated professionals who will guide you through your luxury real estate journey 
            with expertise, integrity, and personalized service.
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {agents.map((agent, index) => (
            <AgentDetailItem
              key={index}
              name={agent.name}
              title={agent.title}
              image={agent.image}
              description={agent.description}
              phone={agent.phone}
              email={agent.email}
              linkedin={agent.linkedin}
              isReversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
