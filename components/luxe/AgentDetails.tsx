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
      <div className="w-full lg:w-1/2 flex-shrink-0">
        <img 
          src={image}
          alt={name}
          className="w-full h-64 lg:h-[500px] object-cover"
        />
      </div>
      
      {/* Agent Info */}
      <div className="w-full h-full lg:w-1/2 flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center max-w-2xl h-full">
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-playfair">
            {name}
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            {title}
          </p>

          <div dangerouslySetInnerHTML={{ __html: description }} className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">

          </div>
          
          {/* Contact Icons */}
         
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
      <div className="max-w-7xl mx-auto px-6 lg:px-0">
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
