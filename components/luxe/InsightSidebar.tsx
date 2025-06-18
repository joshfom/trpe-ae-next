import Image from 'next/image';
import { ShareButtons } from '@/components/luxe/ShareButtons';
import { Insight } from '@/types/insight';
import { Separator } from '../ui/separator';

interface InsightSidebarProps {
  insight: Insight;
}

export function InsightSidebar({ insight }: InsightSidebarProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Article Details */}
      <div className="bg-gray-50 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Details</h3>
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <span className="text-xs sm:text-sm text-gray-500 block">Date</span>
            <span className="text-sm sm:text-base text-gray-900">{insight.date}</span>
          </div>
          
          <div>
            <span className="text-xs sm:text-sm text-gray-500 block">Category</span>
            <span className="text-sm sm:text-base text-gray-900">{insight.category}</span>
          </div>
          
          <div>
            <span className="text-xs sm:text-sm text-gray-500 block">Reading</span>
            <span className="text-sm sm:text-base text-gray-900">{insight.readingTime}</span>
          </div>
        </div>
      </div>

      {/* Author Section */}
      <div className="bg-gray-50 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Author</h3>
        
        <div className="flex items-center space-x-3 sm:space-x-4">
            <img
            src={insight.author.avatar}
            alt={insight.author.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
            />
          
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{insight.author.name}</h4>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{insight.author.title}</p>
          </div>
        </div>
      </div>

      <Separator className="my-4 sm:my-6 bg-slate-700" />

      {/* Share Section */}
      <div className="bg-gray-50 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Share</h3>
        <ShareButtons insight={insight} />
      </div>
    </div>
  );
}
