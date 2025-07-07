import React from 'react';
import {getLuxeInsightsAction} from '@/actions/insights/get-luxe-insights-action';
import LuxeJournalsClient from './LuxeJournalsClient';

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

  return <LuxeJournalsClient insights={insights} pagination={pagination} />;
}
