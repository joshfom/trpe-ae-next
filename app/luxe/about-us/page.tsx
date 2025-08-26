import React from 'react';
import { getLuxeAgentsAction } from '@/actions/agents/get-luxe-agents-action';
import AboutUsClient from './AboutUsClient';
import AboutUsSSR from './AboutUsSSR';
import SSRToCSRSwitcher from '../components/SSRToCSRSwitcher';

export default async function AboutPage() {
  // Fetch agents data on the server
  const { success, data: agents } = await getLuxeAgentsAction();
  const agentsData = success ? agents : [];

  return (
    <>
      {/* SSR Version - Always renders first for SEO and no-JS users */}
      <div className="ssr-version">
        <AboutUsSSR agents={agentsData} />
      </div>
      
      {/* Client-Side Version - Will hydrate and replace SSR version when JS loads */}
      <div style={{ display: 'none' }} className="js-enhanced">
        <AboutUsClient agents={agentsData} />
      </div>
      
      {/* Component to handle SSR to CSR switching */}
      <SSRToCSRSwitcher ssrSelector=".ssr-version" csrSelector=".js-enhanced" />
    </>
  );
}
