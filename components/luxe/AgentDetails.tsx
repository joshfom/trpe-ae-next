import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface AgentDetailItemProps {
  name: string;
  title: string;
  image: string;
  description: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  slug?: string;
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
  slug,
  isReversed = false
}) => {
  const content = (
    <motion.div 
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-start gap-8 lg:gap-12 py-12 border-b border-gray-200 last:border-b-0 group transition-all duration-300 ${slug ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Agent Image */}
      <div className="w-full lg:w-1/2 flex-shrink-0">
        <img 
          src={image}
          alt={name}
          className={`w-full h-64 lg:h-[500px] object-cover transition-transform duration-300 ${slug ? 'group-hover:scale-105' : ''}`}
        />
      </div>
      
      {/* Agent Info */}
      <div className="w-full h-full lg:w-1/2 flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center max-w-2xl h-full">
          <h3 className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-playfair transition-colors duration-300 ${slug ? 'group-hover:text-gold-600' : ''}`}>
            {name}
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            {title}
          </p>

          <div dangerouslySetInnerHTML={{ __html: description }} className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-8 prose-p:my-1">
          </div>
          
          {slug && (
            <div className="mt-4">
              <span className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full transition-all duration-300 hover:bg-gray-800 hover:shadow-lg">
                View Profile
                <svg className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // If slug is provided, wrap in Link, otherwise just return the content
  if (slug) {
    return (
      <Link href={`/luxe/advisors/${slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
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
    slug?: string;
  }>;
}

const AgentDetails: React.FC<AgentDetailsProps> = ({ agents }) => {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-0">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-playfair">
            Meet Our Specialists
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get to know the dedicated professionals who will guide you through your luxury real estate journey 
            with expertise, integrity, and personalized service.
          </p>
        </motion.div>
        
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
              slug={agent.slug}
              isReversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
