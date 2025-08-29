import React from 'react';
import {getLuxeAgentsAction} from '@/actions/agents/get-luxe-agents-action';
import LuxeAdvisorsClient from './LuxeAdvisorsClient';
import LuxeAdvisorsSSR from './LuxeAdvisorsSSR';
import SSRToCSRSwitcher from '../components/SSRToCSRSwitcher';
import { LuxeAdvisorsSEO } from '@/components/seo/LuxeSEO';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxe Advisors | Dubai Luxury Real Estate Experts | TRPE',
  description: 'Meet our exclusive team of luxury real estate advisors in Dubai. Expert guidance for premium properties, penthouses, and luxury investments.',
  openGraph: {
    title: 'Luxe Advisors | Dubai Luxury Real Estate Experts | TRPE',
    description: 'Meet our exclusive team of luxury real estate advisors in Dubai. Expert guidance for premium properties, penthouses, and luxury investments.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Luxe Advisors - Dubai Luxury Real Estate Experts',
      },
    ],
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL}/luxe/advisors`,
  },
};

const OurTeamPage: React.FC = async () => {
  // Fetch real luxe agent data from the database
  const agentsResult = await getLuxeAgentsAction();
  
  // Map database agent data to the format expected by AgentDetails component
  const agents = agentsResult.success ? agentsResult.data.map(agent => ({
    name: `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'Agent',
    title: agent.title || 'Luxury Advisor',
    image: agent.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop',
    description: agent.bio || 'Dedicated luxury real estate professional committed to providing exceptional service and expertise in Dubai\'s most prestigious neighborhoods.',
    phone: agent.phone || undefined,
    email: agent.email || undefined,
    slug: agent.slug, // Add slug for individual advisor pages
    // Note: LinkedIn is not in the database schema, could be added later if needed
    linkedin: undefined
  })) : [];
  
  // If no agents are found, provide a fallback message or empty array
  if (!agentsResult.success || agents.length === 0) {
    console.warn('No luxe agents found or error fetching agents:', agentsResult.error);
  }

  return (
    <>
      {/* Luxe Advisors SEO with structured data and breadcrumbs */}
      <LuxeAdvisorsSEO advisors={agents} />
      
      {/* SSR Version - Always renders first for SEO and no-JS users */}
      <div className="ssr-version">
        <LuxeAdvisorsSSR agents={agents} />
      </div>
      
      {/* Client-Side Version - Will hydrate and replace SSR version when JS loads */}
      <div style={{ display: 'none' }} className="js-enhanced">
        <LuxeAdvisorsClient agents={agents} />
      </div>
      
      {/* Component to handle SSR to CSR switching */}
      <SSRToCSRSwitcher ssrSelector=".ssr-version" csrSelector=".js-enhanced" />
    </>
  );
};

export default OurTeamPage;
