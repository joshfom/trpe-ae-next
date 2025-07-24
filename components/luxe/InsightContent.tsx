import Image from 'next/image';
import { Insight } from '@/types/insight';
import { TipTapView } from '@/components/TiptapView';

interface InsightContentProps {
  insight: Insight;
}

export function InsightContent({ insight }: InsightContentProps) {
  return (
    <article className="prose prose-sm max-w-none prose-p:my-1">
      {/* Mobile Title */}
      <h1 className="block lg:hidden text-2xl sm:text-3xl font-light text-gray-900 mb-6 leading-tight">
        {insight.title}
      </h1>

      {/* Article Content - Use TipTapView for proper HTML rendering */}
      <div className="text-gray-700 leading-relaxed">
        <TipTapView content={insight.content || ''} />
      </div>
    </article>
  );
}