import React from 'react';

interface LuxeInsightPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LuxeInsightPage({ params }: LuxeInsightPageProps) {
  const { slug } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Luxe Insight</h1>
      <p className="text-gray-600">
        Luxe insight content for slug: {slug}
      </p>
      <p className="text-sm text-gray-500 mt-4">
        This page is under development.
      </p>
    </div>
  );
}