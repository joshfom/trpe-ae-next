import React from 'react';
import {getLuxeAgentsAction} from '@/actions/agents/get-luxe-agents-action';
import LuxeAdvisorsClient from './LuxeAdvisorsClient';
import LuxeAdvisorsSSR from './LuxeAdvisorsSSR';
import SSRToCSRSwitcher from '../components/SSRToCSRSwitcher';

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
