import React from 'react';
import { getLuxeAgentsAction } from '@/actions/agents/get-luxe-agents-action';
import AboutUsClient from './AboutUsClient';
import AboutUsSSR from './AboutUsSSR';
import SSRToCSRSwitcher from '../components/SSRToCSRSwitcher';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Luxe Collection | Dubai Premium Real Estate | TRPE',
  description: 'Discover the story behind our luxury real estate collection. Premium service, exclusive properties, and unmatched expertise in Dubai\'s luxury market.',
  openGraph: {
    title: 'About Luxe Collection | Dubai Premium Real Estate | TRPE',
    description: 'Discover the story behind our luxury real estate collection. Premium service, exclusive properties, and unmatched expertise in Dubai\'s luxury market.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        width: 1200,
        height: 630,
        alt: 'About Luxe Collection - Dubai Premium Real Estate',
      },
    ],
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL}/luxe/about-us`,
  },
};

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
