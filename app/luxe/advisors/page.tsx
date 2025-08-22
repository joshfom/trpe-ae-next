import React from 'react';
import {getLuxeAgentsAction} from '@/actions/agents/get-luxe-agents-action';
import LuxeAdvisorsClient from './LuxeAdvisorsClient';
import LuxeAdvisorsSSR from './LuxeAdvisorsSSR';

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
      
      {/* Script to show enhanced version when JS is available */}
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Wait for DOM to be ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', switchToClientVersion);
              } else {
                switchToClientVersion();
              }
              
              function switchToClientVersion() {
                try {
                  const ssrElement = document.querySelector('.ssr-version');
                  const jsElement = document.querySelector('.js-enhanced');
                  
                  if (ssrElement && jsElement) {
                    // Hide SSR version
                    ssrElement.style.display = 'none';
                    // Show client version
                    jsElement.style.display = 'block';
                    
                    // Add a class to indicate JS is active
                    document.documentElement.classList.add('js-enabled');
                  }
                } catch (error) {
                  console.warn('Failed to switch to client version:', error);
                  // If anything fails, keep SSR version visible
                }
              }
            })();
          `
        }} 
      />
    </>
  );
};

export default OurTeamPage;
