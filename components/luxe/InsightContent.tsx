import Image from 'next/image';
import { Insight } from '@/types/insight';

interface InsightContentProps {
  insight: Insight;
}

export function InsightContent({ insight }: InsightContentProps) {
  // Split content into paragraphs
  const paragraphs = insight.content.split('\n\n').filter(p => p.trim());
  
  return (
    <article className="prose prose-lg max-w-none">

      {/* Mobile Title */}
      <h1 className="block lg:hidden text-2xl sm:text-3xl font-light text-gray-900 mb-6 leading-tight">
        {insight.title}
      </h1>

      {/* Article Content */}
      <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed">
        {/* First paragraph */}
        {paragraphs[0] && (
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
            {paragraphs[0]}
          </p>
        )}

        {/* Content Image */}
        <div className="relative w-full h-48 sm:h-64 lg:h-80 xl:h-96 rounded-lg overflow-hidden my-6 sm:my-8">
          <img
            src={insight.imageUrl}
            alt={insight.title}
            className="w-full h-full object-cover"
          />

        </div>

        {/* Section Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 mt-8 sm:mt-12 mb-4 sm:mb-6">
          Title
        </h2>

        {/* Remaining paragraphs */}
        {paragraphs.slice(1).map((paragraph, index) => (
          <p key={index} className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
