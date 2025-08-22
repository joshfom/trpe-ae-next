import React from 'react';
import {getLuxeInsightsAction} from '@/actions/insights/get-luxe-insights-action';
import LuxeJournalsClient from './LuxeJournalsClient';
import LuxeJournalsSSR from './LuxeJournalsSSR';
import { Metadata } from 'next';

// Force dynamic rendering to handle searchParams properly
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Luxe Journals | The Real Property Experts',
  description: 'Exclusive journals and trends from Dubai\'s luxury real estate market. Discover insights from Dubai\'s luxury real estate experts.',
  openGraph: {
    title: 'Luxe Journals | The Real Property Experts',
    description: 'Exclusive journals and trends from Dubai\'s luxury real estate market.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Luxe Journals - Dubai Luxury Real Estate',
      },
    ],
    type: 'website',
  },
  alternates: {
    canonical: '/luxe/journals',
  },
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function LuxeJournalsPage({ searchParams }: PageProps) {
  // Await searchParams and get page from search params or default to 1
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  
  // Fetch real luxe insights data from the database
  const insightsResult = await getLuxeInsightsAction(currentPage, 9);
  
  // Extract insights and pagination data
  const insights = insightsResult.success ? insightsResult.data.insights : [];
  const pagination = insightsResult.data.pagination;
  
  // Log error if data fetching failed
  if (!insightsResult.success) {
    console.warn('Error fetching luxe insights:', insightsResult.error);
  }

  return (
    <>
      {/* SSR Version - Always renders first for SEO and no-JS users */}
      <div id="ssr-journals">
        <LuxeJournalsSSR insights={insights} pagination={pagination} />
      </div>
      
      {/* Client-Side Version - Will hydrate and replace SSR version when JS loads */}
      <div id="csr-journals" style={{ display: 'none' }}>
        <LuxeJournalsClient insights={insights} pagination={pagination} />
      </div>

      {/* Enhancement Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              // Switch from SSR to CSR version
              const ssrElement = document.getElementById('ssr-journals');
              const csrElement = document.getElementById('csr-journals');
              
              if (ssrElement && csrElement) {
                // Hide SSR version
                ssrElement.style.display = 'none';
                // Show CSR version
                csrElement.style.display = 'block';
              }
            });
          `
        }}
      />
    </>
  );
}
