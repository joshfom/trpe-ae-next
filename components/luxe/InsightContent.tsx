import Image from 'next/image';
import { Insight } from '@/types/insight';
import { ServerProcessedTiptap } from '@/components/ServerProcessedTiptap';

interface InsightContentProps {
  insight: Insight;
}

export function InsightContent({ insight }: InsightContentProps) {
  return (
    <article className="prose prose-lg max-w-none">
      {/* Mobile Title */}
      <h1 className="block lg:hidden text-2xl sm:text-3xl font-light text-gray-900 mb-6 leading-tight">
        {insight.title}
      </h1>

      {/* Article Content - Use ServerProcessedTiptap for proper HTML rendering */}
      <div className="text-gray-700 leading-relaxed">
        <ServerProcessedTiptap content={insight.content || ''} />
      </div>
    </article>
  );
}